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
import React, { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios"

const register = () => {
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleRegister = () => {
        const user = {
            name: userName,
            email: email,
            password: password
        }
        axios.post("http://localhost:3000/register", user).then((response) => {
            console.log(response);
            Alert.alert('Success', 'Register User Sucessfully');
            setUserName("");
            setEmail("");
            setPassword("");
            router.replace("/login")
        }).catch((e) => {
            Alert.alert('Error', 'Register User Unsucessfully');
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
                    <Text style={styles.subHeading}>Create your account</Text>
                </View>

                <View style={{ marginTop: 50 }}>
                    <View style={styles.inputContainer}>
                        <Ionicons style={{ marginHorizontal: 5 }} name="person" size={24} color="gray" />
                        <TextInput
                            placeholder='Enter your name'
                            style={styles.textInput}
                            value={userName}
                            onChangeText={(text) => { setUserName(text) }}
                            autoCapitalize="none"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <MaterialIcons style={{ marginHorizontal: 5 }} name="email" size={24} color="gray" />
                        <TextInput
                            placeholder='Enter your email'
                            style={styles.textInput}
                            value={email}
                            onChangeText={(text) => { setEmail(text) }}
                            autoCapitalize="none"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <FontAwesome name="lock" size={26} color="gray" style={{ marginHorizontal: 5 }} />
                        <TextInput
                            placeholder='Enter your password'
                            style={styles.textInput}
                            value={password}
                            onChangeText={(text) => { setPassword(text) }}
                            secureTextEntry={true}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={{ marginTop: 60 }} />
                    <TouchableOpacity
                        onPress={handleRegister}
                        style={styles.signupButton}
                    >
                        <Text style={styles.signupButtonText}>Sign up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { router.replace("/login") }} style={{ marginTop: 12 }}>
                        <Text style={styles.loginText}>Already had an account? Login</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default register

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center'
    },
    container: {

    },
    heading: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#0066B2'
    },
    subHeading: {
        fontSize: 16,
        fontWeight: 600,
        marginTop: 20
    },
    textInput: {
        color: 'gray',
        marginVertical: 10,
        width: 300
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
    upButton: {
        width: 200,
        backgroundColor: "#6699CC",
        padding: 15,
        borderRadius: 10,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    signupButtonText: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    },
    loginText: {
        color: "gray",
        fontSize: 12,
        textAlign: 'center'
    }
})