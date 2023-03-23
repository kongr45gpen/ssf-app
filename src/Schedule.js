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
import { useData, DataProvider, useEvents } from './DataContext';
import * as muicolors from '@mui/material/colors';
import TypeChip from './TypeChip';
import { Link } from "react-router-dom";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TodayIcon from '@mui/icons-material/Today';
import { useParams } from "react-router-dom";


const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
        margin: theme.spacing(0.5),
        border: 0,
        '&.Mui-disabled': {
            border: 0,
        },
        '&:not(:first-of-type)': {
            borderRadius: '2rem',
        },
        '&:first-of-type': {
            borderRadius: '2rem',
        },
    },
}));

function stringToColor(index, brightness = 900, colorName = undefined) {
    if (colorName === undefined) {
        const colors = ["brown", "brown", "indigo", "green"];
        colorName = colors[index];
    }

    return muicolors[colorName][brightness] + "dd";
}

function Selector() {
    const [alignment, setAlignment] = React.useState('');

    return <Stack direction="row">
        <StyledToggleButtonGroup
            color="primary"
            size="large"
            value={alignment}
            exclusive
            onChange={(e, v) => { setAlignment(v); }}
            aria-label="Date"
        >
            <ToggleButton disabled={true} aria-hidden="true">
                <TodayIcon />
            </ToggleButton>
            <ToggleButton value="friday" component={Link} to={`/schedule/` + 'friday'}>
                Friday 5 May
            </ToggleButton>
            <ToggleButton value="saturday" component={Link} to={`/schedule/` + 'saturday'}>
                Saturday 6 May
            </ToggleButton>
        </StyledToggleButtonGroup></Stack>;
}

function EventInSchedule({ id, event }) {
    return <Paper key={id} sx={{ textDecoration: 'none', backgroundColor: stringToColor(event.room.data.id) }} elevation={5} component={Link} to={`event/` + id}>
        <Grid container spacing={0} p={2}>
            <Grid xl={4} xs={5} pr={3}>
                <Typography className="schedule-time" sx={{ fontSize: "2.5rem", fontWeight: 400, textAlign: { xs: "center", md: "left" } }}>
                    {Moment(event.start).format('HH:mm')}
                    {" "}&ndash;{" "}
                    {Moment(event.end).format('HH:mm')}
                </Typography>
            </Grid>
            <Grid xl={8} xs={7}>
                <Typography sx={{ fontWeight: 300, fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}>
                    {event.name}
                </Typography>
            </Grid>
            <Grid xl={4} xs={5} className="schedule-room">
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} mr={3}>
                    <TypeChip event={event} />
                    <Chip label={event.room.data.attributes.name} />
                </Stack>
            </Grid>
            <Grid xl={8} xs={7} className="schedule-speakers">
                <Stack direction="row" spacing={2}>
                    {event.speakers.data.map((s) => <div key={s['id']}>
                        <Avatar src={s['attributes'].picture.data['attributes'].formats.thumbnail.url} className="schedule-avatar" />
                        {s['attributes'].name}
                    </div>)}
                </Stack>
            </Grid>
        </Grid>
    </Paper>;
}

function filterEvents(events, filterWord) {
    return events.filter((e) => Moment(e.attributes.start).format('dddd').toLowerCase() === filterWord.toLowerCase());
}

export default function Schedule() {
    const { events } = useData();
    const { filter } = useParams();

    // useEffect(() => {
    //     if (filter === undefined) {
    //         setFilter('friday');
    //     } else {
    //         setFilter(filter);
    //     }
    // }, [filter]);

    return (
        <div>
            <h1>Schedule</h1>
            <Stack spacing={2} direction="row" justifyContent="center" mb={3}>
                <Selector />
            </Stack>
            <Stack spacing={2}>
                {events && filterEvents(events['data'], filter).map((e) => <EventInSchedule key={e.id} id={e.id} event={e.attributes} />)}
            </Stack>
        </div>
    );
}