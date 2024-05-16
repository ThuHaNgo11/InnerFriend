import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import colors from '../../../constants/colors';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "expo-router";

const index = () => {
  const navigation = useNavigation();
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
  }, [])

  const renderJournal = ({ item }) => (
    <View key={item.keyExtractor} style={styles.journalContainer}>
      <View style={styles.journalHeaderContainer}>
        <Text style={styles.journalTitle}>{item.title}</Text>
        <Text style={styles.journalDate}>{item.createdAt}</Text>
      </View>
      <Text>{item.content}</Text>
    </View>
  )

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text>Journals</Text>
      </View>
      <FlatList
        data={journals}
        renderItem={renderJournal}
        keyExtractor={item => item._id}
        contentContainerStyle={{ paddingBottom: 50}}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    gap: 20
  },
  journalContainer: {
    margin: 10,
    gap: 10
  },
  journalHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  journalTitle: {
    fontSize: 20,
  },
  journalDate: {
    fontStyle: 'italic',
    color: 'gray'
  }
});
