import { createContext, useState, useContext, useEffect } from 'react';

export const DataContext = createContext({});

export const DataProvider = ({ children }) => {
    const [events, setEvents] = useState(null);

    const getApiData = async () => {
        const events = await fetch(
            "/api/events?populate=room,speakers,speakers.picture"
        ).then((response) => response.json());

        console.log("Retrieved " + events.data.length + " events", events);

        setEvents(events);
    };

    useEffect(() => {
        getApiData();
    }, []);

    return (
        <DataContext.Provider value={{events}}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const store = useContext(DataContext);
    return store;
}

