import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

const UserData = ({ children }) => {
    const [user, setUser] = useState(null);

    // fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const id = await AsyncStorage.getItem('id');
                
                const res = await axios.get(`http://localhost:3000/user/${id}`);
                
                setUser(res.data);
            } catch (error) {
                console.log(error)
            }
        }

        fetchUserData();
    }, [user?.journals]) 
    // fetch user data when changes in user.journals

    return (
        <UserContext.Provider
            value={{
                user,
                setUser
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserData }