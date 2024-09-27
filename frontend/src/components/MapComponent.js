// MapComponent.js
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, WMSTileLayer, FeatureGroup, useMapEvents } from 'react-leaflet';
import { getPixelValues } from '../services/api';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';

const MapComponent = ({ wmsLayer, onBoundingBoxSelected, selectingPixel, onPixelSelected }) => {
  const mapRef = React.useRef();

  useEffect(() => {
    if (mapRef.current) {
      const mapContainer = mapRef.current.getContainer();
      if (selectingPixel) {
        mapContainer.classList.add('pointer');
      } else {
        mapContainer.classList.remove('pointer');
      }
    }
  }, [selectingPixel]);

  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        if (selectingPixel) {
          const { lat, lng } = e.latlng;
          console.log('Coordenadas clicadas:', lat, lng);

          try {
            const data = await getPixelValues(lat, lng);
            console.log('Dados retornados do backend:', data);
            onPixelSelected(data); // Passar os dados para o App.js
          } catch (error) {
            console.error('Erro ao fazer a requisição:', error);
          }
        }
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[-19.917299, -43.934559]}
      zoom={16}
      style={{ height: '100vh', width: '100%' }}
      whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
    >
      <MapClickHandler />
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        attribution="© OpenStreetMap contributors" 
      />
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={(e) => {
            const { layer } = e;
            const { _southWest, _northEast } = layer.getBounds();
            onBoundingBoxSelected({
              latitudeInicial: _southWest.lat,
              longitudeInicial: _southWest.lng,
              latitudeFinal: _northEast.lat,
              longitudeFinal: _northEast.lng,
            });
          }}
          draw={{
            rectangle: true,
            polyline: false,
            circle: false,
            circlemarker: false,
            polygon: false,
            marker: false,
          }}
        />
      </FeatureGroup>
      {wmsLayer && (
        <WMSTileLayer
          key={JSON.stringify(wmsLayer)}
          url="/ows"
          layers={wmsLayer.product}
          format="image/png"
          transparent={true}
          version="1.3.0"
          crs={L.CRS.EPSG3857}
          bounds={[[wmsLayer.latitudeInicial, wmsLayer.longitudeInicial], [wmsLayer.latitudeFinal, wmsLayer.longitudeFinal]]}
          time={`${wmsLayer.startDate}/${wmsLayer.endDate}`}
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;
