import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import { useState, useEffect, useContext } from 'react';
import Moment from 'moment';
import Chip from '@mui/material/Chip';
import * as muicolors from '@mui/material/colors';
import MicIcon from '@mui/icons-material/Mic';
import KeyIcon from '@mui/icons-material/Key';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import Skeleton from '@mui/material/Skeleton';
import { useParams } from "react-router-dom";
import { useData, useEvents, DataContext } from './DataContext';

function EventPage({ event }) {
    return <section>
        <h1>{event.attributes.name}</h1>
        {event.attributes.type}

        <p>{event.attributes.abstract}</p>
    </section>
}

function Placeholder() {
    return <Stack spacing={1}>
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rectangular" width={210} height={60} />
        <Skeleton variant="rounded" width={210} height={60} />
    </Stack>;
}

export default function Event() {
    let { eventId } = useParams();
    const data = useData();

    return (
        <div>
            {data.events && false && (() => {
                const event = data.events.data.find((e, i) => e.id == eventId);

                if (event !== undefined) {
                    return <EventPage event={event} />;
                } else {
                    return <span>Event not found</span>;
                }
            })()
            }
            {!data.events && <Placeholder />}
        </div>
    );
}