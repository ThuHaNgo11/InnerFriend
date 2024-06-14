
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { AntDesign, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import colors from '../../../constants/colors';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech'

const IndividualJournal = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [isSpeaking, setIsSpeaking] = useState(false);

    const textToSpeech = async () => {
        const speaking = await Speech.isSpeakingAsync();
        console.log("start speaking")
        if (!speaking) {
            setIsSpeaking(true);
            Speech.speak(params.content, {
                onDone: () => {
                    setIsSpeaking(false);
                    console.log("done")
                },
                onError: () => setIsSpeaking(false),
            });
        }
    }

    const stopSpeech = async () => {
        console.log("stop speaking")
        const speaking = await Speech.isSpeakingAsync();
        if (speaking) {
            Speech.stop();
            setIsSpeaking(false);
        }
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView>
                <View style={styles.headerContainer}>
                    <AntDesign onPress={() => { 
                        router.back(); 
                        stopSpeech;
                        }} name="arrowleft" size={24} color="black" />
                    <Text style={styles.journalDate}>{params.createdAt}</Text>
                </View>
                <View style={styles.bodyContainer}>
                    {/* title */}
                    <View style={styles.journalHeaderContainer}>
                        <Text style={styles.journalTitle}>{params.title}</Text>
                        {isSpeaking ? <TouchableOpacity onPress={stopSpeech}>
                            <Octicons name="mute" size={20} color="black" />
                        </TouchableOpacity> : <TouchableOpacity
                            onPress={textToSpeech}
                        >
                            <Octicons name="unmute" size={20} color="black" />
                        </TouchableOpacity>}

                    </View>
                    {/* content */}
                    <Text style={styles.journalContent}>
                        {params.content}</Text>
                    <Image
                        source={params.imageUrl}
                        style={styles.journalImage}
                    />
                </View>
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
    journalHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bodyContainer: {
        marginBottom: 10,
        gap: 10,
        padding: 15
    },
    journalTitle: {
        fontSize: 20,
        color: colors.accent
    },
    journalDate: {
        fontStyle: 'italic',
        color: 'gray',
    },
    journalContent: {
        fontSize: 15
    },
    journalImage: {
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: 220,
        borderRadius: 7
    }
})
