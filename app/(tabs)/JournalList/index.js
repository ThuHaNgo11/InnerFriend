import { StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import React, { useContext } from "react";
import colors from '../../../constants/colors';
import { useRouter } from "expo-router";
import FallbackScreen from "../../../components/FallbackScreen";
import { JournalContext } from "../../../Context/JournalContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Entypo } from '@expo/vector-icons';
import axios from "axios";
import { UserContext } from "../../../Context/UserContext";


const index = () => {
  const router = useRouter();
  const { journals } = useContext(JournalContext);
  const { user } = useContext(UserContext)
  const {setLoadedData} = useContext(JournalContext)
  const {setLoadedUser} = useContext(UserContext)

  const handleDeleteJournal = async (id) => {
    const userId = user?._id
    try {
      await axios.delete(`http://localhost:3000/user/${userId}/journals/${id}`)
      setLoadedData(false)
      setLoadedUser(false)
    } catch (error) {
      console.log('Error:', error);
    }
  }

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
        >{item.title} <TouchableOpacity onPress={() => handleDeleteJournal(item._id)}>
            <Feather name="trash-2" size={18} color="black" />
          </TouchableOpacity></Text>
        <Text style={styles.journalDate}>{item.createdAt}</Text>
      </View>
      <View style={styles.journalBodyContainer}>
        <Text
          style={styles.journalContent}
          numberOfLines={6}
        >{item.content}</Text>
        <Image
          source={item.imageUrl ? {
            uri: item.imageUrl
          } : require('../../../assets/image-placeholder.png')}
          style={styles.journalImage}
        />
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.mainContainer}>
      {
        journals?.length ? (
          <>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Journal</Text>
              <TouchableOpacity
                onPress={() => { router.replace('/(tabs)/Home/newJournal') }}
              >
                <Entypo name="new-message" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={journals}
              renderItem={renderJournal}
              keyExtractor={item => item._id}
            />
          </>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    marginBottom: 10
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
    width: '100%',
    flexDirection: 'row',
    gap: 5
  },
  journalTitle: {
    fontSize: 20,
    color: colors.accent,
    width: '68%',
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
    width: 110,
    height: 100,
    borderRadius: 7
  }
});
