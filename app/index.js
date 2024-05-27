// Expo Router uses the app folder to define the app's navigation structure. 
// app/index.js serves as the initial route in the directory 

import React, {useEffect} from 'react';
import { useRouter } from 'expo-router';
import Layout from './(tabs)/_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';

const index = () => {
    const router = useRouter();

    // check if there is authToken in local storage
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if(token){
                    router.replace("/(tabs)/Home")
                } else {
                    router.replace('/(authenticate)/login')
                }
            } catch (error) {
                console.log(error)
            }
        }

        checkLoginStatus();
    }, [])
}

export default index;