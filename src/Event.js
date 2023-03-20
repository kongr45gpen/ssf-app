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
import { Form, useLoaderData } from "react-router-dom";

export async function loader({ params }) {
    console.log(params);
    return { eventId: params.eventId };
  }
  

export default function Event({ params }) {
    const { eventId } = useLoaderData();

    return (
        <div>
            EVENT { eventId }
        </div>
    );
}