import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet'

// Fix for default icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ setLocation }) {
  const map = useMapEvents({
    click(e) {
      setLocation(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return null;
}

function SearchControl({ setLocation }) {
  const map = useMap();
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    if (!query) return;

    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      if (response.data && response.data.length > 0) {
        const { lat, lon, display_name } = response.data[0];
        const location = { lat: parseFloat(lat), lng: parseFloat(lon), name: display_name };
        setLocation(location);
        map.flyTo(location, 13);
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  return (
    <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000 }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search location"
        className="p-2 border rounded"
      />
      <button onClick={handleSearch} className="p-2 border rounded bg-primary-500 text-white">
        Search
      </button>
    </div>
  );
}

const DynamicMap = ({ setLocation, location }) => (
  <MapContainer center={[51.505, -0.09]} zoom={13} className="h-64 rounded-lg">
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <SearchControl setLocation={setLocation} />
    <LocationMarker setLocation={setLocation} />
    {location && <Marker position={location}></Marker>}
  </MapContainer>
);

export default DynamicMap;
