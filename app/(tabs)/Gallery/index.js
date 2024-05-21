import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const index = () => {

    return (
        <View style={styles.mainContainer}>
            <Text>Uploaded Images</Text>
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    mainContainer: {
        margin: 10,
        alignItems: 'center'
    },
})