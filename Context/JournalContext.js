import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const JournalContext = createContext();

const JournalData = ({ children }) => {
    const [journals, setJournals] = useState([]);

    // fetch journal data
    useEffect(() => {
        const fetchJournalData = async () => {
            try {
                const id = await AsyncStorage.getItem('id');
                const res = await axios.get(`http://localhost:3000/user/${id}/journals`)

                // array of journal objects
                setJournals(res.data.journals);
            } catch (error) {
                console.log(error)
            }
        }

        fetchJournalData();
    }, [journals]) 

    return (
        <JournalContext.Provider
            value={{
                journals,
                setJournals
            }}
        >
            {children}
        </JournalContext.Provider>
    )
}

export { JournalContext, JournalData }