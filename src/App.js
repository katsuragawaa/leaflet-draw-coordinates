import './App.css';
import 'leaflet/dist/leaflet.css';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import React, { useState, useRef } from 'react';
import L from 'leaflet';
import Freedraw, { ALL } from 'react-leaflet-freedraw';

import mapPin from './assets/images/location.png';

const mapPinIcon = L.icon({
  iconUrl: mapPin,
  iconSize: [30, 30],
  iconAnchor: [29, 68],
  popupAnchor: [170, 2],
});

const initialPosition = { lat: -25.441105, lng: -49.276855 };

function App() {
  const [center, setCenter] = useState(initialPosition);
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const freedrawRef = useRef(null);

  return (
    <div id='page-map'>
      <main>
        <div className='result-container'>
          {polygonCoordinates.map((coord) => (
            <div>{JSON.stringify(coord)}</div>
          ))}
        </div>
      </main>

      <MapContainer
        center={center}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_ACCESS_TOKEN_MAP_BOX}`}
        />
        <Freedraw
          mode={ALL}
          eventHandlers={{
            markers: (event) => {
              console.log(
                'markers drawn - latLngs',
                event.latLngs,
                'Polygons:',
                freedrawRef.current.size()
              );
              setPolygonCoordinates(
                polygonCoordinates.concat(event.latLngs[0])
              );
            },
            mode: (event) => console.log('mode changed', event),
          }}
          ref={freedrawRef}
        />

        <Marker icon={mapPinIcon} position={center}></Marker>
      </MapContainer>
    </div>
  );
}

export default App;
