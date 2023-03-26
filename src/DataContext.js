import { createContext, useState, useContext, useEffect } from 'react';

export const DataContext = createContext({});

export const DataProvider = ({ children }) => {
    const [events, setEvents] = useState(null);
    const [organisation, setOrganisation] = useState(null);

    const getApiData = async () => {
        fetch(
            "/api/events?populate=cover,room,speakers,speakers.picture"
        ).then((response) => response.json()).then((events) => {
            setEvents(events);
            console.debug("Retrieved " + events.data.length + " events", events);
        });

        fetch(
            "/api/organisation-detail"
        ).then((response) => response.json()).then((details) => {
            setOrganisation(details.data.attributes);
            console.debug("Retrieved organisational details", details.data.attributes);
        });
    };

    useEffect(() => {
        getApiData();
    }, []);

    return (
        <DataContext.Provider value={{events, organisation}}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const store = useContext(DataContext);
    return store;
}

