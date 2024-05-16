import { StyleSheet, Text, View, TextInput, Alert, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import CustomedButton from '../../components/CustomedButton';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const newJournal = () => {
    const date = new Date().toLocaleDateString('en-us', { weekday: "long", month: "long", day: "numeric" });
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUri, setImageUri] = useState(null);

    const navigation = useNavigation();

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3], //only on Android
            quality: 1,
        });
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const deleteImage = async () => {
        setImageUri(null)
        // delete uploaded image on cloudinary
    }

    const saveEntry = async () => {
        try {
            const journalData = {
                title,
                content,
                date,
                imageUri
            }
            const id = await AsyncStorage.getItem('id');
            await axios.post(`http://localhost:3000/user/${id}/journals`, journalData)

            Alert.alert('Success', 'Journal saved', [{ text: 'OK', onPress: () => navigation.navigate('JournalList') }])

        } catch (error) {
            console.log("Error", error)
        }
    }

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
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            <View style={styles.buttonContainer}>
                {imageUri ? (
                    <TouchableOpacity onPress={deleteImage}>
                        <Feather name="trash-2" size={24} color="black" />
                    </TouchableOpacity>
                ) : (<TouchableOpacity onPress={pickImage}>
                    <FontAwesome5 name="image" size={24} color="black" />
                </TouchableOpacity>)}
                <CustomedButton title="Save" handler={saveEntry} />
            </View>
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
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})

// test data:
// Test journal title 1
// Lorem ipsum dolor sit amet. Ea repellat veritatis et harum quos ab dolorem beatae. Qui asperiores nisi est ratione alias ut laboriosam galisum et dolores cupiditate est eligendi similique qui incidunt laudantium aut nemo necessitatibus!