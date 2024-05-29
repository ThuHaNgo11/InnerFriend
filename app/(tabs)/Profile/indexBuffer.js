import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import { Image } from 'expo-image'
import { UserContext } from "../../../Context/UserContext";
import CustomedButton from '../../../components/CustomedButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Feather, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { firebase } from "../../../firebase";
import Spinner from 'react-native-loading-spinner-overlay';
import colors from '../../../constants/colors';
import axios from 'axios';

const index = () => {
  const { user, setLoadedUser } = useContext(UserContext)
  const router = useRouter();
  const [imageUri, setImageUri] = useState(null)
  const [imageUrl, setImageUrl] = useState(user.profilePhotoUrl)
  const [loading, setLoading] = useState(false);

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

  const pickUpdateImage = async () => {
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
      setImageUrl(null);
    }
  };

  const uploadFile = async () => {
    try {
      const { uri } = await FileSystem.getInfoAsync(imageUri);

      if (!uri) {
        throw new Error("Invalid file Uri");
      }

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        }
        xhr.onerror = (e) => {
          reject(new TypeError("Network request failed"));
        }
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null)
      })

      const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
      const ref = firebase.storage().ref().child(filename);
      await ref.put(blob);
      const downloadUrl = await ref.getDownloadURL();
      return downloadUrl;
    } catch (error) {
      console.log("Error: ", error)
    }
  }

  const saveProfileImg = async () => {
    setLoading(true)
    const uploadedUrl = await uploadFile();
    try {
      const id = await AsyncStorage.getItem('id');
      await axios.put(`http://localhost:3000/user/${id}/`, { profilePhotoUrl: uploadedUrl })
      setLoading(false);
      setLoadedUser(false);
      // use toast is better
      Alert.alert('Success', 'Save profile photo')
    } catch (error) {
      console.log("Error", error)
    }
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
          imageUrl ? (
            <>
              <Image
                source={{
                  uri: user.profilePhotoUrl
                }}
                style={styles.image}
              />
              <View style={styles.imageButtonContainer}>
                <TouchableOpacity
                  onPress={pickImage}
                  style={styles.imageButton}
                >
                  <Feather
                    name="camera"
                    size={24}
                    color="gray"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            imageUri ? (
              <>
                <Image
                  source={{
                    uri: imageUri
                  }}
                  style={styles.image}
                />
                <View style={styles.imageButtonContainer}>
                  <TouchableOpacity
                    onPress={pickUpdateImage}
                    style={styles.imageButton}
                  >
                    <Feather
                      name="camera"
                      size={24}
                      color="gray"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={saveProfileImg}
                    style={styles.imageButton}
                  >
                    <AntDesign name="check" size={24} color="gray" />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Image
                  source={require('../../../assets/profilePhotoPlaceHolder.jpeg')}
                  style={styles.image}
                />
                <View style={styles.imageButtonContainer}>
                  <TouchableOpacity
                    onPress={pickImage}
                    style={styles.imageButton}
                  >
                    <Feather
                      name="camera"
                      size={24}
                      color="gray"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
              </>
            )
          )
        }
      </View>
      <Text style={styles.heading}>{user.name}</Text>
      <Text style={styles.body}>{user.email}</Text>
      <Text style={styles.body}>Number of journal: {user.journals.length}</Text>
      <Text style={[styles.body, { marginBottom: 10 }]}>Created at: {user.createdAt}</Text>
      <CustomedButton title="Log out" handler={() => handleLogout()} />
      <Spinner
        visible={loading}
        textContent={'Saving...'}
        textStyle={styles.spinnerTextStyle}
      />
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
    height: 400,
    width: 360,
    borderRadius: 15,
    marginTop: 50
  },
  imageButton: {
    backgroundColor: colors.primary,
    opacity: 0.8,
    height: 40,
    width: 40,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageButtonContainer: {
    position: 'absolute',
    right: 8,
    bottom: 5,
    flexDirection: 'row',
    gap: 5
  },
  heading: {
    fontSize: 30,
    fontWeight: 'semibold'
  },
  body: {
    fontSize: 16,
    color: 'gray'
  }
})