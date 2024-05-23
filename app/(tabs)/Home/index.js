import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import colors from '../../../constants/colors';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
    const [userName, setUserName] = useState("");
    const navigation = useNavigation();

    // fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const id = await AsyncStorage.getItem('id');
                // console.log("Retrieved id: " + id);
                const res = await axios.get(`http://localhost:3000/user/${id}`);
                // console.log(res.data.name)
                setUserName(res.data.name);
            } catch (error) {
                console.log(error)
            }
        }

        fetchUserData();
    }, [])

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.topContainer}>
                <Image source={require("../../../assets/fallback.jpeg")} />
                <Text style={styles.text}>Hello {userName},</Text>
                <Text style={styles.text}>
                    What's on your mind?
                </Text>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => { navigation.navigate('newJournal') }}
                >
                    <Text style={styles.buttonText}>Writing</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Reflecting</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default index;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        gap: 40 // space bt text and buttons
    },
    topContainer:{
        gap: 12,
        alignItems: "center",
        marginTop: 20
    },
    image:{ 
        width: '100%'
    },
    text: {
        color: "grey",
        fontWeight: "600",
        fontSize: 20,
        fontStyle: "italic",
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12
    },
    button: {
        width: 120,
        backgroundColor: colors.accent,
        padding: 15,
        borderRadius: 10
    },
    buttonText: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    }
});
