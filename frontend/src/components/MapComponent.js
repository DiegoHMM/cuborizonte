import React from 'react';
import { MapContainer, TileLayer, WMSTileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';

const MapComponent = ({ wmsLayer, onBoundingBoxSelected }) => {
  return (
    <MapContainer center={[-19.917299, -43.934559]} zoom={16} style={{ height: '100vh', width: '100%' }}>
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
          key={JSON.stringify(wmsLayer)}  // Força a re-renderização da camada sempre que os dados mudarem
          url="http://localhost:8000"
          layers={wmsLayer.product}
          format="image/png"
          transparent={true}
          version="1.3.0"
          crs={L.CRS.EPSG3857}  // Corrigido para passar o objeto CRS corretamente
          bounds={[[wmsLayer.latitudeInicial, wmsLayer.longitudeInicial], [wmsLayer.latitudeFinal, wmsLayer.longitudeFinal]]}
          time={`${wmsLayer.startDate}/${wmsLayer.endDate}`}
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;
