import { StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import React, { useContext } from "react";
import colors from '../../../constants/colors';
import { useRouter } from "expo-router";
import FallbackScreen from "../../../components/FallbackScreen";
import { JournalContext } from "../../../Context";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
    const router = useRouter();
    const { journals } = useContext(JournalContext);

    const renderImg = ({ item }) => (
        <TouchableOpacity
            onPress={() => router.push({
                pathname: "/Gallery/individualJournal",
                params: {
                    id: item._id,
                    title: item.title,
                    content: item.content,
                    createdAt: item.createdAt,
                    image: item.imageUrl
                }
            })}
        >
            <Image
                source={{
                    uri: item.imageUrl
                }}
                key={item.keyExtractor}
                style={styles.journalImage}
            />
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={styles.mainContainer}>
            {
                journals?.length ? (
                    <View style={styles.innerContainer}>
                        <Text>Photos</Text>
                        <FlatList
                            data={journals}
                            renderItem={renderImg}
                            keyExtractor={item => item._id}
                            numColumns={3}
                        />
                    </View>
                ) : (
                    <FallbackScreen />
                )
            }
        </SafeAreaView>
    );
};

export default index;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    innerContainer: {
        alignItems: 'center',
        gap: 10 // space bt "Photos" and images
    },
    journalImage: {
        width: 110,
        height: 100,
        borderRadius: 7,
        margin: 5
    }
});
