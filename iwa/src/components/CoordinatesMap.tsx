import React, { useEffect, useState } from "react";
import { Icon, LatLngExpression } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useMarkerCluster from "../hooks/useMarkerCluster";
import { Coordinates } from "@ctypes/types";

const CoordinatesMap = ({
  defaultCenter,
}: {
  defaultCenter: LatLngExpression;
}) => {
  const [coordinates, setCoordinates] = useState<Coordinates>([]);

  useEffect(() => {
    const fetchCoordinates = () => {
      fetch("/api/coordinates")
        .then((response) => response.json())
        .then((data) => setCoordinates(data));
    };

    fetchCoordinates();
    const interval = setInterval(fetchCoordinates, 1000);

    return () => clearInterval(interval);
  }, []);

  const weatherStationIcon = new L.Icon({
    iconUrl: "/WeatherIcon.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

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
        {coordinates.length > 0 && (
          <MapMarkers coordinates={coordinates} icon={weatherStationIcon} />
        )}
      </MapContainer>
    </div>
  );
};

const MapMarkers = ({
  coordinates,
  icon,
}: {
  coordinates: Coordinates;
  icon: Icon;
}) => {
  useMarkerCluster(coordinates, icon);
  return null;
};

export default CoordinatesMap;
