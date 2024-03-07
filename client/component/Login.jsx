import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ToastAndroid, ScrollView } from 'react-native';
import { FontAwesome, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import apiUrl from './apiUrl';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const Stack = createStackNavigator();
    const handleLogin = async () => {
        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result.user)
                navigation.navigate('MainPage', { user: result.user });
            } else {
                ToastAndroid.show(result.message, ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error('Error during login:', error);
            ToastAndroid.show('Error during login', ToastAndroid.SHORT);
        }
    };
    const handleRegisterNow = () => {
        navigation.navigate('UserProfile');
    };

    const openLink = (url) => {
        Linking.openURL(url);
    };

    return (
        <View style={styles.container}>
            {/* Image */}
            <Image source={require('../assets/traveler.png')} style={styles.logo} />

            {/* Input Fields */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
            />

            {/* Login Button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Register Now Text */}
            <TouchableOpacity onPress={handleRegisterNow}>
                <Text style={styles.registerText}>Don't have an account? Register now</Text>
            </TouchableOpacity>

            {/* Social Icons */}
            <View style={styles.iconContainer}>
                <FontAwesome name="facebook" size={20} color="#000" onPress={() => openLink('https://www.facebook.com')} />
                <FontAwesome5 name="twitter" style={{ marginRight: 50, marginLeft: 50 }} size={20} color="#000" onPress={() => openLink('https://twitter.com')} />
                <AntDesign name="google" size={20} color="#000" onPress={() => openLink('https://www.google.com')} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'lightgrey'
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 100,
    },
    input: {
        width: '80%',
        height: 40,
        backgroundColor: '#fff',
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
    },
    button: {
        width: '80%',
        height: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#000',
        color: 'white'
    },
    buttonText: {
        color: 'white',
    },
    registerText: {
        color: '#000',
        marginTop: 10,
    },

    iconContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',

    },
});

export default Login;
