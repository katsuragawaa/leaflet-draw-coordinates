import './App.css';
import 'leaflet/dist/leaflet.css';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import Freedraw, { ALL } from 'react-leaflet-freedraw';
import axios from 'axios';

import mapPin from './assets/images/location.png';

const mapPinIcon = L.icon({
  iconUrl: mapPin,
  iconSize: [20, 20],
  iconAnchor: [0, 0],
  popupAnchor: [10, -5],
});

const initialPosition = { lat: -25.441105, lng: -49.276855 };

function App() {
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [properties, setProperties] = useState([]);
  const freedrawRef = useRef(null);

  useEffect(() => {
    console.log(polygonCoordinates);
    const coordinates = JSON.stringify(polygonCoordinates);
    axios.get(`http://localhost:3001/api/${coordinates}`).then((response) => {
      const properties = response.data;
      console.log(properties);
      setProperties(properties);
    });
  }, [polygonCoordinates]);

  console.log(polygonCoordinates);

  return (
    <div id='page-map'>
      <main>
        <div className='result-container'>
          <h2>Encontrado {properties.length} Imóveis:</h2>
          <ul>
            {properties.map((prop) => (
              <li>{prop.properties.name}</li>
            ))}
          </ul>
        </div>
      </main>

      <MapContainer
        center={initialPosition}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
      >
        {/* <SetInitialPosition /> */}
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_ACCESS_TOKEN_MAP_BOX}`}
        />
        <Freedraw
          mode={ALL}
          eventHandlers={{
            markers: (event) => {
              console.log(
                'markers drawn - latLngs',
                event.latLngs[0],
                'Polygons:',
                freedrawRef.current.size()
              );
              if (freedrawRef.current.size() === 0) {
                setPolygonCoordinates([]);
              }
              if (event.latLngs[0]) {
                const newPolygon = event.latLngs[0].map((coord) =>
                  Object.values(coord)
                );
                setPolygonCoordinates(newPolygon);
              }
            },
            mode: (event) => console.log('mode changed', event),
          }}
          ref={freedrawRef}
        />

        {properties.map((prop) => {
          return (
            <Marker
              icon={mapPinIcon}
              position={{
                lat: prop.location.coordinates[0],
                lng: prop.location.coordinates[1],
              }}
              key={prop.id}
            >
              <Popup>{prop.properties.name}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default App;
