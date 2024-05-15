import { Stack } from "expo-router";
import Toast from 'react-native-toast-message';

export default function Layout() {
    return (
        <>
            <Stack>
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="register" options={{ headerShown: false }} />
            </Stack>
            <Toast />
        </>
    )
}