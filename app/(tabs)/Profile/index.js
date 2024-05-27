import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, {useContext} from 'react'
import { Image } from 'expo-image'
import { UserContext } from "../../../Context/UserContext";
import CustomedButton from '../../../components/CustomedButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const index = () => {
  const { user } = useContext(UserContext)
  const router = useRouter();

  const handleLogout = async () => {
    // clear token in local storage
    // const keys = ['authToken', 'id']
    try {
      // await AsyncStorage.multiRemove(keys)
      await AsyncStorage.removeItem('authToken')
    } catch(e) {
      console.log("Error: ", e)
    }
    // redirect to login
    router.replace('/(authenticate)/login')
  }
  return (
    <SafeAreaView>
      <Image />
      <Text>{user.name}</Text>
      <Text>{user.email}</Text>
      <Text>Number of journal: {user.journals.length}</Text>
      <Text>Number of photos: </Text>
      <Text>Created at: {user.createdAt}</Text>
      <CustomedButton title="Log out" handler={() => handleLogout()}/>
    </SafeAreaView>
  )
}

export default index

const styles = StyleSheet.create({})