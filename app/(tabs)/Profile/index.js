import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, {useContext} from 'react'
import { Image } from 'expo-image'
import { UserContext } from "../../../Context/UserContext";

const index = () => {
  const { user } = useContext(UserContext)
  return (
    <SafeAreaView>
      <Image />
      <Text>{user?.name}</Text>
      <Text>{user?.email}</Text>
    </SafeAreaView>
  )
}

export default index

const styles = StyleSheet.create({})