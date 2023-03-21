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
import TypeChip from './TypeChip';
import Skeleton from '@mui/material/Skeleton';
import PlaceIcon from '@mui/icons-material/Place';
import TodayIcon from '@mui/icons-material/Today';
import { useParams } from "react-router-dom";
import { useData, useEvents, DataContext } from './DataContext';


function Speaker({ speaker }) {
    return <Stack direction="row" spacing={5}>
        <Avatar
            alt={speaker.name + " avatar"}
            src={speaker.picture.data.attributes.formats.medium.url}
            sx={{ width: "20vw", height: "20vw", maxWidth: 250, maxHeight: 250 }}
        /><Stack direction="column" spacing={2} sx={{ textShadow: '2px 2px 5px black' }}>
            <h3 className="event-speaker-name">{speaker.name}</h3>
            <Typography aria-label="Affiliation"
                className="event-speaker-affiliation" sx={{ fontWeight: 300, opacity: 0.9 }}>{speaker.affiliation}</Typography>
            <Typography className="event-speaker-bio" sx={{ fontSize: '.9rem', textAlign: { md: 'justify'} }}>{speaker.bio}</Typography>
        </Stack>
    </Stack>
}

function EventPage({ event }) {
    return <Stack direction="column" alignItems="flex-start" spacing={3}>
        <h1 className="event-title">{event.attributes.name}</h1>

        <TypeChip event={event.attributes} />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={5}>
            <Stack direction="row" spacing={4} alignItems="center">
                <Avatar className="event-avatar" sx={{ width: 48, height: 48, backgroundColor: muicolors.indigo[900] }}>
                    <PlaceIcon aria-hidden="true" sx={{ color: muicolors.indigo[400] }} />
                </Avatar>
                <span aria-label="Event Room">{event.attributes.room.data.attributes.name}</span>
            </Stack>
            <Stack direction="row" spacing={4} alignItems="center">
                <Avatar className="event-avatar" sx={{ width: 48, height: 48, backgroundColor: muicolors.indigo[900] }}>
                    <TodayIcon aria-hidden="true" sx={{ color: muicolors.indigo[400] }} />
                </Avatar>
                <Stack>
                    <b aria-label='Date'>{Moment(event.attributes.start).format('dddd DD MMMM')}</b>
                    <span aria-label='Time'>{Moment(event.attributes.start).format('HH:mm')} &ndash; {Moment(event.attributes.end).format('HH:mm')}</span>
                </Stack>
            </Stack>
        </Stack>

        <Box aria-label='Event Description' sx={{ backgroundColor: '#000000aa', textAlign: 'justify' }} p={5} style={{ marginLeft: '-24px', marginRight: '-24px' }}>
            {event.attributes.abstract}
        </Box>

        <h2 className="event-speaker-title">Speakers</h2>
        {event.attributes.speakers.data.map((speaker, i) => <Speaker key={speaker.id} speaker={speaker.attributes} />)}
    </Stack>
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
            {data.events && (() => {
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