import { StyleSheet, Text, View, TextInput, Alert, Image, TouchableOpacity } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import CustomedButton from '../../../components/CustomedButton';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { firebase } from "../../../firebase";
import Spinner from 'react-native-loading-spinner-overlay';
import { SafeAreaView } from 'react-native-safe-area-context';
import { JournalContext } from '../../../Context/JournalContext';
import { UserContext } from '../../../Context/UserContext';
import Voice from '@react-native-voice/voice'
import LottieView from 'lottie-react-native';

const newJournal = () => {
    const date = new Date().toLocaleDateString('en-us', { weekday: "short", month: "short", day: "numeric" });
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUri, setImageUri] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setLoadedData } = useContext(JournalContext)
    const { setLoadedUser } = useContext(UserContext)
    const [speakingStarted, setSpeakingStarted] = useState(false);
    const [speakingContentStarted, setSpeakingContentStarted] = useState(false);

    useEffect(() => {
        Voice.onSpeechError = (e) => {
            console.log(e)
        };

        Voice.onSpeechResults = (res) => {
            // let text = res.value[0];
            setTitle(res.value[0]);
        }

        // clean up
        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        }
    }, [])

    // start speaking 
    const startSpeak = async () => {
        try {
            await Voice.start("en-US");
            setSpeakingStarted(true);
        } catch (error) {
            console.log("Voice start error: ", error)
        }
    }

    const stopSpeak = async () => {
        try {
            await Voice.stop();
            setSpeakingStarted(false);
        } catch (error) {
            console.log("Voice stop error: ", error)
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3], //only on Android
            quality: 1,
        });
        if (!result.canceled) {
            //imageUri is the local path to image
            setImageUri(result.assets[0].uri);
        }
    };

    const uploadFile = async () => {
        try {
            const { uri } = await FileSystem.getInfoAsync(imageUri);

            if (!uri) {
                throw new Error("Invalid file Uri");
            }

            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    resolve(xhr.response);
                }
                xhr.onerror = (e) => {
                    reject(new TypeError("Network request failed"));
                }
                xhr.responseType = "blob";
                xhr.open("GET", uri, true);
                xhr.send(null)
            })

            const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
            const ref = firebase.storage().ref().child(filename);
            await ref.put(blob);
            const downloadUrl = await ref.getDownloadURL();
            return downloadUrl;
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    const saveEntry = async () => {
        if (title == "") {
            Alert.alert('error', 'title is empty')
            return;
        }
        if (content == "") {
            Alert.alert('error', 'content is empty')
            return;
        }
        setLoading(true)
        const uploadedUrl = imageUri ? await uploadFile() : null;
        try {
            const journalData = {
                title,
                content,
                date,
                uploadedUrl
            }
            const id = await AsyncStorage.getItem('id');
            await axios.post(`http://localhost:3000/user/${id}/journals`, journalData)

            setLoading(false)
            setLoadedData(false)
            setLoadedUser(false)

            Alert.alert('Success', 'Journal saved', [{
                text: 'OK', onPress: () => {
                    router.navigate('/(tabs)/JournalList')
                    // reset local states
                    setTitle("");
                    setContent("");
                    setImageUri(null);
                }
            }])
        } catch (error) {
            console.log("Error", error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color="black"
                    onPress={() => router.back()}
                />
                <Text style={styles.journalDate}>{date}</Text>
            </View>
            <View style={styles.headerContainer}>
                <TextInput
                    style={styles.titleInput}
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                    multiline
                />
                {speakingStarted ? (
                    <View>
                        <LottieView 
                            source={require('../../../assets/sound-waves.json')}
                            autoPlay
                            loop
                            style={{width: 24, height: 20}}
                        />
                        <TouchableOpacity
                            onPress={stopSpeak}
                        >
                            <Feather name="mic-off" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={startSpeak}
                    >
                        <Feather name="mic" size={24} color="black" />
                    </TouchableOpacity>
                )}
            </View>

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
                    <TouchableOpacity onPress={() => setImageUri(null)}>
                        <Feather name="trash-2" size={24} color="black" />
                    </TouchableOpacity>
                ) : (<TouchableOpacity onPress={pickImage}>
                    <FontAwesome5 name="image" size={24} color="black" />
                </TouchableOpacity>)}
                <CustomedButton title="Save" handler={saveEntry} />
            </View>
            <Spinner
                visible={loading}
                textContent={'Saving...'}
                textStyle={styles.spinnerTextStyle}
            />
        </SafeAreaView>
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
        borderColor: 'transparent'
    },
    contentInput: {
        fontSize: 12,
        maxHeight: '40%',
        marginBottom: 10,
        borderColor: 'transparent'
    },
    image: {
        width: '100%',
        height: 220,
        borderRadius: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
})

// test data:
// Test journal title 1
// Lorem ipsum dolor sit amet. Ea repellat veritatis et harum quos ab dolorem beatae. Qui asperiores nisi est ratione alias ut laboriosam galisum et dolores cupiditate est eligendi similique qui incidunt laudantium aut nemo necessitatibus!