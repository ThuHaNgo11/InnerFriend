import { StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import React, { useContext } from "react";
import colors from '../../../constants/colors';
import { useRouter } from "expo-router";
import FallbackScreen from "../../../components/FallbackScreen";
import { JournalContext } from "../../../Context/JournalContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from '@expo/vector-icons';
import axios from "axios";
import { UserContext } from "../../../Context/UserContext";

const index = () => {
  const router = useRouter();
  const { journals } = useContext(JournalContext);
  const { user } = useContext(UserContext)

  const handleDeleteJournal = async (id) => {
    const userId = user?._id
    try {
      await axios.delete(`http://localhost:3000/user/${userId}/journals/${id}`)
    } catch (error) {
      console.log('Error:', error);
    }
  }

  const renderJournal = ({ item }) => (
    <View key={item.keyExtractor} style={styles.journalContainer}>
      <View style={styles.journalHeaderContainer}>
        <View style={styles.journalTitleContainer}>
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
          <TouchableOpacity onPress={() => handleDeleteJournal(item._id)}>
            <Feather name="trash-2" size={18} color="black" />
          </TouchableOpacity>
        </View>
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
          <FlatList
            data={journals}
            renderItem={renderJournal}
            keyExtractor={item => item._id}
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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  journalTitleContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '70%',
  },
  journalTitle: {
    fontSize: 20,
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
    width: 110,
    height: 100,
    borderRadius: 7
  }
});
