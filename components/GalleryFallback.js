import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import CustomedButton from './CustomedButton'
import { useRouter } from 'expo-router'

const GalleryFallback = () => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/upload-img-prompt.avif')}
                style={styles.image}
            />
            <Text style={styles.text}>No Image to show</Text>
            <CustomedButton title={"New Journal"} handler={() => router.replace('/(tabs)/Home/newJournal')} style={{ width: 140 }} />
        </View>
    )
}

export default GalleryFallback

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