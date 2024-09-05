import React, { useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, WMSTileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';

const MapComponent = ({ onBoundingBoxSelected, wmsLayer }) => {
  const mapRef = useRef();

  // Handler para quando uma forma é criada
  const handleCreated = (e) => {
    const layer = e.layer;
    const drawnItems = new L.FeatureGroup();
    drawnItems.addLayer(layer);
    const bounds = layer.getBounds();
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();

    onBoundingBoxSelected({
      latitudeInicial: southWest.lat,
      longitudeInicial: southWest.lng,
      latitudeFinal: northEast.lat,
      longitudeFinal: northEast.lng,
    });
  };

  return (
    <MapContainer
      center={[-19.917299, -43.934559]}
      zoom={16}
      style={{ height: '600px', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={handleCreated}
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
          url="http://localhost:8000"
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
