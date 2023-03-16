import React from 'react';
import map from './map.svg'
import Box from '@mui/material/Box';


export default function Map() {
    return (
        <div>
        <h1>Map</h1>

        <img src={map} style={{maxWidth: "100vw", maxHeight: "100vh", textAlign: "center", margin: "auto", display: "block"}} alt="map of the venue" />
        </div>
    );
}