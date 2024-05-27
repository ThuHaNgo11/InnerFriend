import { Tabs } from "expo-router";
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import colors from "../../constants/colors"
import { JournalData } from "../../Context/JournalContext";
import { UserData } from "../../Context/UserContext";

export default function Layout() {
    return (
        <UserData>
            <JournalData>
                <Tabs>
                    <Tabs.Screen
                        name="Home"
                        options={{
                            tabBarLabel: "Home",
                            tabBarLabelStyle: { color: colors.secondary },
                            headerShown: false,
                            tabBarIcon: ({ focused }) => {
                                return focused ? (
                                    <AntDesign name="home" size={24} color={colors.accent} />
                                ) : (
                                    <AntDesign name="home" size={24} color={colors.secondary} />
                                )
                            }
                        }}
                    />
                    <Tabs.Screen
                        name="Gallery"
                        options={{
                            tabBarLabel: "Gallery",
                            tabBarLabelStyle: { color: colors.secondary },
                            headerShown: false,
                            tabBarIcon: ({ focused }) => {
                                return focused ? (
                                    <Entypo name="folder-images" size={24} color={colors.accent} />
                                ) : (
                                    <Entypo name="folder-images" size={24} color={colors.secondary} />
                                )
                            }
                        }}
                    />
                    <Tabs.Screen
                        name="JournalList"
                        options={{
                            tabBarLabel: "Journals",
                            tabBarLabelStyle: { color: colors.secondary },
                            headerShown: false,
                            tabBarIcon: ({ focused }) => {
                                return focused ? (
                                    <Entypo name="list" size={24} color={colors.accent} />
                                ) : (
                                    <Entypo name="list" size={24} color={colors.secondary} />
                                )
                            }
                        }}
                    />
                    <Tabs.Screen
                        name="Profile"
                        options={{
                            tabBarLabel: "Profile",
                            tabBarLabelStyle: { color: colors.secondary },
                            headerShown: false,
                            tabBarIcon: ({ focused }) => {
                                return focused ? (
                                    <Ionicons name="person-outline" size={24} color={colors.accent} />
                                ) : (
                                    <Ionicons name="person-outline" size={24} color={colors.secondary} />
                                )
                            }
                        }}
                    />
                </Tabs>
            </JournalData>
        </UserData>
    )
}