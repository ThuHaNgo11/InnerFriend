import { Tabs } from "expo-router";
import { AntDesign } from '@expo/vector-icons';
import { Ionicons, Entypo } from '@expo/vector-icons';
import colors from "../../constants/colors"

export default function Layout() {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    position: 'absolute',
                    bottom: -30
                }
            }}
        >
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
                name="Calendar"
                options={{
                    tabBarLabel: "Calendar",
                    tabBarLabelStyle: { color: colors.secondary },
                    headerShown: false,
                    tabBarIcon: ({ focused }) => {
                        return focused ? (
                            <AntDesign name="calendar" size={24} color={colors.accent} />
                        ) : (
                            <AntDesign name="calendar" size={24} color={colors.secondary} />
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
    )
}