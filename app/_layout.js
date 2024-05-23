// a template for the layout of navigator and also 
// responsible for rendering elements like the header.

import { useState, useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import { JournalData } from "../Context";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
    return (
        <JournalData>
            <SafeAreaProvider>
                <Stack>
                    <Stack.Screen name="(authenticate)" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
            </SafeAreaProvider>
            <Redirect href="/(authenticate)/login" />
        </JournalData>
    )
}