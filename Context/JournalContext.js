import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const JournalContext = createContext();

const JournalData = ({ children }) => {
    const [journals, setJournals] = useState([]);
    const [loadedData, setLoadedData] = useState(false);

    // fetch journal data
    useEffect(() => {
        const fetchJournalData = async () => {
            if (loadedData) return;
            try {
                const id = await AsyncStorage.getItem('id');
                const res = await axios.get(`http://localhost:3000/user/${id}/journals`)

                // array of journal objects
                setJournals(res.data.journals);
                setLoadedData(true);
            } catch (error) {
                console.log(error)
            }
        }

        fetchJournalData();
    }, [loadedData]) 

    return (
        <JournalContext.Provider
            value={{
                journals,
                setJournals,
                setLoadedData
            }}
        >
            {children}
        </JournalContext.Provider>
    )
}

export { JournalContext, JournalData }