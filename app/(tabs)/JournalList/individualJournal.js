import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import colors from '../../../constants/colors';
import { Image } from 'expo-image';

const IndividualJournal = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    return (
        <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
                <AntDesign onPress={() => { router.back() }} name="arrowleft" size={24} color="black" />
            </View>
            <View style={styles.bodyContainer}>
                <View style={styles.journalHeaderContainer}>
                    <Text style={styles.journalTitle}>{params.title}</Text>
                    <Text style={styles.journalDate}>{params.createdAt}</Text>
                </View>
                <Text
                    style={styles.journalContent}
                    numberOfLines={6}
                >{params.content}</Text>
                <Image
                    source={params.image}
                    style={styles.journalImage}
                />
            </View>
        </View>
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
        paddingHorizontal: 10,
        marginTop: 10
    },
    bodyContainer: {
        marginBottom: 10,
        gap: 10,
        padding: 15
    },
    journalHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    journalTitle: {
        fontSize: 20,
        width: '70%',
        color: colors.accent
    },
    journalDate: {
        fontStyle: 'italic',
        color: 'gray',
    },
    journalBodyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    journalContent: {
        fontSize: 15
    },
    journalImage: {
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: 180,
        borderRadius: 7
    }
})