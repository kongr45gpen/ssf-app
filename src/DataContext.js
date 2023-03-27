import { mapValues } from 'lodash';
import { createContext, useState, useContext, useEffect } from 'react';
import { classifyAndPartition } from './utils/Partitioning';

export const DataContext = createContext({});

export const DataProvider = ({ children }) => {
    const [events, setEvents] = useState(null);
    const [organisation, setOrganisation] = useState(null);
    const [partitions, setPartitions] = useState([]);
    const [booths, setBooths] = useState([]);

    const getApiData = async () => {
        const eventPromise = fetch(
            "/api/events?populate=cover,room,speakers,speakers.picture"
        ).then((response) => response.json()).then((events) => {
            setEvents(events);
            console.debug("Retrieved " + events.data.length + " events", events);
            return events;
        });

        fetch(
            "/api/organisation-detail"
        ).then((response) => response.json()).then((details) => {
            setOrganisation(details.data.attributes);
            console.debug("Retrieved organisational details", details.data.attributes);
        });

        fetch(
            "/api/partitions"
        ).then((response) => response.json()).then(async (partitions) => {
            const events = await eventPromise;

            for (let partition of partitions.data) {
                partition.attributes = {...partition.attributes, ...(classifyAndPartition(events.data, partition))};
            }

            setPartitions(partitions.data);

            console.debug("Retrieved partitions", partitions.data);
        });

        fetch(
            "/api/booths?populate=logo"
        ).then((response) => response.json()).then(async (booths) => {
            setBooths(booths.data);
            console.debug("Retrieved booths", booths.data);
        });
    };

    useEffect(() => {
        getApiData();
    }, []);

    return (
        <DataContext.Provider value={{events, organisation, partitions, booths}}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const store = useContext(DataContext);
    return store;
}

