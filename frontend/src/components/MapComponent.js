import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw/dist/leaflet.draw.js';
import 'leaflet-side-by-side';
import { getPixelValues } from '../services/api';
import '../styles/leaflet-side-by-side.css';

const baseWmsURL = process.env.REACT_APP_WMS_BASE_URL || '/ows/'; 

// ----------- EXTENSÃO PERSONALIZADA DO TILELAYER -----------
L.BoundedTileLayerWMS = L.TileLayer.WMS.extend({
  initialize: function (url, options) {
    L.TileLayer.WMS.prototype.initialize.call(this, url, options);
    if (options.bounds) {
      this._bounds = L.latLngBounds(options.bounds);
    }
  },
  getTileUrl: function (coords) {
    const tileBounds = this._tileCoordsToBounds(coords);
    if (this._bounds && !this._bounds.overlaps(tileBounds)) {
      return L.Util.emptyImageUrl;
    }
    return L.TileLayer.WMS.prototype.getTileUrl.call(this, coords);
  },
});

// ----------- HOOK DE DESENHO DE RETÂNGULO -----------
function useDrawRectangle(selectingRectangle, onBoundingBoxSelected, featureGroupRef) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    let rectangleDrawer;

    if (selectingRectangle) {
      // Criar e ativar o modo de desenho de retângulo
      rectangleDrawer = new L.Draw.Rectangle(map, {
        // Opções para o retângulo, se necessário
        shapeOptions: { color: '#f357a1', weight: 4 },
      });
      rectangleDrawer.enable();

      // Escuta evento de desenho finalizado
      map.on(L.Draw.Event.CREATED, (e) => {
        const layer = e.layer;
        // Limpa retângulos anteriores e adiciona o novo ao FeatureGroup
        if (featureGroupRef.current) {
          featureGroupRef.current.clearLayers();
          featureGroupRef.current.addLayer(layer);
        }
        // Captura bounding box
        const { _southWest, _northEast } = layer.getBounds();
        onBoundingBoxSelected({
          latitudeInicial: _southWest.lat,
          longitudeInicial: _southWest.lng,
          latitudeFinal: _northEast.lat,
          longitudeFinal: _northEast.lng,
        });
      });
    }

    // Cleanup: desativa o modo de desenho e remove listener
    return () => {
      if (rectangleDrawer) {
        rectangleDrawer.disable();
      }
      map.off(L.Draw.Event.CREATED);
    };
  }, [map, selectingRectangle, onBoundingBoxSelected, featureGroupRef]);
}


// ----------- COMPONENTE-FILHO QUE CHAMA useDrawRectangle -----------
function DrawRectangleHandler({ selectingRectangle, onBoundingBoxSelected, featureGroupRef }) {
  useDrawRectangle(selectingRectangle, onBoundingBoxSelected, featureGroupRef);
  return null; // não renderiza nada
}

// ----------- HANDLERS DE CLIQUE NO MAPA -----------
const GeneralMapClickHandler = ({ selectingPixel, onMapClick }) => {
  useMapEvents({
    click: () => {
      if (!selectingPixel) {
        onMapClick();
      }
    },
  });
  return null;
};

const MapClickHandler = ({ selectingPixel, onPixelSelected }) => {
  useMapEvents({
    click: async (e) => {
      if (selectingPixel) {
        const { lat, lng } = e.latlng;
        try {
          const data = await getPixelValues(lat, lng);
          onPixelSelected(data);
        } catch (error) {
          console.error('Erro na requisição de pixel:', error);
        }
      }
    },
  });
  return null;
};

// ----------- CAMADA SIMPLES DE WMS -----------
const SingleLayer = ({ wmsData }) => {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    if (wmsData) {
      // Remove camada anterior (se existir)
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }

      // Define bounds do layer
      const bounds = L.latLngBounds([
        [wmsData.latitudeInicial, wmsData.longitudeInicial],
        [wmsData.latitudeFinal, wmsData.longitudeFinal],
      ]);

      // Cria a camada WMS
      const layer = new L.BoundedTileLayerWMS(baseWmsURL, {
        layers: wmsData.product,
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        crs: L.CRS.EPSG3857,
        bounds: bounds,
      });

      layerRef.current = layer;
      layer.addTo(map);

      // Cleanup ao remover o componente
      return () => {
        if (layerRef.current) {
          map.removeLayer(layerRef.current);
        }
      };
    }
  }, [map, wmsData]);

  return null;
};

// ----------- CAMADAS COMPARADAS LADO A LADO -----------
const SideBySideLayers = ({ wmsLayerLeft, wmsLayerRight }) => {
  const map = useMap();
  const leftLayerRef = useRef(null);
  const rightLayerRef = useRef(null);
  const sideBySideRef = useRef(null);

  useEffect(() => {
    if (wmsLayerLeft && wmsLayerRight) {
      // Remove se já existirem
      if (leftLayerRef.current) map.removeLayer(leftLayerRef.current);
      if (rightLayerRef.current) map.removeLayer(rightLayerRef.current);
      if (sideBySideRef.current) sideBySideRef.current.remove();

      // Bounds de cada camada
      const boundsLeft = L.latLngBounds([
        [wmsLayerLeft.latitudeInicial, wmsLayerLeft.longitudeInicial],
        [wmsLayerLeft.latitudeFinal, wmsLayerLeft.longitudeFinal],
      ]);
      const boundsRight = L.latLngBounds([
        [wmsLayerRight.latitudeInicial, wmsLayerRight.longitudeInicial],
        [wmsLayerRight.latitudeFinal, wmsLayerRight.longitudeFinal],
      ]);

      // Cria camadas WMS
      const leftLayer = new L.BoundedTileLayerWMS(baseWmsURL, {
        layers: wmsLayerLeft.product,
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        crs: L.CRS.EPSG3857,
        bounds: boundsLeft,
      });
      const rightLayer = new L.BoundedTileLayerWMS(baseWmsURL, {
        layers: wmsLayerRight.product,
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        crs: L.CRS.EPSG3857,
        bounds: boundsRight,
      });

      leftLayerRef.current = leftLayer;
      rightLayerRef.current = rightLayer;

      // Adiciona as camadas ao mapa
      leftLayer.addTo(map);
      rightLayer.addTo(map);

      // Cria controle side-by-side
      const sideBySide = L.control.sideBySide(leftLayer, rightLayer).addTo(map);
      sideBySideRef.current = sideBySide;

      // Cleanup
      return () => {
        if (leftLayerRef.current) map.removeLayer(leftLayerRef.current);
        if (rightLayerRef.current) map.removeLayer(rightLayerRef.current);
        if (sideBySideRef.current) sideBySideRef.current.remove();
      };
    }
  }, [map, wmsLayerLeft, wmsLayerRight]);

  return null;
};

// ----------- COMPONENTE PRINCIPAL -----------
const MapComponent = ({
  viewMode,
  wmsData,
  wmsDataLeft,
  wmsDataRight,
  onBoundingBoxSelected,
  selectingRectangle,
  selectingPixel,
  onPixelSelected,
  onMapClick,
}) => {
  const mapRef = useRef(null);
  const featureGroupRef = useRef(null);

  return (
    <MapContainer
      center={[-19.917299, -43.934559]}
      zoom={16}
      style={{ height: '100vh', width: '100%' }}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
      }}
    >
      {/* Se não estiver selecionando pixel, clique no mapa chama onMapClick */}
      <GeneralMapClickHandler 
        selectingPixel={selectingPixel} 
        onMapClick={onMapClick} 
      />

      {/* Se estiver selecionando pixel, clique no mapa busca valor do pixel */}
      <MapClickHandler 
        selectingPixel={selectingPixel} 
        onPixelSelected={onPixelSelected} 
      />

      {/* Camada base OSM */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      
      {/* FeatureGroup que conterá o retângulo desenhado */}
      <FeatureGroup ref={featureGroupRef} />

      {/* Ativa/desativa o controle de desenhar retângulo */}
      <DrawRectangleHandler
        selectingRectangle={selectingRectangle}
        onBoundingBoxSelected={onBoundingBoxSelected}
        featureGroupRef={featureGroupRef}
      />

      {/* Renderização das camadas WMS (single ou comparison) */}
      {viewMode === 'single' && wmsData && (
        <SingleLayer wmsData={wmsData} />
      )}
      {viewMode === 'comparison' && wmsDataLeft && wmsDataRight && (
        <SideBySideLayers
          wmsLayerLeft={wmsDataLeft}
          wmsLayerRight={wmsDataRight}
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;
