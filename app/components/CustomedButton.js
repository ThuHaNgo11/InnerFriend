import { StyleSheet, Text, TouchableOpacity  } from 'react-native'
import React from 'react'
import colors from '../../constants/colors';

const CustomedButton = ({ title, handler }) => {
    return (
        <TouchableOpacity
            style={styles.button}
            onPress={() => handler()}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
}

export default CustomedButton

const styles = StyleSheet.create({
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
})