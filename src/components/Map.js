import React from 'react';
import map from '../map.svg'


export default function Map() {
    return (
        <div>
        <h1>Map</h1>

        <img src={map} style={{maxWidth: "100vw", maxHeight: "60vh", textAlign: "center", margin: "auto", display: "block"}} alt="map of the venue" />
        </div>
    );
}