const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');



const app = express();
const port = 3304;

app.use(bodyParser.json());
// Increase the limit for URL-encoded payloads
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "QWERT!@#$%",
    database: "video_review"
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1); // Exit the process on connection error
    } else {
        console.log('Connected to MySQL');
    }
});
app.use(cors({
    origin: "*",
    methods: ["POST", "GET"],
    credentials: true
}))
app.post('/addUser', async (req, res) => {
    try {
        console.log("REQUEST");
        console.log(req.body);

        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            phoneCode,
            password,
            selectedRole
        } = req.body;

        const fullnumber = phoneCode + phoneNumber;
        const currentDate = new Date().toISOString(); // Get current date in ISO format

        const sql = `INSERT INTO tbl_user (firstname, lastname, email, phone_number, password,role, date_added) 
                    VALUES (?, ?, ?, ?, ?, ?,?)`;

        const result = await query(sql, [firstName, lastName, email, fullnumber, password, selectedRole, currentDate]);

        console.log('Record inserted successfully');
        res.status(200).json({ ok: true, message: 'Record inserted successfully' });
    } catch (error) {
        console.error('Error inserting record:', error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
});

app.post('/addVideo', async (req, res) => {
    try {
        console.log("REQUEST");
        console.log(req.body);

        const {
            gameName,
            year,
            imageUrl,
            latitude,
            longitude,
            userID
        } = req.body;
        console.log(req.body)
        const location = latitude + '|' + longitude;
        const currentDate = new Date().toISOString(); // Get current date in ISO format

        const sql = `INSERT INTO tbl_vide_games (name, year, image,location, added_by, date_added) 
                    VALUES (?, ?, ?, ?, ?, ?)`;

        const result = await query(sql, [gameName, year, imageUrl, location, userID, currentDate]);

        console.log('Record inserted successfully');
        res.status(200).json({ ok: true, message: 'Record inserted successfully' });
    } catch (error) {
        console.error('Error inserting record:', error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
});

app.post('/addRating', async (req, res) => {
    try {
        console.log("REQUEST");
        console.log(req.body);

        const { selectedItemId, itemRating, rating } = req.body;
        let newRating = 0;
        // Calculate the new rating
        if (itemRating == 0) {
            newRating = rating;
        }
        else {
            newRating = (itemRating + rating) / 2;
        }

        // Prepare the SQL query to update the rating of the selected item
        const sql = `UPDATE tbl_vide_games SET rating = ? WHERE id = ?`;

        // Execute the query
        const result = await query(sql, [newRating, selectedItemId]);

        console.log('Rating updated successfully');
        res.status(200).json({ ok: true, message: 'Rating updated successfully' });
    } catch (error) {
        console.error('Error updating rating:', error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
});

app.get('/getGameData', async (req, res) => {
    try {
        // Query to fetch game data along with comments and user details
        const gameQuery = `
            SELECT 
                g.id,
                g.name,
                g.year,
                g.image,
                g.rating,
                c.id AS comment_id,
                c.comment,
                u.firstname
            FROM 
                tbl_vide_games AS g
            LEFT JOIN 
                tbl_comments AS c ON g.id = c.gameId
            LEFT JOIN 
                tbl_user AS u ON c.added_by = u.id
            ORDER BY 
                g.id, c.id;
        `;

        const gameData = await query(gameQuery);

        if (gameData.length === 0) {
            return res.status(404).json({ ok: false, message: 'No Game Found' });
        }

        // Group comments by game ID
        const groupedData = gameData.reduce((acc, item) => {
            const { id, name, year, image, rating } = item;
            if (!acc[id]) {
                acc[id] = { id, name, year, image, rating, comments: [] };
            }
            if (item.comment_id) {
                acc[id].comments.push({ id: item.comment_id, comment: item.comment, firstname: item.firstname });
            }
            return acc;
        }, {});
        console.log(groupedData)

        const result = Object.values(groupedData);
        res.status(200).json({ ok: true, gameData: result });
    } catch (error) {
        console.error('Error fetching Game data:', error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
});

app.post('/addComment', async (req, res) => {
    try {
        console.log("REQUEST");
        console.log(req.body);

        const { itemId, newComment, user } = req.body;
        const currentDate = new Date().toISOString(); // Get current date in ISO format

        // Prepare the SQL query to add new comment of the selected item
        const sql = `INSERT INTO tbl_comments (comment, added_by, gameId, date_added) 
                    VALUES (?, ?, ?, ?)`;

        const result = await query(sql, [newComment, user, itemId, currentDate]);

        console.log('Comment added successfully');
        res.status(200).json({ ok: true, message: 'comment added successfully' });
    } catch (error) {
        console.error('Error updating rating:', error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
});

app.post('/deleteComment', async (req, res) => {
    try {
        const { commentID } = req.body;

        const sql = `
            DELETE FROM tbl_comments
            WHERE id = ?
        `;

        const result = await query(sql, [commentID]);

        if (result.affectedRows > 0) {
            console.log(`Comment with id ${commentID} deleted successfully`);
            res.status(200).json({ ok: true, message: 'comment deleted successfully' });
        } else {
            console.error(`Comment with id ${commentID} not found`);
            res.status(404).json({ ok: false, message: 'comment not found' });
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ ok: false, message: 'Internal Server Error' });
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Perform a query to check if the email and password match a user in the database
    const query = 'SELECT * FROM tbl_user WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: results[0] });
        }

        const user = results[0];
        // Compare hashed password with provided password
        if (user.password !== password) {
            return res.status(401).json({ message: results[0]});
        }

        // Valid login credentials
        console.log(user.id);
        res.json({ message: 'Login successful', user });
    });
});


function query(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
