import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import colors from '../../../constants/colors';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "expo-router";
import { useRouter } from "expo-router";
import FallbackScreen from "../../components/FallbackScreen";

const index = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [journals, setJournals] = useState([]);

  // fetch user data
  useEffect(() => {
    const fetchJournalData = async () => {
      try {
        const id = await AsyncStorage.getItem('id');
        const res = await axios.get(`http://localhost:3000/user/${id}/journals`)

        // array of journal objects
        setJournals(res.data.journals);
      } catch (error) {
        console.log(error)
      }
    }

    fetchJournalData();
  }, []) // bug: don't load after adding new journal

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
                createdAt: item.createdAt
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
    <View style={styles.mainContainer}>
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
    </View>
  );
};

export default index;

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
