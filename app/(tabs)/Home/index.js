import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import colors from '../../../constants/colors';
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "../../../Context/UserContext";
import { useRouter } from "expo-router";

const index = () => {
    const { user } = useContext(UserContext)
    const router = useRouter();
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.topContainer}>
                <Image source={require("../../../assets/fallback.jpeg")} />
                <Text style={styles.text}>Hello {user?.name},</Text>
                <Text style={styles.text}>
                    What's on your mind?
                </Text>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => { router.push('/Home/newJournal') }}
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
    topContainer: {
        gap: 12,
        alignItems: "center",
        marginTop: 20
    },
    image: {
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
