import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, PermissionsAndroid } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; // Import Ionicons from Expo for the 3-dot icon
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Location from 'expo-location';
import apiUrl from './apiUrl';
import axios from 'axios';
import ListGames from './ListGames';



const MainPage = ({ navigation, route: routeProp }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const userName = useState(routeProp.params.user.firstname);
    const [longitute, setLogitute] = useState(null);
    const [latitude, setLatitute] = useState(null);
    const usersData = routeProp.params.user;
    const getLocationAsync = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Location permission not granted');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLogitute(location.coords.longitude)
        setLatitute(location.coords.latitude)

        console.log('Current location:', location.coords);
    };
    const openMenu = () => {
        if (menuVisible == false) {
            setMenuVisible(true);
        }
        else {
            setMenuVisible(false);

        }
    }
    const addNewVideoGame = () => {
        getLocationAsync();
        console.log('latitute' + latitude);
        console.log('longitude' + longitute);

        navigation.navigate('AddGame', { user: routeProp.params.user, longitute: longitute, latitude: latitude });
    }
    console.log(userName)
    const handleSignOut = () => {
        navigation.navigate('Login');
    };
    const [gameData, setGameData] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(`${apiUrl}/getGameData`);

    //             if (response.data.ok) {
    //                 setGameData(response.data.gameData);
    //             } else {
    //                 console.error('Error fetching travel data:', response.data.message);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching travel data:', error);
    //         }
    //     };
    //     fetchData();
    // }, []);
    console.log('MAIN PAGE')
    console.log(usersData)
    return (
        <View style={styles.container}>
            <View style={[styles.containerTop, { backgroundColor: 'black' }]}>
                {/* Custom top menu */}
                <TouchableOpacity style={{ marginRight: 10 }} onPress={openMenu}>
                    <FontAwesome5 name="bars" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.menuButton, { backgroundColor: 'black' }]} onPress={openMenu}>
                    <Ionicons name="ellipsis-vertical" size={24} color="white" />
                </TouchableOpacity>

                {/* Conditional rendering of the menu */}
                {menuVisible && (
                    <View style={styles.menu}>
                        <Text style={styles.menuItem}><FontAwesome5 name="user" size={24} color="white" />   {userName}</Text>
                        <Text style={styles.menuItem}><FontAwesome5 name="user-cog" size={24} color="white" />  {routeProp.params.user.role.charAt(0).toUpperCase() + routeProp.params.user.role.slice(1)}</Text>
                        <TouchableOpacity onPress={handleSignOut}>
                            <Text style={styles.menuItem}><FontAwesome5 name="sign-out-alt" size={24} color="white" />   Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <ListGames usersData={usersData} />
            <View style={styles.containerMain}>
                <TouchableOpacity style={styles.addButton} onPress={addNewVideoGame}>
                    <FontAwesome5 name="plus" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
    },
    containerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
        zIndex: 1,
        height: 40,
    },
    containerMain: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'flex-end', // Aligns the circular button to the bottom of the view
    },
    menuButton: {
        marginRight: 10,
        zIndex: 100,
        marginLeft: 70,
    },
    menu: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'grey',
        paddingHorizontal: 40,
        borderRadius: 5,
        zIndex: 999,
    },
    menuItem: {
        color: 'white',
        fontSize: 20,
        marginRight: 15,
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#006e96',
        width: 50,
        height: 50,
        borderRadius: 25, // Make it circular
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20, // Adjust as needed
        marginRight: 20, // Adjust as needed
        position: 'absolute',
        bottom: 20, // Adjust as needed
        right: 20, // Adjust as needed
        zIndex: 9999, // Ensure it's displayed on top
    },
});


export default MainPage;
