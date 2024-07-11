import { StyleSheet, Text, View, TextInput, Alert, Image, TouchableOpacity, Pressable } from 'react-native'
import React, { useState, useContext, useEffect, useMemo } from 'react'
import CustomedButton from '../../../components/CustomedButton';
import { Ionicons, FontAwesome5, Feather, FontAwesome6, Entypo } from '@expo/vector-icons';
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
import OpenAI from "openai";
import { REACT_APP_OPENAI_API_KEY } from 'react-native-dotenv';
import colors from '../../../constants/colors';
import {
    BottomModal,
    ModalContent,
    ModalTitle,
    SlideAnimation,
} from "react-native-modals";


const newJournal = () => {
    const date = new Date().toLocaleDateString('en-us', { weekday: "short", month: "short", day: "numeric" });
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUri, setImageUri] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingOpenaiImage, setLoadingOpenaiImage] = useState(false);
    const router = useRouter();
    const { setLoadedData } = useContext(JournalContext)
    const { setLoadedUser } = useContext(UserContext)
    const [speakingContentStarted, setSpeakingContentStarted] = useState(false);
    const [buttonHover, setButtonHover] = useState(false);
    const [openaiImageUrl, setOpenaiImageUrl] = useState(null);
    const [openaiImageStyle, setOpenaiImageStyle] = useState("");
    const [openaiImagePrompt, setOpenaiImagePrompt] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const suggestions = ["Animation", "Real life", "Painting", "Sci-fi"];

    // Call the API to generate n images from a prompt
    const generateImage = async () => {
        setIsModalVisible(false);
        setLoadingOpenaiImage(true);
        const openai = new OpenAI({ apiKey: REACT_APP_OPENAI_API_KEY });
        console.log(openaiImageStyle)

        try {
            const res = await openai.images.generate({
                prompt: `${openaiImagePrompt} with ${openaiImageStyle} style.`,
                n: 1,
                size: "256x256",
            });
            setOpenaiImageUrl(res.data[0].url);
            setOpenaiImageStyle("");
            setOpenaiImagePrompt("");
        } catch (error) {
            // possible bug: user press the generatign button before insert content
            setLoadingOpenaiImage(false);
            console.error(`Error generating image: ${error}`);
        }
    };

    setupEventListener = () => {
        Voice.onSpeechError = (e) => {
            console.log(e)
        };

        Voice.onSpeechResults = (res) => {
            if (content == "") {
                setContent(res.value[0]);
            } else {
                let newContent = `${content.trimEnd()} ${res.value[0]}`;
                setContent(newContent);
            }
        };
    }

    closeEventListener = () => {
        Voice.destroy().then(Voice.removeAllListeners);
    }

    useEffect(() => {
        // clean up
        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        }
    }, [])

    // start speaking content
    const startSpeakContent = async () => {
        try {
            setupEventListener();
            await Voice.start("en-US");
            setSpeakingContentStarted(true);
        } catch (error) {
            console.log("Voice start error: ", error)
        }
    }

    const stopSpeakContent = async () => {
        try {
            await Voice.stop();
            closeEventListener();
            setSpeakingContentStarted(false);
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
        let uploadedUrl = null;
        if (imageUri) {
            uploadedUrl = await uploadFile();
        }
        if (openaiImageUrl) {
            uploadedUrl = openaiImageUrl;
        }
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
                    setOpenaiImageUrl(null);

                    // stop the voice event listener
                    stopSpeakContent();
                }
            }])
        } catch (error) {
            console.log("Error", error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.rowContainer}>
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color="black"
                    onPress={() => router.back()}
                />
                <Text style={styles.journalDate}>{date}</Text>
            </View>
            <TextInput
                style={styles.titleInput}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                multiline
            />

            <View style={styles.rowContainer}>
                <TextInput
                    style={styles.contentInput}
                    placeholder="Content"
                    value={content}
                    onChangeText={setContent}
                    autoCorrect={false}
                    multiline
                />
                {speakingContentStarted ? (
                    <View>
                        <LottieView
                            source={require('../../../assets/sound-waves.json')}
                            autoPlay
                            loop
                            style={{ width: 24, height: 20 }}
                        />
                        <TouchableOpacity
                            onPress={stopSpeakContent}
                        >
                            <Feather name="mic-off" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={startSpeakContent}
                    >
                        <Feather name="mic" size={24} color="black" />
                    </TouchableOpacity>
                )}
            </View>

            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

            {loadingOpenaiImage && <LottieView
                source={require("../../../assets/loading-openai-image.json")}
                style={styles.image}
                autoPlay
                loop
            />}

            <Image
                source={{ uri: openaiImageUrl }}
                style={(openaiImageUrl && !loadingOpenaiImage) ? styles.image : {width: 1, height: 1}}
                onLoad={() => {
                    console.log("loaded")
                    setLoadingOpenaiImage(false);
                }}
            />

            <View style={styles.buttonContainer}>
                {imageUri || (openaiImageUrl && !loadingOpenaiImage)? (
                    imageUri ? (
                        <TouchableOpacity onPress={() => setImageUri(null)}>
                            <Feather name="trash-2" size={24} color="black" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => {
                            setOpenaiImageUrl(null)
                        }}>
                            <Feather name="trash-2" size={24} color="black" />
                        </TouchableOpacity>
                    )
                ) : (
                    <View style={[styles.buttonContainer, { gap: 10 }]}>
                        <TouchableOpacity onPress={pickImage}>
                            <FontAwesome5 name="image" size={28} color="black" />
                        </TouchableOpacity>
                        <Pressable
                            onPress={() => { setIsModalVisible(!isModalVisible) }}
                            // use onHoverIn/Out on real device, the following is work-around for simulator
                            onLongPress={() => setButtonHover(true)}
                            onPressOut={() => setButtonHover(false)}
                        >
                            <FontAwesome6 name="wand-magic-sparkles" size={24} color="black" />
                        </Pressable>
                    </View>
                )}
                <CustomedButton title="Save" handler={saveEntry} />
            </View>
            {buttonHover ? (<Text style={{ color: 'gray' }}>Insert an AI-suggested image</Text>) : (null)}
            <Spinner
                visible={loading}
                textContent={'Saving...'}
                textStyle={styles.spinnerTextStyle}
            />
            <BottomModal
                onBackdropPress={() => {
                    setIsModalVisible(!isModalVisible);
                }}
                onHardwareBackPress={() => {
                    setIsModalVisible(!isModalVisible);
                }}
                swipeDirection={["up", "down"]}
                swipeThreshold={200}
                modalTitle={<ModalTitle title="Image generation" />}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom",
                    })
                }
                visible={isModalVisible}
                onTouchOutside={() => setIsModalVisible(!isModalVisible)}
            >
                <ModalContent style={styles.modalContent}>
                    <View style={styles.modalContentContainer}>
                        <TextInput
                            value={openaiImagePrompt}
                            onChangeText={(text) => setOpenaiImagePrompt(text)}
                            placeholder="Prompt to generate image"
                            style={styles.textInput}
                        />
                        <Pressable
                            onPress={generateImage}
                        >
                            <Entypo name="check" size={24} color="black" />
                        </Pressable>
                    </View>

                    <Text style={{ marginTop: 15 }}>Style Suggestions</Text>
                    <View style={styles.suggestionButtonContainer}>
                        {suggestions?.map((item, index) => {
                            return <TouchableOpacity
                                style={
                                    item == openaiImageStyle? styles.selectedStyleButton : styles.suggestionButton}
                                key={index}
                                onPress={
                                    () => {
                                        setOpenaiImageStyle(item);
                                    }
                                }
                            >
                                <Text>{item}</Text>
                            </TouchableOpacity>
                        })}
                    </View>
                </ModalContent>
            </BottomModal>
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
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    journalDate: {
        fontStyle: 'italic',
        color: 'gray'
    },
    titleInput: {
        fontSize: 20,
        maxHeight: 60,
        borderColor: 'transparent'
    },
    contentInput: {
        fontSize: 12,
        maxHeight: 200,
        marginBottom: 10,
        borderColor: 'transparent',
        maxWidth: '90%'
    },
    image: {
        width: '100%',
        height: 300,
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
    modal: {
        gap: 20,
        width: '60%',
        marginLeft: 80,
        borderRadius: 10,
        paddingVertical: 20,
        backgroundColor: colors.secondary
    },
    radioButtonTitle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        width: "100%",
        height: 290
    },
    textInput: {
        padding: 10,
        borderColor: "#E0E0E0",
        borderWidth: 1,
        borderRadius: 5,
        flex: 1
    },
    modalContentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        gap: 10
    },
    modalButton: {
        borderColor: "#E0E0E0",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 1,
        borderRadius: 25
    },
    modalButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginVertical: 10
    },
    suggestionButton: {
        backgroundColor: "#F0F8FF",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 25,
    },
    suggestionButtonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        alignItems: 'center',
        marginVertical: 10
    },
    selectedStyleButton: {
        backgroundColor: colors.secondary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 25,
    }
})

// test data:
// Test journal title 1
// Lorem ipsum dolor sit amet. Ea repellat veritatis et harum quos ab dolorem beatae. Qui asperiores nisi est ratione alias ut laboriosam galisum et dolores cupiditate est eligendi similique qui incidunt laudantium aut nemo necessitatibus!