import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import colors from '../../../constants/colors';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

const IndividualJournal = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView>
                <View style={styles.headerContainer}>
                    <AntDesign onPress={() => { router.back() }} name="arrowleft" size={24} color="black" />
                    <Text style={styles.journalDate}>{params.createdAt}</Text>
                </View>
                <View style={styles.bodyContainer}>
                    <Text style={styles.journalTitle}>{params.title}</Text>
                    <Text
                        style={styles.journalContent}
                    >{params.content}</Text>
                    <Image
                        source={params.image}
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
    bodyContainer: {
        marginBottom: 10,
        gap: 10,
        padding: 15
    },
    journalTitle: {
        fontSize: 20,
        width: '100%',
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