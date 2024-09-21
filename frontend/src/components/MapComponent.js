import React from 'react';
import { MapContainer, TileLayer, WMSTileLayer, FeatureGroup, useMapEvent } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';

const MapComponent = ({ wmsLayer, onBoundingBoxSelected }) => {
  const wmsUrl = process.env.REACT_APP_OWS_URL;

  console.log("WMS URL:", wmsUrl);


  
  const MapClickHandler = () => {
    useMapEvent('click', (e) => {
      console.log('Coordenadas clicadas:', e.latlng);
    });
    return null;
  };

  return (
    <MapContainer center={[-19.917299, -43.934559]} zoom={16} style={{ height: '100vh', width: '100%' }}>
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
          url={wmsUrl}
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
