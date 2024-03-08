import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, StyleSheet, Image, Platform, TextInput, Button, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome from Expo for stars
import apiUrl from './apiUrl';
import axios from 'axios';
let ToastAndroid;
if (Platform.OS === 'android') {
    ToastAndroid = require('react-native').ToastAndroid;
}
const ListGames = ({ usersData }) => {
    //console.log(user)
    const [gameData, setGameData] = useState([]);
    const [newComment, setNewComment] = useState('');

    const user = usersData.id;
    useEffect(() => {
        fetchGameData();

    }, []);
    const fetchGameData = async () => {
        console.log("Fetching Game Data")
        try {
            const response = await axios.get(`${apiUrl}/getGameData`);

            if (response.data.ok) {
                setGameData(response.data.gameData);
            } else {
                console.error('Error fetching travel data:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching travel data:', error);
        }
    };
    // console.log(gameData[0].comments)
    const [rating, setRating] = useState(0);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [itemRating, setItemRating] = useState(null);

    const [popupVisible, setPopupVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedGameId, setSelectedGameId] = useState(null);

    const handleStarPress = (index) => {
        setRating(index + 1);
    };

    const handleRate = (itemId, ratings) => {
        setSelectedItemId(itemId);
        setItemRating(ratings);
        setPopupVisible(true);
        fetchGameData()

    };

    const handleClosePopup = () => {
        setPopupVisible(false);
        setSelectedItemId(null);
        setItemRating(null)
        setRating(0);
    };

    const handleSubmitRating = async () => {
        // Handle rating submission here
        console.log(`Rating ${rating} submitted for item ${selectedItemId}`);
        const formData = {
            selectedItemId,
            itemRating,
            rating
        };
        console.log(formData);
        try {
            // Make a POST request to your backend API using Axios
            const response = await axios.post(`${apiUrl}/addRating`, formData);

            const result = response.data;
            console.log(result);

            // Handle success
            if (result.ok) {
                if (ToastAndroid) {
                    ToastAndroid.show('Rating added successfully', ToastAndroid.SHORT);
                } else {
                    alert('Rating added successfully');
                }
            } else {
                // Show an error toast
                if (ToastAndroid) {
                    ToastAndroid.show(result.message || 'Error saving record', ToastAndroid.SHORT);
                } else {
                    alert('Error saving record');
                }
            }
        } catch (error) {
            console.error('Error during rating submission:', error);
            // Handle error toast
            if (ToastAndroid) {
                ToastAndroid.show('Error during rating submission', ToastAndroid.SHORT);
            } else {
                alert('Error during rating submission');
            }
        }

        fetchGameData();
        handleClosePopup();
    };


    const addComment = async (itemId, newComment) => {
        const formData = {
            itemId,
            newComment,
            user
        };
        console.log(formData);
        try {
            // Make a POST request to your backend API using Axios
            const response = await axios.post(`${apiUrl}/addComment`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = response.data;
            console.log(result);

            // Handle success
            if (result.ok) {
                if (ToastAndroid) {
                    ToastAndroid.show('Comment added successfully', ToastAndroid.SHORT);
                } else {
                    alert('Comment added successfully');
                }
                setNewComment('');
            } else {
                // Show an error toast
                if (ToastAndroid) {
                    ToastAndroid.show(result.message || 'Error saving record', ToastAndroid.SHORT);
                } else {
                    alert('Error saving record');
                }
            }
        } catch (error) {
            console.error('Error during comment addition:', error);
            // Handle error toast
            if (ToastAndroid) {
                ToastAndroid.show('Error during comment addition', ToastAndroid.SHORT);
            } else {
                alert('Error during comment addition');
            }
        }

        fetchGameData();

        setModalVisible(false); // Close the modal after adding comment
    };
    const deleteComment = async (commentID) => {
        const formData = {
            commentID
        };
        console.log(formData);
        try {
            // Make a POST request to your backend API using Axios
            const response = await axios.post(`${apiUrl}/deleteComment`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = response.data;
            console.log(result);

            // Handle success
            if (result) {
                if (ToastAndroid) {
                    ToastAndroid.show('Comment deleted successfully', ToastAndroid.SHORT);
                } else {
                    alert('Comment deleted successfully');
                }
                fetchGameData();
            } else {
                // Show an error toast
                if (ToastAndroid) {
                    ToastAndroid.show(result.message || 'Error saving record', ToastAndroid.SHORT);
                } else {
                    alert('Error saving record');
                }
            }
        } catch (error) {
            console.error('Error during comment deletion:', error);
            // Handle error toast
            if (ToastAndroid) {
                ToastAndroid.show('Error during comment deletion', ToastAndroid.SHORT);
            } else {
                alert('Error during comment deletion');
            }
        }
    };
    const renderItem = ({ item }) => (
        <View style={{ borderBottomWidth: 1, borderColor: '#CCCCCC', paddingVertical: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                {/* Image */}
                <Image source={{ uri: item.image }} style={{ width: 50, height: 50, marginRight: 10 }} />

                {/* Name */}
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20 }}>{item.name}</Text>
                    <Text>Year: {item.year}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={styles.rateButton} onPress={() => handleRate(item.id, item.rating)}>
                        <Text>Rate</Text>
                    </TouchableOpacity>
                </View>
                {/* Rating with stars */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {[...Array(Math.floor(item.rating))].map((_, index) => (
                        <FontAwesome key={index} name="star" size={24} color="gold" />
                    ))}
                    {/* Add a half-filled star if the rating is not an integer */}
                    {item.rating % 1 !== 0 && (
                        <FontAwesome name="star-half-full" size={24} color="gold" />
                    )}
                    {/* Fill the remaining stars with empty stars */}
                    {[...Array(5 - Math.ceil(item.rating))].map((_, index) => (
                        <FontAwesome key={index} name="star-o" size={24} color="gold" />
                    ))}
                </View>
            </View>
            {/* Display comments */}
            <View>
                {item.comments.map((comment, index) => (
                    <View key={index} style={{ flexDirection: 'row', paddingHorizontal: 10, borderBottomWidth: 1, borderColor: '#CCCCCC' }}>
                        {/* Column for firstname */}
                        <View style={{ flex: 1, paddingRight: 5, marginBottom: 5 }}>
                            <Text style={{ fontWeight: 'bold' }}>{comment.firstname}</Text>
                        </View>
                        {/* Column for comment */}
                        <View style={{ flex: 4 }}>
                            <Text>{comment.comment}</Text>
                        </View>
                        {usersData.role === 'moderator' && (
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity onPress={() => deleteComment(comment.id)}>
                                    <FontAwesome key={index} name="trash" size={16} color="black" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ))}
                {/* Input for adding new comment */}
                {/* <View style={{ paddingHorizontal: 10 }}>
                    <TextInput
                        placeholder="Add a comment..."
                        value={newComment}
                        onChangeText={setNewComment}
                        onSubmitEditing={() => addComment(item.id, newComment)}
                    />
                </View> */}
                <Button color='black' title="Add Comment" onPress={() => { setSelectedGameId(item.id); setModalVisible(true); }} />

            </View>

        </View>
    );


    return (
        <>
            {Platform.OS === 'android' || Platform.OS === 'ios' ? (
                <View >
                    <FlatList
                        data={gameData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        keyboardShouldPersistTaps="handled"
                    />
                </View>
            ) : (
                <ScrollView style={{ flex: 1 }}>
                    <FlatList
                        data={gameData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        keyboardShouldPersistTaps="handled"
                        style={{ marginBottom: 30 }}
                    />
                </ScrollView>
            )}

            <Modal visible={popupVisible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.heading}>Give your rating</Text>
                        <View style={styles.starContainer}>
                            {[...Array(5)].map((_, index) => (
                                <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
                                    <FontAwesome
                                        name={index < rating ? 'star' : 'star-o'}
                                        size={32}
                                        color={index < rating ? 'gold' : 'black'}
                                        style={styles.star}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleClosePopup}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <View style={{ width: 10 }} />

                            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmitRating}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.heading}>Add a Comment</Text>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Type your comment here..."
                            value={newComment}
                            onChangeText={setNewComment}
                            multiline={true}
                        />
                        {/* <View style={styles.buttonContainer}>
                            <Button style={{marginRight:50,backgroundColor:'black'}} title="Add Comment" onPress={() => addComment(selectedGameId, newComment)} />
                            <View style={{ width: 10 }} />
                            <Button title="Cancel" onPress={() => setModalVisible(false)} />
                        </View> */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <View style={{ width: 10 }} />

                            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={() => addComment(selectedGameId, newComment)}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </>

    );
};
const styles = StyleSheet.create({
    roundButton: {
        width: 100,
        height: 50,
        backgroundColor: 'black', // You can change the color
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'row'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 50,
        borderRadius: 10,
        elevation: 5,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    starContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    star: {
        marginRight: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: 'gray',
    },
    submitButton: {
        backgroundColor: '#006e96',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    commentInput: {
        padding: 10,
        marginBottom: 20
    }
})
export default ListGames;
