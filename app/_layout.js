// a template for the layout of navigator and also 
// responsible for rendering elements like the header.

import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {useEffect} from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Layout() {
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

    return (
        <SafeAreaProvider>
            <Stack>
                <Stack.Screen name="(authenticate)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </SafeAreaProvider>
    )
}