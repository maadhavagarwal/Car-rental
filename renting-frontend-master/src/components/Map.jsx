import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const AutoZoom = ({ userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 15); // Set the desired zoom level (15 is close, adjust as needed)
    }
  }, [userLocation, map]);

  return null;
};

export default function Map({zip=401304}) {
  const [userLocation, setUserLocation] = useState();
  const [zipCode, setZipCode] = useState(zip);

  useEffect(() => {
    //   setZipCode(zip);
      const handleGetLocationByZip = async () => {
        if (!zipCode) {
          alert('Please enter a zip code');
          return;
        }
        try {
          const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${zipCode}&key=0543b1c2101a40a2b0065db2865ed91e`);
          console.log('API response:', response.data);
          if (response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry;
            setUserLocation([lat, lng]);
          } else {
            alert('Invalid zip code');
          }
        } catch (error) {
          alert('Error fetching location data');
          console.error('Error:', error);
        }
      };
      handleGetLocationByZip()
  }, [zipCode]);

  return (
    <div style={{width: "100%" }}>
      <MapContainer center={userLocation} zoom={13} style={{ height: "70vh", width: "100%", margin: "20px auto",borderRadius:"30px"}}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={userLocation} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
        <AutoZoom userLocation={userLocation} />
      </MapContainer>
    </div>
  );
}
