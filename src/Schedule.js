import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import Moment from 'moment';
import Chip from '@mui/material/Chip';
import * as muicolors from '@mui/material/colors';
import MicIcon from '@mui/icons-material/Mic';
import KeyIcon from '@mui/icons-material/Key';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';

function stringToColor(index, brightness=900, colorName = undefined) {
    // let hash = 0;
    // let i;

    // const seed = "ecg725673";
    // string += seed;
  
    // // Simple hash generator
    // /* eslint-disable no-bitwise */
    // for (i = 0; i < string.length; i += 1) {
    //   hash = string.charCodeAt(i) + ((hash << 5) - hash);
    // }
    // hash = Math.abs(hash);
    /* eslint-enable no-bitwise */
  
    // let color = '#';
  
    // for (i = 0; i < 3; i += 1) {
    //   const value = (hash >> (i * 8)) & 0xff;
    //   color += `00${value.toString(16)}`.slice(-2);
    // }

    if (colorName === undefined) {
        const colors = [ "brown", "brown", "indigo", "green" ];
        colorName = colors[index];
    }
  
    return muicolors[colorName][brightness];
  }

function typeToColor(type) {
    const types = {
        "talk": "green",
        "keynote": "red",
        "workshop": "blue",
        "panel": "orange",
    };

    return stringToColor(0, 900, types[type]);
}

function typeToIcon(type) {
    const types = {
        "talk": <MicIcon />,
        "keynote": <KeyIcon />,
        "workshop": <SettingsIcon />,
        "panel": <PeopleIcon />,
    };

    return types[type];
}

export default function Schedule() {
    const [events, setEvents] = useState();

    const getApiData = async () => {
        const events = await fetch(
            "/api/events?populate=room,speakers,speakers.picture"
        ).then((response) => response.json());

        setEvents(events);
    };

    useEffect(() => {
        getApiData();
    }, []);

    return (
        <div>
            <h1>Schedule</h1>
            <Stack spacing={2}>
            {events && events['data'].map((e, i) => {
                const event = e['attributes'];

                return <Paper sx={{backgroundColor: stringToColor(event.room.data.id)}}>
                    <Grid container spacing={0} p={2}>
                    <Grid xl={4} xs={5}>
                        <span className="schedule-time">
                            {Moment(event.start).format('HH:mm')}
                            &nbsp;&ndash;&nbsp;
                            {Moment(event.end).format('HH:mm')}
                        </span>
                    </Grid>
                    <Grid xl={8} xs={7}>
                        <span className="schedule-name">
                            { event.name }
                        </span>
                    </Grid>
                    <Grid xl={4} xs={5} className="schedule-room">
                        <Stack direction="row" spacing={2}>
                        <Chip icon={typeToIcon(event.type)} label={ event.type } sx={{backgroundColor: typeToColor(event.type), textTransform: 'capitalize'}} />
                        <Chip label={ event.room.data.attributes.name } />
                        </Stack>
                    </Grid>
                    <Grid xl={8} xs={7} className="schedule-speakers">
                        <Stack direction="row" spacing={2}>
                        { event.speakers.data.map((s) => <div>
                            <Avatar src={s['attributes'].picture.data['attributes'].formats.thumbnail.url } className="schedule-avatar" />
                            { s['attributes'].name }
                        </div>) }
                        </Stack>
                    </Grid>
                </Grid>
                </Paper>
            })}
            </Stack>
        </div>
    );
}