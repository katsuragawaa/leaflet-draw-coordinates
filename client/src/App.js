import './App.css';
import 'leaflet/dist/leaflet.css';

import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Freedraw, { ALL } from 'react-leaflet-freedraw';
import L from 'leaflet';
import axios from 'axios';

import mapPin from './assets/images/location.png';

const mapPinIcon = L.icon({
  iconUrl: mapPin,
  iconSize: [20, 20],
  iconAnchor: [0, 0],
  popupAnchor: [10, -5],
});

// posição que o mapa é inicializado
const initialPosition = { lat: -25.441105, lng: -49.276855 };

function App() {
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [properties, setProperties] = useState([]);
  const freedrawRef = useRef(null);

  // conecta com o servidor toda vez que o polígono muda
  useEffect(() => {
    const coordinates = JSON.stringify(polygonCoordinates);
    axios.get(`http://localhost:3001/api/${coordinates}`).then((response) => {
      // pega a resposta do servidor e salva no estado properties
      const properties = response.data;
      setProperties(properties);
    });
  }, [polygonCoordinates]);

  return (
    <div id='page-map'>
      <main>
        <div className='result-container'>
          <h2>Encontrado {properties.length} Imóveis:</h2>
          <ul>
            {properties.map((p) => (
              <li>{p.properties.name}</li>
            ))}
          </ul>
        </div>
      </main>

      <MapContainer
        center={initialPosition}
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
							// se não existe um polígono no mapa, volta ao estado inicial
              if (freedrawRef.current.size() === 0) {
                setPolygonCoordinates([]);
							}
							// se existe um polígono, transforma as coordenadas em uma lista e salva como o novo polígono
              if (event.latLngs[0]) {
                const newPolygon = event.latLngs[0].map((coord) =>
                  Object.values(coord)
                );
                setPolygonCoordinates(newPolygon);
              }
            },
          }}
          ref={freedrawRef}
        />

        {properties.map((p) => {
          return (
            <Marker
              icon={mapPinIcon}
              position={{
                lat: p.location.coordinates[0],
                lng: p.location.coordinates[1],
              }}
              key={p.id}
            >
              <Popup>{p.properties.name}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default App;
