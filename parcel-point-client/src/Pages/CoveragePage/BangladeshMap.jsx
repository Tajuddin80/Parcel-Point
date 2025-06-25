// /components/BangladeshMap.jsx
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import warehouseData from "../../assets/warehouses.json";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const smallIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [0, -28],
  shadowSize: [41, 41],
});

const MapFlyTo = ({ lat, lng }) => {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 10, { duration: 1.5 });
    }
  }, [lat, lng, map]);

  return null;
};

const BangladeshMap = ({ searchFocusDistrict }) => {
  return (
    <div className="w-full h-[70vh] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={[23.685, 90.3563]}
        zoom={7}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {searchFocusDistrict && (
          <MapFlyTo
            lat={searchFocusDistrict.latitude}
            lng={searchFocusDistrict.longitude}
          />
        )}

        {warehouseData.map((location, index) => (
          <Marker
            key={index}
            position={[location.latitude, location.longitude]}
            icon={smallIcon}
          >
            <Popup>
              <div className="text-sm">
                <h2 className="font-bold">{location.district}</h2>
                <p>
                  <strong>City:</strong> {location.city}
                </p>
                <p>
                  <strong>Status:</strong> {location.status}
                </p>
                <p>
                  <strong>Covered:</strong> {location.covered_area.join(", ")}
                </p>
             
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BangladeshMap;
