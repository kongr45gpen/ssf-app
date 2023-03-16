import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const Div = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: "#0",
    padding: theme.spacing(1),
  }));

export default function Schedule() {
    return (
        <div>
        <h1>Schedule</h1>
        {[...Array(10)].map((x, i) =>
        <Grid container spacing={0} my={3}>
            <Grid xs={2}>
            <Typography style={{fontSize: '3rem', fontWeight: '400', lineHeight: '100%', margin: 0, padding: 0}}>
                11:00
                </Typography>
            </Grid>
            <Grid xs={9}>
            <Typography variant="body2" style={{fontSize: '30pt', fontWeight: '300'}}>
                Why is Mars a Planet?
            </Typography>
            </Grid>
            <Grid xs={2}>
            
            </Grid>
            <Grid xs={9} style={{color: '#333', fontWeight: '400'}}>
                Alex Ortoalf
            </Grid>
        </Grid> )}
        </div>
    );
}