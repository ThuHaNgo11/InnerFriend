import { Stack } from "expo-router";
import { ModalPortal } from "react-native-modals";

export default function Layout() {
    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name='newJournal'/>
            </Stack>
            {/* register the modal portal to use the component modal */}
            <ModalPortal/>
        </>
    )
}