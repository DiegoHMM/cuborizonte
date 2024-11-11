// MapComponent.js
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, useMap, useMapEvents } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-side-by-side';
import { getPixelValues } from '../services/api';

// Importe o CSS do Side by Side se você o baixou e incluiu no projeto
import '../styles/leaflet-side-by-side.css';

const SingleLayer = ({ wmsData }) => {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    if (wmsData) {
      // Remove existing layer if any
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }

      // Correct BBOX order for WMS 1.3.0 and EPSG:4326
      const bbox = [
        wmsData.latitudeInicial,
        wmsData.longitudeInicial,
        wmsData.latitudeFinal,
        wmsData.longitudeFinal,
      ];

      // Construct the WMS URL with corrected BBOX and width/height
      const wmsUrl = `/cuborizonte/ows/?service=WMS&request=GetMap&layers=${wmsData.product}&styles=&format=image/png&transparent=true&version=1.3.0&crs=EPSG:4326&bbox=${bbox.join(',')}&width=512&height=512`;

      // Create an image overlay using L.imageOverlay
      const layer = L.imageOverlay(wmsUrl, [
        [wmsData.latitudeInicial, wmsData.longitudeInicial],
        [wmsData.latitudeFinal, wmsData.longitudeFinal],
      ]);

      layerRef.current = layer;

      // Add layer to the map
      layer.addTo(map);

      return () => {
        // Clean up on unmount
        if (layerRef.current) {
          map.removeLayer(layerRef.current);
        }
      };
    }
  }, [map, wmsData]);

  return null;
};


const SideBySideLayers = ({ wmsLayerLeft, wmsLayerRight }) => {
  const map = useMap();
  const leftLayerRef = useRef(null);
  const rightLayerRef = useRef(null);
  const sideBySideRef = useRef(null);

  useEffect(() => {
    if (wmsLayerLeft && wmsLayerRight) {
      // Remove existing layers if any
      if (leftLayerRef.current) {
        map.removeLayer(leftLayerRef.current);
      }
      if (rightLayerRef.current) {
        map.removeLayer(rightLayerRef.current);
      }
      if (sideBySideRef.current) {
        sideBySideRef.current.remove();
      }

      // Correct BBOX order for WMS 1.3.0 and EPSG:4326
      const bboxLeft = [
        wmsLayerLeft.latitudeInicial,
        wmsLayerLeft.longitudeInicial,
        wmsLayerLeft.latitudeFinal,
        wmsLayerLeft.longitudeFinal,
      ];

      const bboxRight = [
        wmsLayerRight.latitudeInicial,
        wmsLayerRight.longitudeInicial,
        wmsLayerRight.latitudeFinal,
        wmsLayerRight.longitudeFinal,
      ];

      // Construct WMS URLs with corrected BBOX and width/height
      const wmsUrlLeft = `/cuborizonte/ows/?service=WMS&request=GetMap&layers=${wmsLayerLeft.product}&styles=&format=image/png&transparent=true&version=1.3.0&crs=EPSG:4326&bbox=${bboxLeft.join(',')}&width=512&height=512`;

      const wmsUrlRight = `/cuborizonte/ows/?service=WMS&request=GetMap&layers=${wmsLayerRight.product}&styles=&format=image/png&transparent=true&version=1.3.0&crs=EPSG:4326&bbox=${bboxRight.join(',')}&width=512&height=512`;

      // Create image overlays for both layers
      const leftLayer = L.imageOverlay(wmsUrlLeft, [
        [wmsLayerLeft.latitudeInicial, wmsLayerLeft.longitudeInicial],
        [wmsLayerLeft.latitudeFinal, wmsLayerLeft.longitudeFinal],
      ]);

      const rightLayer = L.imageOverlay(wmsUrlRight, [
        [wmsLayerRight.latitudeInicial, wmsLayerRight.longitudeInicial],
        [wmsLayerRight.latitudeFinal, wmsLayerRight.longitudeFinal],
      ]);

      leftLayerRef.current = leftLayer;
      rightLayerRef.current = rightLayer;

      // Add layers to the map
      leftLayer.addTo(map);
      rightLayer.addTo(map);

      // Initialize the Side by Side control
      const sideBySide = L.control.sideBySide(leftLayer, rightLayer).addTo(map);
      sideBySideRef.current = sideBySide;

      return () => {
        // Clean up on unmount
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
  viewMode,
  wmsData,
  wmsDataLeft,
  wmsDataRight,
  onBoundingBoxSelected,
  selectingPixel,
  onPixelSelected,
}) => {
  const mapRef = useRef();
  const featureGroupRef = useRef();

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

  const onCreated = (e) => {
    const layer = e.layer;

    // Remover camadas existentes no FeatureGroup
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers();
    }

    // Adicionar a nova camada ao FeatureGroup
    if (featureGroupRef.current) {
      featureGroupRef.current.addLayer(layer);
    }

    // Obter as coordenadas do retângulo
    const { _southWest, _northEast } = layer.getBounds();
    onBoundingBoxSelected({
      latitudeInicial: _southWest.lat,
      longitudeInicial: _southWest.lng,
      latitudeFinal: _northEast.lat,
      longitudeFinal: _northEast.lng,
    });
  };

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
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          onCreated={onCreated}
          draw={{
            rectangle: true,
            polyline: false,
            circle: false,
            circlemarker: false,
            polygon: false,
            marker: false,
          }}
          edit={{
            edit: false,
            remove: false,
          }}
        />
      </FeatureGroup>
      {viewMode === 'single' && wmsData && <SingleLayer wmsData={wmsData} />}
      {viewMode === 'comparison' && wmsDataLeft && wmsDataRight && (
        <SideBySideLayers wmsLayerLeft={wmsDataLeft} wmsLayerRight={wmsDataRight} />
      )}
    </MapContainer>
  );
};

export default MapComponent;
