import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

const UserData = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loadedUser, setLoadedUser] = useState(false);

    // fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            if(loadedUser) return;
            try {
                const id = await AsyncStorage.getItem('id');
                
                const res = await axios.get(`http://localhost:3000/user/${id}`);
                
                setUser(res.data);
                setLoadedUser(true);
            } catch (error) {
                console.log(error)
            }
        }

        fetchUserData();
    }, [loadedUser]) 

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                setLoadedUser
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserData }