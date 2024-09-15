import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import BatasProvinsi from "./assets/provinsi.json";

const Map = () => {
    const style = (feature) => {
        return {
          fillColor: "red",
          weight: 1,
          opacity: 1,
          color: "grey",
          fillOpacity: 0.7,
        };
      } 
  return (
    <MapContainer
      center={[0, 120]}
      zoom={5}
      className="w-full h-screen"  // Tailwind classes for full width and full height
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON data={BatasProvinsi} style={style} />
    </MapContainer>
  );
};
export default Map;
