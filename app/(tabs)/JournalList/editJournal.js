
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, TextInput, Alert,TouchableOpacity, ScrollView } from 'react-native'
import { Image } from 'expo-image';
import React, { useState, useContext } from 'react'
import CustomedButton from '../../../components/CustomedButton';
import { FontAwesome5, Feather, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { firebase } from "../../../firebase";
import Spinner from 'react-native-loading-spinner-overlay';
import { JournalContext } from '../../../Context/JournalContext';
import { UserContext } from '../../../Context/UserContext';

const IndividualJournal = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [title, setTitle] = useState(params.title);
    const [content, setContent] = useState(params.content);
    const [imageUri, setImageUri] = useState(params.imageUrl || null);
    const [loading, setLoading] = useState(false);
    const { setLoadedData } = useContext(JournalContext);
    const { setLoadedUser } = useContext(UserContext);

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

    const saveUpdatedEntry = async (journalId) => {
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
                imageUrl: uploadedUrl
            }
            await axios.put(`http://localhost:3000/journals/${journalId}`, journalData)

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
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.headerContainer}>
                    <AntDesign onPress={() => { router.back() }} name="arrowleft" size={24} color="black" />
                    <Text style={styles.journalDate}>{params.createdAt}</Text>
                </View>
                <View style={styles.bodyContainer}>
                    <TextInput
                        style={styles.titleInput}
                        value={title}
                        onChangeText={setTitle}
                        autoCorrect={false}
                        multiline={true}
                    />
                    <TextInput
                        style={styles.contentInput}
                        value={content}
                        onChangeText={setContent}
                        autoCorrect={false}
                        multiline={true}
                    />

                    {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
                    <View style={styles.buttonContainer}>
                        {imageUri ? (
                            <>
                                <TouchableOpacity onPress={() => setImageUri(null)}>
                                    <Feather name="trash-2" size={24} color="black" />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity onPress={pickImage}>
                                <FontAwesome5 name="image" size={24} color="black" />
                            </TouchableOpacity>)}
                        <CustomedButton title="Save" handler={() => {saveUpdatedEntry(params.id)}} />
                    </View>
                </View>
                <Spinner
                    visible={loading}
                    textContent={'Saving...'}
                    textStyle={styles.spinnerTextStyle}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default IndividualJournal

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 10
    },
    bodyContainer: {
        marginBottom: 10,
        gap: 10,
        padding: 15,
        flex: 1
    },
    journalDate: {
        fontStyle: 'italic',
        color: 'gray',
    },
    titleInput: {
        fontSize: 20,
        marginBottom: 10,
        borderColor: 'transparent'
    },
    contentInput: {
        fontSize: 12,
        marginBottom: 10,
        borderColor: 'transparent'
    },
    image: {
        width: '100%',
        height: 220,
        borderRadius: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
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
