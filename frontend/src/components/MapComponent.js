// src/components/MapComponent.js
import React, { useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';

const MapComponent = ({ onBoundingBoxSelected }) => {
  // Referência para o grupo de itens desenhados
  const drawnItemsRef = useRef(new L.FeatureGroup());

  // Função para lidar com o evento de criação de uma forma no mapa
  const handleCreated = (e) => {
    const layer = e.layer;
    drawnItemsRef.current.addLayer(layer);

    // Obtém os limites (bounding box) do retângulo desenhado
    const bounds = layer.getBounds();
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();

    // Envia as coordenadas da bounding box para o componente pai
    onBoundingBoxSelected({
      latitudeInicial: southWest.lat,
      longitudeInicial: southWest.lng,
      latitudeFinal: northEast.lat,
      longitudeFinal: northEast.lng,
    });
  };

  return (
    <MapContainer
      center={[-19.917299, -43.934559]} // Centro inicial do mapa
      zoom={16} // Nível de zoom inicial
      style={{ height: '600px', width: '100%' }} // Estilo do contêiner do mapa
    >
      {/* Camada de mapa base usando OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      
      {/* Grupo de features para desenhar no mapa */}
      <FeatureGroup ref={drawnItemsRef}>
        {/* Controle de edição para permitir o desenho de retângulos */}
        <EditControl
          position="topright" // Posição do controle de desenho
          onCreated={handleCreated} // Função chamada quando um retângulo é criado
          draw={{
            rectangle: true,  // Habilita o desenho de retângulos
            polyline: false,  // Desabilita outras formas
            circle: false,
            circlemarker: false,
            polygon: false,
            marker: false,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default MapComponent;
