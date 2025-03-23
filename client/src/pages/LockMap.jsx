// src/pages/LocksMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './LocksMap.module.css';

const locksData = [
  { id: 'portal', position: [51.505, -0.09], name: 'Portal - Calle Falsa 123' },
  { id: '3A', position: [51.51, -0.1], name: '3ªA - Calle Falsa 123' }
];

function LocksMap() {
  return (
    <div className={styles.mapContainer}>
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locksData.map(lock => (
          <Marker key={lock.id} position={lock.position}>
            <Popup>
              {lock.name}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default LocksMap;