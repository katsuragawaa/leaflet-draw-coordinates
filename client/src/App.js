import './App.css';
import 'leaflet/dist/leaflet.css';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import Freedraw, { ALL } from 'react-leaflet-freedraw';
import axios from 'axios';

import mapPin from './assets/images/location.png';

const mapPinIcon = L.icon({
  iconUrl: mapPin,
  iconSize: [20,20],
  iconAnchor: [29, 68],
  popupAnchor: [170, 2],
});

const initialPosition = { lat: -25.441105, lng: -49.276855 };

function SetInitialPosition() {
  const map = useMapEvents({
    click: () => {
      map.locate();
      console.log('pageloaded');
    },
    locationfound: (location) => {
      console.log('location found:', location);
      map.flyTo(location.latlng, 14);
    },
  });

  return null;
}

function App() {
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [testCoordinates, setTestCoordinates] = useState([]);
  const freedrawRef = useRef(null);

  useEffect(() => {
    console.log(polygonCoordinates);
    axios.get('http://localhost:3001/').then((response) => {
      const properties = response.data;
      console.log(properties);
      setTestCoordinates(properties);
    });
  }, [polygonCoordinates]);

  return (
    <div id='page-map'>
      <main>
        <div className='result-container'>
          [
          {polygonCoordinates.map((coord) => (
            <div key={coord[0] * Math.random()}>
              [{coord[0]}, {coord[1]}],
            </div>
          ))}
          ]
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

        {testCoordinates.map((coord) => {
          console.log(coord);
          return (
            <Marker
              icon={mapPinIcon}
              position={{
                lat: coord.coordinates[0],
                lng: coord.coordinates[1],
              }}
            ></Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default App;
