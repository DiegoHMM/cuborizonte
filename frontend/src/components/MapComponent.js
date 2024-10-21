// MapComponent.js
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, useMap, useMapEvents } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-side-by-side';
import { getPixelValues } from '../services/api';

// Se você baixou o CSS e incluiu em src/styles
import '../styles/leaflet-side-by-side.css'; // Importe o CSS do Side by Side

const SideBySideLayers = ({ wmsLayerLeft, wmsLayerRight }) => {
  const map = useMap();
  const leftLayerRef = useRef(null);
  const rightLayerRef = useRef(null);
  const sideBySideRef = useRef(null);

  useEffect(() => {
    if (wmsLayerLeft && wmsLayerRight) {
      // Remove camadas existentes se houver
      if (leftLayerRef.current) {
        map.removeLayer(leftLayerRef.current);
      }
      if (rightLayerRef.current) {
        map.removeLayer(rightLayerRef.current);
      }
      if (sideBySideRef.current) {
        sideBySideRef.current.remove();
      }

      // Criar camadas WMS usando L.tileLayer.wms
      const leftLayer = L.tileLayer.wms('/ows', {
        layers: wmsLayerLeft.product,
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        crs: L.CRS.EPSG3857,
      });

      const rightLayer = L.tileLayer.wms('/ows', {
        layers: wmsLayerRight.product,
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        crs: L.CRS.EPSG3857,
      });

      leftLayerRef.current = leftLayer;
      rightLayerRef.current = rightLayer;

      // Adicionar camadas ao mapa
      leftLayer.addTo(map);
      rightLayer.addTo(map);

      // Inicializar o controle Side by Side
      const sideBySide = L.control.sideBySide(leftLayer, rightLayer).addTo(map);
      sideBySideRef.current = sideBySide;

      return () => {
        // Limpar ao desmontar
        if (leftLayerRef.current) {
          map.removeLayer(leftLayerRef.current);
        }
        if (rightLayerRef.current) {
          map.removeLayer(rightLayerRef.current);
        }
        if (sideBySideRef.current) {
          sideBySideRef.current.remove();
        }
      };
    }
  }, [map, wmsLayerLeft, wmsLayerRight]);

  return null;
};

const MapClickHandler = ({ selectingPixel, onPixelSelected }) => {
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

const MapComponent = ({
  wmsLayerLeft,
  wmsLayerRight,
  onBoundingBoxSelected,
  selectingPixel,
  onPixelSelected,
}) => {
  const mapRef = useRef();

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

  return (
    <MapContainer
      center={[-19.917299, -43.934559]}
      zoom={16}
      style={{ height: '100vh', width: '100%' }}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
      }}
    >
      <MapClickHandler selectingPixel={selectingPixel} onPixelSelected={onPixelSelected} />
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
      {wmsLayerLeft && wmsLayerRight && (
        <SideBySideLayers wmsLayerLeft={wmsLayerLeft} wmsLayerRight={wmsLayerRight} />
      )}
    </MapContainer>
  );
};

export default MapComponent;
