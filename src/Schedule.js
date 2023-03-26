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
import { groupBy, shuffle, clone, every } from 'lodash';
import { Flipper, Flipped } from 'react-flip-toolkit'
import anime from "animejs";
import { parseFilter } from './utils/Partitioning';

const animateElementIn = (el, i) =>
    anime({
        targets: el,
        opacity: 1,
        easing: "easeOutSine",
        duration: 500
    });

const animateElementOut = (el, i, onComplete) => {
    anime({
        targets: el,
        opacity: 0,
        easing: "easeOutSine",
        complete: onComplete,
        duration: 500
    });
};

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

function Selector({ days }) {
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
            <ToggleButton disabled={true} aria-hidden="true" value="">
                <TodayIcon />
            </ToggleButton>
            {days.map((day, index) => {
                const date = Moment(day);
                const value = date.format('dddd').toLowerCase();
                return <ToggleButton key={value} value={value} component={Link} to={`/schedule/` + value}>
                    {date.format('dddd d MMM')}
                </ToggleButton>;
            })}
        </StyledToggleButtonGroup></Stack>;
}

function EventInSchedule({ idd, event }) {
    return <Flipped flipId={idd} onAppear={animateElementIn} onExit={animateElementOut}>
        <Box sx={{ pt: 3 }}>
            <Paper sx={{ textDecoration: 'none', backgroundColor: stringToColor(event.room.data.id), display: 'block' }} elevation={5} component={Link} to={`event/` + idd}>
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
            </Paper>
        </Box>
    </Flipped>;
}

function filterEvents(events, filterPartitions) {
    return events.filter((e) => every(e.attributes.partitions, (p, id) => filterPartitions[id] == null || filterPartitions[id] == p.tag));
}

export default function Schedule() {
    const { filter } = useParams();
    const { events, partitions } = useData();
    const [eventsByDay, setEventsByDay] = useState({});

    useEffect(() => {
        if (!events) return;

        setEventsByDay(groupBy(events.data, (e) => Moment(e.attributes.start).format('YYYY-MM-DD')));
    }, [events]);

    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        if (!events) return;

        const currentFilter = parseFilter(filter || '', partitions);
        console.debug("Detected filter: ", currentFilter);
        // TODO: What if the events are not hydrated?

        const filteredEvents = filterEvents(events['data'], currentFilter);
        setFilteredEvents(filteredEvents);
    }, [events, filter]);

    const simultaneousAnimations = ({
        hideEnteringElements,
        animateEnteringElements,
        animateExitingElements,
        animateFlippedElements
    }) => {
        hideEnteringElements();
        animateExitingElements();
        animateFlippedElements();
        animateEnteringElements();
    };

    return (
        <div>
            <h1>Schedule</h1>
            <Stack spacing={2} direction="row" justifyContent="center" mb={3}>
                <Selector days={eventsByDay && Object.keys(eventsByDay)} />
            </Stack>
            <Flipper flipKey={filteredEvents.map((e) => e.id).join(' ')} handleEnterUpdateDelete={simultaneousAnimations}>
                <Stack spacing={0}>
                    {/* Spacing set to 0 and top margins used on childs, because Flipper throws these elements inside and messes up the margins. */}
                    {filteredEvents && filteredEvents.map((e) => <EventInSchedule key={e.id} idd={e.id} event={e.attributes} />)}
                </Stack>
            </Flipper>
        </div>
    );
}