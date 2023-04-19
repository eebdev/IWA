import React, { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// @ts-ignore
const CoordinatesMap = ({ defaultCenter }) => {
    const [coordinates, setCoordinates] = useState([]);

    useEffect(() => {
        const fetchCoordinates = () => {
            fetch("/api/coordinates")
                .then((response) => response.json())
                .then((data) => setCoordinates(data));
        };

        fetchCoordinates(); // Haal de coördinaten direct op bij het laden van de component
        const interval = setInterval(fetchCoordinates, 1000); // Haal de coördinaten elke 30 seconden op

        return () => clearInterval(interval); // Opruimen van de interval bij het ontmantelen van de component
    }, []);

    const weatherStationIcon = new L.Icon({
        iconUrl: "/WeatherIcon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                    {coordinates.map((coordinate, index) => (
                        <Marker
                            key={index}
                            position={[coordinate.latitude, coordinate.longitude]}
                            icon={weatherStationIcon}
                        >
                            <Popup>
                                {coordinate.naam} <br /> Coördinaten: {coordinate.latitude}, {coordinate.longitude}
                            </Popup>
                        </Marker>
                    ))}
            </MapContainer>
        </div>
    );
};

export default CoordinatesMap;
