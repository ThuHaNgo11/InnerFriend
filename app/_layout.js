import { Stack } from "expo-router";
import { JournalData } from "../Context";
import { Redirect } from 'expo-router'
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
    return (
        <JournalData>
            <SafeAreaProvider>
                <Stack>
                    <Stack.Screen name="(authenticate)" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
                <Redirect href="/(authenticate)/login" />
            </SafeAreaProvider>
        </JournalData>
    )
}