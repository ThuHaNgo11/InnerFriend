import { StyleSheet, View, Text, FlatList } from "react-native";
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

  const renderJournal = ({ item }) => (
    <View key={item.keyExtractor} style={styles.journalContainer}>
      <View style={styles.journalHeaderContainer}>
        <Text
          style={styles.journalTitle}
          onPress={() => {
            router.push({
              pathname: "/JournalList/individualJournal",
              params: {
                id: item._id,
                title: item.title,
                content: item.content,
                createdAt: item.createdAt,
                image: item.imageUrl
              }
            })
          }}
        >{item.title}</Text>
        <Text style={styles.journalDate}>{item.createdAt}</Text>
      </View>
      <View style={styles.journalBodyContainer}>
        <Text
          style={styles.journalContent}
          numberOfLines={6}
        >{item.content}</Text>
        <Image
          source={{
            uri: item.imageUrl
          }}
          style={styles.journalImage}
        />
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Journals</Text>
      </View>
      {
        journals?.length ? (
          <FlatList
            data={journals}
            renderItem={renderJournal}
            keyExtractor={item => item._id}
            contentContainerStyle={{ paddingBottom: 50 }}
          />
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
    flex: 1,
    marginRight: 10
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10
  },
  headerTitle: {
    fontSize: 20
  },
  journalContainer: {
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
    width: '65%',
    maxHeight: 120,
    fontSize: 15
  },
  journalImage: {
    width: 105,
    height: 100,
    borderRadius: 7
  }
});
