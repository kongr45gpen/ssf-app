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
import {useData, DataProvider, useEvents} from './DataContext';
import * as muicolors from '@mui/material/colors';
import TypeChip from './TypeChip';
import { Link } from "react-router-dom";

function stringToColor(index, brightness=900, colorName = undefined) {
    if (colorName === undefined) {
        const colors = [ "brown", "brown", "indigo", "green" ];
        colorName = colors[index];
    }
  
    return muicolors[colorName][brightness] + "dd";
  }

export default function Schedule() {
    const { events } = useData();

    return (
        <div>
            <h1>Schedule</h1>
            <Stack spacing={2}>
            {events && events['data'].map((e, i) => {
                const event = e['attributes'];

                return <Paper sx={{textDecoration: 'none', backgroundColor: stringToColor(event.room.data.id)}} elevation={5} component={Link} to={`./` + e['id']}>
                    <Grid container spacing={0} p={2}>
                    <Grid xl={4} xs={5} pr={3}>
                        <Typography className="schedule-time" sx={{ fontSize: "2.5rem", fontWeight: 400, textAlign: { xs: "center", md: "left" }}}>
                            {Moment(event.start).format('HH:mm')}
                            {" "}&ndash;{" "}
                            {Moment(event.end).format('HH:mm')}
                        </Typography>
                    </Grid>
                    <Grid xl={8} xs={7}>
                        <Typography sx={{ fontWeight: 300, fontSize: {xs: "1.5rem", sm: "2rem", md: "2.5rem"} }}>
                            { event.name }
                        </Typography>
                    </Grid>
                    <Grid xl={4} xs={5} className="schedule-room">
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2} mr={3}>
                            <TypeChip event={event} />
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