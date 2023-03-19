import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import Moment from 'moment';

export default function Schedule() {
    const [events, setEvents] = useState();

    const getApiData = async () => {
        const events = await fetch(
            "/api/events?populate=room,speakers"
        ).then((response) => response.json());

        setEvents(events);
    };

    useEffect(() => {
        getApiData();
    }, []);

    return (
        <div>
            <h1>Schedule</h1>
            {events && events['data'].map((e, i) => {
                const event = e['attributes'];

                return <Grid container spacing={0} my={3}>
                    <Grid xl={4} xs={5}>
                        <Typography style={{ fontSize: '3rem', fontWeight: '400', lineHeight: '100%', margin: 0, padding: 0 }}>
                            {Moment(event.start).format('HH:mm')}
                            &nbsp;&ndash;&nbsp;
                            {Moment(event.end).format('HH:mm')}
                        </Typography>
                    </Grid>
                    <Grid xl={8} xs={7}>
                        <Typography variant="body2" style={{ fontSize: '30pt', fontWeight: '300' }}>
                            { event.name }
                        </Typography>
                    </Grid>
                    <Grid xl={4} xs={5} style={{ color: '#333', fontWeight: '400' }}>
                        { event.room.data.attributes.name }
                    </Grid>
                    <Grid xl={8} xs={7} style={{ color: '#333', fontWeight: '400' }}>
                        { event.speakers.data.map((s) => s['attributes'].name).join(', ') }
                    </Grid>
                </Grid>
            })}
        </div>
    );
}