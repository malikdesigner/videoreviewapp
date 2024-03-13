import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; // Import Ionicons from Expo for the 3-dot icon
import Icon from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements';
import apiUrl from './apiUrl';
import axios from 'axios';
import * as Location from 'expo-location';

let ToastAndroid;
if (Platform.OS === 'android') {
    ToastAndroid = require('react-native').ToastAndroid;
}

const AddGame = ({ navigation, route: routeProp }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const userName = useState(routeProp.params.user.firstname);

    const openMenu = () => {
        if (menuVisible == false) {
            setMenuVisible(true);
        }
        else {
            setMenuVisible(false);

        }
    }
    const handleSignOut = () => {
        // Navigate to the login screen or any other screen as needed
        navigation.navigate('Login');
    };
    
    // const route = useRoute();
    // const userName = routeProp.params.user.firstname;

    const [step, setStep] = useState(2);
    const [gameName, setGameName] = useState('');
    const [year, setYear] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isChecked, setIsChecked] = useState(false)

    const showToast = (message) => {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
            ToastAndroid.CENTER,
            ToastAndroid.WHITE
            );
        };
        const getLocationAsync = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Location permission not granted');
                return;
            }
    
            let location = await Location.getCurrentPositionAsync({});
          return location;
    
           // console.log('Current location:', location.coords);
        };
      const getLocationAddress = async (latitude, longitude) => {
        //let urlLInk="https://geocode.maps.co/join/"; //get a new api key from here

        try {
            const response = await fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=65f19c0f3d28a781617842xtsaa8667`);
          
            const data = await response.json();

            // Log the response to understand its structure
            console.log(data);

            if (data && data.display_name) {
                // Extract the formatted address from the response
                const address =  data.address.city+', '+ data.address.country;
                return address;
            } else {
                console.error('Geocoding request failed:', data);
                return null;
            }
        } catch (error) {
            console.error('Error fetching geocoding data:', error);
            return null;
        }
    };

    //saving the video game  details into database
    const handleSubmit = async () => {
        console.log(isChecked);
        let userID = routeProp.params.user.id;
        let location = await getLocationAsync(); // Await the result of getLocationAsync()
        console.log(location);
        let address = await getLocationAddress(location.coords.latitude, location.coords.longitude); // Await the result of getLocationAddress() as well
        console.log(address);

        if (!isChecked) {
            if (ToastAndroid) {
                return showToast('Please accept terms & policy');
            } else {
                alert("Please Accept Terms and Policy");
            }
        } else {
            const formData = {
                gameName,
                year,
                imageUrl,
                address,
                userID
            };
            console.log(formData);
            try {
                // Make a POST request to your backend API using Axios
                const response = await axios.post(`${apiUrl}/addVideo`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const result = response.data;
                console.log(result);

                // Handle success
                if (result.ok) {
                    if (ToastAndroid) {
                        ToastAndroid.show('Record saved successfully', ToastAndroid.SHORT);
                    } else {
                        alert('Record saved successfully');
                    }
                    navigation.navigate('MainPage', { user: routeProp.params.user });
                } else {
                    // Show an error toast
                    if (ToastAndroid) {
                        ToastAndroid.show(result.message || 'Error saving record', ToastAndroid.SHORT);
                    } else {
                        alert('Error saving record');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                // Handle network error and show an error toast
                if (ToastAndroid) {
                    ToastAndroid.show('Network error', ToastAndroid.SHORT);
                } else {
                    alert('Network error');
                }
            }
        }
    };
    const handleBack = () => {
        setStep(step - 1);
        console.log("step" + step);
        if (step === 2) {
            navigation.navigate('MainPage', { user: routeProp.params.user });
        }
    };
    const handleNext = () => {
        // Perform validation
        if (step === 2 && (!gameName)) {
            if (ToastAndroid) {

                showToast('Please enter both game name');
            }
            else {
                alert('Please enter both game name');
            }
        } else if (step === 3 && !year) {
            if (ToastAndroid) {
                showToast('Please enter year');
            }
            else {
                alert('Please enter year')
            }
        } else if (step === 4 && !imageUrl) {
            if (ToastAndroid) {
                showToast('Please add image url');
            }
            else {
                alert('Please add image url')

            }
        } else {
            // Proceed to the next step if validation passes
            setStep(step + 1);
            console.log("Current Step" + step)
        }
    };
    // const requestStoragePermission = async () => {
    //     try {
    //         const granted = await PermissionsAndroid.request(
    //             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //             {
    //                 title: 'Storage Permission',
    //                 message: 'App needs access to memory to download the file.'
    //             }
    //         );
    //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //             console.log('Storage permission granted.');
    //         } else {
    //             console.log('Storage permission denied.');
    //         }
    //     } catch (error) {
    //         console.error('Error requesting storage permission:', error);
    //     }
    // };
    // const pickImageAsync = async () => {
    //     await requestStoragePermission();
    //     let result = await ImagePicker.launchImageLibraryAsync({
    //         allowsEditing: true,
    //         quality: 1,
    //     });

    //     if (!result.cancelled && result.assets.length > 0) {
    //         try {
    //             const uri = result.assets[0].uri;
    //             const fileName = uri.substring(uri.lastIndexOf('/') + 1);
    //             // const assetDirectory = `${FileSystem.documentDirectory}assets/gameImages/`; // Save in app's sandboxed storage
    //             const assetDirectory = '../images/';
    //             const destUri = `${assetDirectory}${fileName}`;
    //             // Copy the selected image to the app's sandboxed storage
    //             await FileSystem.copyAsync({
    //                 from: uri,
    //                 to: destUri
    //             });
    //             // Log the destination URI where the image is saved
    //             console.log('Image saved to:', destUri);
    //             setImageUrl(destUri)
    //         } catch (error) {
    //             console.log('Error saving image:', error);
    //             // Handle the error
    //         }
    //     } else {
    //         alert('You did not select any image.');
    //     }
    // };
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
                        <Text style={styles.menuItem}><FontAwesome5 name="user" size={24} color="white" />
                            {userName}</Text>
                        <TouchableOpacity onPress={handleSignOut}>
                            <Text style={styles.menuItem}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Main content of the page */}
                {/* Add your main content here */}
            </View>
            <View style={styles.containerMain}>

                {step === 2 && (
                    <View style={styles.form} >
                        <Text style={[styles.stepsHeading, { marginTop: 30, marginBottom: 10 }]}>Video Game Name</Text>
                        <TextInput
                            style={styles.input}

                            placeholder="Video Game Name"
                            value={gameName}
                            onChangeText={(text) => setGameName(text)}
                        />
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <Icon name="arrow-left" style={styles.arrowIcon} size={20} color="white" />
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.roundButton} onPress={handleNext}>
                            <Text style={styles.buttonText}>Next</Text>
                            <Icon name="arrow-right" style={styles.arrowIcon} size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
                {step === 3 && (
                    <View style={styles.form} >
                        <Text style={[styles.stepsHeading, { marginTop: 30, marginBottom: 10 }]}>Enter Year Game Released</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TextInput
                                style={{
                                    flex: 8,
                                    height: 40,
                                    borderColor: 'gray',
                                    borderWidth: 1,
                                    marginBottom: 10,
                                    padding: 10,
                                    color: 'gray',
                                }}
                                placeholder="Year Released"
                                value={year}
                                onChangeText={(text) => setYear(text)}
                            />
                        </View>
                        {/* Next Button */}
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <Icon name="arrow-left" style={styles.arrowIcon} size={20} color="white" />
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.roundButton} onPress={handleNext}>
                            <Text style={styles.buttonText}>Next</Text>
                            <Icon name="arrow-right" style={styles.arrowIcon} size={20} color="white" />
                        </TouchableOpacity>

                    </View>
                )}
                {step === 4 && (
                    <View style={styles.form}>
                        <Text style={[styles.stepsHeading, { marginTop: 30, marginBottom: 10 }]}>Add Image</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="image Url"
                            value={imageUrl}
                            onChangeText={(text) => setImageUrl(text)}
                        />
                        <Text style={{ marginTop: 20, color: 'grey', alignContent: 'center', alignSelf: 'center' }}>
                            Add image for the display.</Text>
                        {/* <TouchableOpacity style={styles.uploadButton} onPress={pickImageAsync}>
                            <Text style={styles.buttonText}>Upload</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <Icon name="arrow-left" style={styles.arrowIcon} size={20} color="white" />
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.roundButton} onPress={handleNext}>
                            <Text style={styles.buttonText}>Next</Text>
                            <Icon name="arrow-right" style={styles.arrowIcon} size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
                {step === 5 && (
                    <View style={styles.form}>
                        <Text style={[styles.stepsHeading, { marginTop: 30, marginBottom: 10 }]}> Terms & Privacy Notice</Text>

                        {/* Add more fields for Step 2 */}
                        <CheckBox
                            title={
                                <Text style={{ marginTop: 20, color: 'grey', alignContent: 'center', alignSelf: 'center' }}>
                                    By submitting your review, you agree to abide by our community guidelines, provide honest feedback, and ensure the safety and satisfaction of all users. Your input helps us maintain a high-quality gaming experience for everyone.
                                </Text>
                            }
                            checked={isChecked} // Replace isChecked with your state variable for the checkbox
                            onPress={() => setIsChecked(!isChecked)} // Replace setChecked with your state update function
                            containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, marginTop: 20 }}
                        />
                        {/* <Text style={{ marginTop: 20, color: 'grey', alignContent: 'center', alignSelf: 'center' }}>
                    By using Travellers, you agree to fair conduct, secure payments, and adherence to our terms. Navigate with confidence, knowing your safety and satisfaction are our top priorities.</Text> */}
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <Icon name="arrow-left" style={styles.arrowIcon} size={20} color="white" />
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.roundButton} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column', // Ensure content is arranged in a column
    },
    containerTop: {
        flexDirection: 'row', // Arrange items horizontally
        justifyContent: 'space-between', // Space items evenly along the main axis
        alignItems: 'center', // Center items vertically
        backgroundColor: 'transparent',
        zIndex: 1,
        height: 40, // Adjust the height as needed
    },
    containerMain: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
    menuButton: {
        marginRight: 10, // Add some space between the icons
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
        marginRight: 10,
        marginBottom: 10,
    },
    form: {
        paddingTop: 50,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        height: '100%',
        width: '100%',
        marginTop: 20,
        marginBottom: 10,

        marginBottom: '5%',
        color: 'gray',

        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        color: 'gray'
    },
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
    backButton: {
        width: 100,
        height: 50,
        backgroundColor: 'black', // You can change the color
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        left: 20,
        flexDirection: 'row'
    },
    uploadButton: {
        width: '100%', // Set width to full width of the parent container
        height: 50,
        backgroundColor: 'black', // You can change the color
        borderRadius: 10,
        marginTop: 10,
        paddingHorizontal: 20, // Add horizontal padding
        alignItems: 'center', // Center the content horizontally
        justifyContent: 'center', // Center the content vertically
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
    datetimePickerButton: {
        flexDirection: 'row',
        //alignItems: 'center',
        justifyContent: 'space-between',
        //backgroundColor: 'blue', // You can change the color
        padding: 2,
        borderRadius: 5,
        marginTop: 2,
        marginBottom: 2,
        alignItems: 'center',
    },
    selectedDateText: {
        marginVertical: 10,
    },


    startingScreen: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#077eed',
        marginTop: 100
    },
    appName: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'white',
        padding: 50
    },
    logo: {
        width: 100,
        height: 100,
        padding: 50,

    },
    tagline: {
        fontSize: 40,
        padding: 50,
        color: '#e3eafa',


    },
    getStartedButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'black',
        padding: 15,
        paddingRight: 100,
        paddingLeft: 100,

        borderRadius: 10,
        marginBottom: 10
    },
    buttonTextLarge: {
        color: 'white',
        fontSize: 18,
        marginRight: 10,
    },
    arrowIcon: {
        width: 20,
        height: 20,
        color: 'white',
    },
    stepsHeading: {
        fontSize: 30,
        color: 'black',
        fontWeight: 'bold'
    },
    dropdown: {
        minWidth: 100, // Adjust the minimum width as needed
        marginBottom: 10,
    },
    countryLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});



export default AddGame;
