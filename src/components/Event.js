import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { useContext, useEffect } from 'react';
import Moment from 'moment';
import * as muicolors from '@mui/material/colors';
import Skeleton from '@mui/material/Skeleton';
import PlaceIcon from '@mui/icons-material/Place';
import TodayIcon from '@mui/icons-material/Today';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LinkIcon from '@mui/icons-material/Link';
import EmailIcon from '@mui/icons-material/Email';
import { useParams } from "react-router-dom";
import { Image } from 'react-shimmer'
import CircularProgress from '@mui/material/CircularProgress';
import { createEvent } from 'ics';
import slugify from 'slugify';
import Fab from '@mui/material/Fab';
import EventIcon from '@mui/icons-material/Event';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import { useData } from '../DataContext';
import { webShareCallback } from '../utils/WebShare';
import { BackgroundContext } from './ReactiveBackground';
import TypeChip from './TypeChip';

async function eventToIcs(event, organisation_details) {
    let eventData = {
        title: event.name,
        description: event.abstract,
        organizer: { name: organisation_details.event_name, email: organisation_details.event_email },
        startInputType: 'utc',
        endInputType: 'utc',
    }

    let start, end = undefined;
    if (event.start && event.end) {
        start = Moment(event.start);
        end = Moment(event.end);

        eventData['start'] = [start.year(), start.month() + 1, start.date(), start.hour(), start.minute()];
        eventData['end'] = [end.year(), end.month() + 1, end.date(), end.hour(), end.minute()];
    }

    if (event.room && event.room.data.attributes.location) {
        eventData['location'] = event.room.data.attributes.location;
    }

    if (event.room && event.room.data.attributes.latitude && event.room.data.attributes.longitude) {
        eventData['geo'] = { lat: event.room.data.attributes.latitude, lon: event.room.data.attributes.longitude };
    }

    let filename = slugify(event.name, { lower: true, strict: true }).substring(0, 40) + '.ics';

    if (start) {
        filename = Moment(start).format('YYYY-MM-DD') + '-' + filename;
    }

    const file = await new Promise((resolve, reject) => {
        createEvent(eventData, (error, value) => {
            if (error) {
                reject(error)
            }

            resolve(new File([value], filename, { type: 'text/calendar' }));
        })
    });


    // Create a fake download, and then release the memory immediately
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
}

function SocialIcon({ element, link, ...props }) {
    const Inner = element;

    return <Grid xs="auto"><a href={link} target="_blank" rel="noreferrer">
        <Avatar className="event-avatar" sx={{ width: { xs: 36, md: 48 }, height: { xs: 36, md: 48 }, backgroundColor: muicolors.blue[900] }}>
            <Inner sx={{ color: 'white' }} {...props} />
        </Avatar>
    </a></Grid>
}

function Speaker({ speaker }) {
    return <Stack direction="row" spacing={5}>
        <Stack direction="column" spacing={2}>
            <Avatar
                alt={speaker.name + " avatar"}
                sx={{ width: "20vw", height: "20vw", maxWidth: 250, maxHeight: 250 }}
                className="shimmered-image"
            >
                <Image
                    src={speaker.picture.data.attributes.formats.medium.url}
                    fallback={<CircularProgress />}
                    fadeIn={1}
                />
            </Avatar>
            <Grid container spacing={2} justifyContent="center">
                {speaker.linkedin && <SocialIcon element={LinkedInIcon} link={speaker.linkedin} aria-label="LinkedIn" />}
                {speaker.website && <SocialIcon element={LinkIcon} link={speaker.website} aria-label="Website" />}
                {speaker.email && <SocialIcon element={EmailIcon} link={"mailto:" + speaker.email} aria-label="Email" />}
            </Grid>
        </Stack>
        <Stack direction="column" spacing={2} sx={{ textShadow: '2px 2px 5px black' }}>
            <h3 className="event-speaker-name">{speaker.name}</h3>
            <Typography aria-label="Affiliation"
                className="event-speaker-affiliation" sx={{ fontWeight: 300, opacity: 0.9 }}>{speaker.affiliation}</Typography>
            <Typography className="event-speaker-bio" sx={{ fontSize: '.9rem', textAlign: { md: 'justify' } }}>{speaker.bio}</Typography>
        </Stack>
    </Stack>
}

function EventPage({ event }) {
    const data = useData();
    const { setBackground } = useContext(BackgroundContext);

    useEffect(() => {
        if (event.attributes.cover) {
            setBackground(event.attributes.cover.data.attributes.url)
        }

        return () => setBackground(null);
    }, [event, setBackground]);

    return <Stack direction="column" alignItems="flex-start" spacing={3}>
        <h1 className="event-title">{event.attributes.name}</h1>

        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" width="100%">
            <TypeChip event={event.attributes} />
            <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Fab variant="extended" color="primary" size="small" onClick={async () => eventToIcs(event.attributes, data.organisation)}>
                        <EventIcon sx={{ mr: 1 }} fontSize="small" />
                        Add To Calendar
                    </Fab>
                </Box>
                <Box sx={{ display: { xs: 'block', sm: 'none' } }} aria-label="add to calendar">
                    <Fab sx={{ backgroundColor: muicolors.red[200], '&:hover': { backgroundColor: muicolors.red[400] } }} size="small" onClick={async () => eventToIcs(event.attributes, data.organisation)}>
                        <EventIcon />
                    </Fab>
                </Box>
                
                <Fab color="secondary" size="small" aria-label="share" onClick={ webShareCallback({ 
                    url: window.location.href,
                    title: event.attributes.name,
                    text: `Event in ${data.organisation ? data.organisation.event_name : 'a conference'}: ${event.attributes.name}`,
                }) }><ShareIcon /></Fab>
                <Fab color="" size="small"><FavoriteBorderIcon /></Fab>
            </Stack>
        </Stack>

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

        <Box aria-label='Event Description' sx={{ backgroundColor: '#000000aa', textAlign: 'justify', maxWidth: '100vw' }} p={5} style={{ marginLeft: '-24px', marginRight: '-24px' }}>
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
    const { eventId } = useParams();
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