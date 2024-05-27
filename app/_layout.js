// a template for the layout of navigator and also 
// responsible for rendering elements like the header.

import { Stack } from "expo-router";
import { JournalData } from "../Context/JournalContext";
import { UserData } from "../Context/UserContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
    return (
        <UserData>
            <JournalData>
                <SafeAreaProvider>
                    <Stack>
                        {/* <Stack.Screen name="(authenticate)" options={{ headerShown: false }} /> */}
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    </Stack>
                </SafeAreaProvider>
            </JournalData>
        </UserData>
    )
}