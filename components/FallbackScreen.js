import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import CustomedButton from './CustomedButton'
import { useRouter } from 'expo-router'

const FallbackScreen = () => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/fallbackscreen.png')}
                style={styles.image}
            />
            <Text style={styles.text}>Start writing your first journal</Text>
            <CustomedButton title={"New Journal"} handler={() => router.replace('/(tabs)/Home/newJournal')} style={{ width: 140 }} />
        </View>
    )
}

export default FallbackScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        gap: 20,
        marginTop: 20
    },
    text: {
        fontSize: 16,
        color: 'gray'
    },
    image: {
        width: 400,
        height: 280
    }
})