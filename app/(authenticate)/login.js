import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomedButton from '../../components/CustomedButton';
import colors from '../../constants/colors';
const login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    // test user: ha@gmail.com - 1234

    const handleLogin = () => {
        const user = {
            email: email,
            password: password
        }
        axios.post("http://localhost:3000/login", user).then(async (res) => {
            const token = res.data.token;
            const id = res.data.id;
            await AsyncStorage.setItem("authToken", token);
            await AsyncStorage.setItem('id', id)
            router.replace("/(tabs)/Home")
        }).catch((e) => {
            Alert.alert('Error', 'Invalid email or password');
            console.log(e)
        })
    }

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={{ marginTop: 100 }}>
                <Text style={styles.heading}>InnerFriend</Text>
            </View>
            <KeyboardAvoidingView>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.subHeading}>Log in to your account</Text>
                </View>

                <View style={{ marginTop: 30 }}>
                    <View style={styles.inputContainer}>
                        <MaterialIcons style={{ marginHorizontal: 5 }} name="email" size={24} color={colors.secondary} />
                        <TextInput
                            placeholder='Enter your email'
                            style={styles.textInput}
                            value={email}
                            onChangeText={(text) => { setEmail(text) }}
                            autoCapitalize="none"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <FontAwesome name="lock" size={26}  color={colors.secondary} style={{ marginHorizontal: 5 }} />
                        <TextInput
                            placeholder='Enter your password'
                            style={styles.textInput}
                            value={password}
                            onChangeText={(text) => { setPassword(text) }}
                            secureTextEntry={true}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.bottomContainer}>
                        <Text style={styles.secondaryText}>Keep me logged in</Text>
                        <Text
                            style={{
                                color: "#32746d",
                                fontWeight: "500"
                            }}
                        >Forgot password</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <CustomedButton title="Login" handler={handleLogin} />
                        <TouchableOpacity onPress={() => { router.replace("/register") }}>
                            <Text style={styles.secondaryText}>Don't have an account? Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default login

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        alignItems: 'center'
    },
    heading: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.accent
    },
    subHeading: {
        fontSize: 16,
        fontWeight: 600,
        marginTop: 20
    },
    textInput: {
        marginVertical: 10,
        width: 300,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: "#E0E0E0",
        padding: 5,
        borderRadius: 5,
        marginTop: 30
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginTop: 12
    },
    buttonContainer: {
        marginTop: 40,
        alignItems: 'center',
        gap: 20
    },
    secondaryText: {
        color: "gray",
        fontSize: 13,
    }
})