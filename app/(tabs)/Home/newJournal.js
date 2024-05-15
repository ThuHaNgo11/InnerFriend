import { StyleSheet, Text, View, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import CustomedButton from '../../components/CustomedButton';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const newJournal = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigation = useNavigation();

    const saveEntry = async () => {
        try {
            const journalData = {
                title,
                content,
                date
            }
            const id = await AsyncStorage.getItem('id');
            await axios.post(`http://localhost:3000/user/${id}/journals`, journalData)

            Alert.alert('Success', 'Journal saved', [{ text: 'OK', onPress: () => navigation.navigate('JournalList') }])

        } catch (error) {
            console.log("Error", error)
        }
    }
    const date = new Date().toLocaleDateString('en-us', { weekday: "long", month: "long", day: "numeric" });

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color="black"
                    onPress={() => navigation.goBack()}
                />
                <Text style={styles.journalDate}>{date}</Text>
            </View>
            <TextInput
                style={styles.titleInput}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.contentInput}
                placeholder="Content"
                value={content}
                onChangeText={setContent}
                autoCorrect={false}
                multiline
            />
            <CustomedButton
                title="Save"
                handler={saveEntry} />
        </View>
    )
}

export default newJournal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        gap: 20
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    journalDate: {
        fontStyle: 'italic',
        color: 'gray'
    },
    titleInput: {
        fontSize: 20,
        height: 40,
        marginBottom: 10,
        borderColor: 'transparent'
    },
    contentInput: {
        fontSize: 12,
        height: '40%',
        marginBottom: 10,
        borderColor: 'transparent'
    }
})

// test data:
// Test journal title 1
// Lorem ipsum dolor sit amet. Ea repellat veritatis et harum quos ab dolorem beatae. Qui asperiores nisi est ratione alias ut laboriosam galisum et dolores cupiditate est eligendi similique qui incidunt laudantium aut nemo necessitatibus!