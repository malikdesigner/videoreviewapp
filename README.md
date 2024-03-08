First clone the project to your pc
Install Expo CLI: If you haven't already installed Expo CLI, you can do so globally by running the following command in your terminal:

npm install -g expo-cli

Then install the libraries in go to client folder in terminal
npm install 

Then install the libraries in go to backend folder in terminal
npm install 

Need to change the apiUrl in component/apiUrl.jsx. Add your own ip of your PC, you can check it by using ipconfig command in cmd and copy IPv4 Address.

Add two windows of terminal, navigate to client folder, and run the following command

npx expo start
To run on android you need to plug in your device and press a on command line but first need to download the expo app from playstore

To run on web you need to press w 

On second window navigate to backend folder and run the following command
npm start

There is a database sql file you need to import it on your sql local server and do change the credentials in index.js accordingly

