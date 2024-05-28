import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { Image } from 'expo-image'
import { UserContext } from "../../../Context/UserContext";
import CustomedButton from '../../../components/CustomedButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { firebase } from "../../../firebase";
import Spinner from 'react-native-loading-spinner-overlay';

const index = () => {
  const { user } = useContext(UserContext)
  const router = useRouter();
  const [imageUri, setImageUri] = useState(null)

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3], //only on Android
      quality: 1,
    });
    if (!result.canceled) {
      //imageUri is the local path to image
      setImageUri(result.assets[0].uri);
    }
  };

  const handleProfileImg = async () => {
  }

  const handleLogout = async () => {
    // clear token in local storage
    const keys = ['authToken', 'id']
    try {
      await AsyncStorage.multiRemove(keys)
    } catch (e) {
      console.log("Error: ", e)
    }
    // redirect to login
    router.replace('/(authenticate)/login')
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View>
        {
          imageUri ? (
            <>
              <Image
                source={{
                  uri: imageUri
                }}
                style={styles.image}
              />
              <TouchableOpacity onPress={() => setImageUri(null)}>
                <Feather
                  name="trash-2"
                  size={24}
                  color="gray"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Image
                source={require('../../../assets/profilePhotoPlaceHolder.jpeg')}
                style={styles.image}
              />
              <TouchableOpacity
                onPress={pickImage}
              >
                <Feather
                  name="camera"
                  size={24}
                  color="gray"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </>
          )
        }
      </View>
      <Text>{user.name}</Text>
      <Text>{user.email}</Text>
      <Text>Number of journal: {user.journals.length}</Text>
      {/* <Text>Number of photos: </Text> */}
      <Text>Created at: {user.createdAt}</Text>
      <CustomedButton title="Log out" handler={() => handleLogout()} />
    </SafeAreaView>
  )
}

export default index

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 10
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 100,
    marginTop: 50
  },
  icon: {
    position: 'absolute',
    right: 8,
    bottom: 5
  }
})