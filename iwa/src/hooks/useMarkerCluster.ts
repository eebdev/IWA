import { Coordinate, Coordinates } from "@ctypes/types";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L, { Icon } from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

const useMarkerCluster = (coordinates: Coordinates, markerIcon: Icon) => {
  const map = useMap();

  useEffect(() => {
    const markerClusterGroup = L.markerClusterGroup();
    coordinates.forEach((coordinate: Coordinate) => {
      const leafletMarker = L.marker(
        [coordinate.latitude, coordinate.longitude],
        {
          icon: markerIcon,
        }
      );
      leafletMarker.bindPopup(
        `${coordinate.name} <br /> Coördinaten: ${coordinate.latitude}, ${coordinate.longitude}`
      );
      markerClusterGroup.addLayer(leafletMarker);
    });
    map.addLayer(markerClusterGroup);

    return () => {
      map.removeLayer(markerClusterGroup);
    };
  }, [map, coordinates, markerIcon]);
};

export default useMarkerCluster;
