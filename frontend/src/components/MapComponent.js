// MapComponent.js
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
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
    options = options || {};
    options.tileSize = options.tileSize || 512;
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
function useDrawRectangle(selectingRectangle, onBoundingBoxSelected, featureGroupRef, selectionMode, setSelectingRectangle) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    let rectangleDrawer;

    if (selectingRectangle && selectionMode === 'rectangle') {
      rectangleDrawer = new L.Draw.Rectangle(map, {
        shapeOptions: { color: '#0d6efd', weight: 4, fillColor: 'transparent', fillOpacity: 0},
      });
      rectangleDrawer.enable();

      const onCreated = (e) => {
        const layer = e.layer;
        if (featureGroupRef.current) {
          featureGroupRef.current.clearLayers();
          featureGroupRef.current.addLayer(layer);
        }
        const { _southWest, _northEast } = layer.getBounds();
        const newBoundingBox = {
          latitudeInicial: _southWest.lat,
          longitudeInicial: _southWest.lng,
          latitudeFinal: _northEast.lat,
          longitudeFinal: _northEast.lng,
        };
        onBoundingBoxSelected(newBoundingBox);
        setSelectingRectangle(false);
        map.off(L.Draw.Event.CREATED, onCreated);
      };

      map.on(L.Draw.Event.CREATED, onCreated);
    }

    return () => {
      if (rectangleDrawer) {
        rectangleDrawer.disable();
      }
      map.off(L.Draw.Event.CREATED);
    };
  }, [map, selectingRectangle, onBoundingBoxSelected, featureGroupRef, selectionMode, setSelectingRectangle]);
}

function DrawRectangleHandler({ selectingRectangle, onBoundingBoxSelected, featureGroupRef, selectionMode, setSelectingRectangle }) {
  useDrawRectangle(selectingRectangle, onBoundingBoxSelected, featureGroupRef, selectionMode, setSelectingRectangle);
  return null;
}

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

const SingleLayer = ({ wmsData, onLayerLoadingStart, onLayerLoadingEnd }) => {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    if (wmsData) {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }

      const bounds = L.latLngBounds([
        [wmsData.latitudeInicial, wmsData.longitudeInicial],
        [wmsData.latitudeFinal, wmsData.longitudeFinal],
      ]);

      const wmsOptions = {
        layers: wmsData.layer,
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        crs: L.CRS.EPSG3857,
        bounds: bounds,
        tileSize: 512,
      };

      if (wmsData.year) {
        wmsOptions.time = `${wmsData.year}-01-01/${wmsData.year}-12-31`;
      }

      const layer = new L.BoundedTileLayerWMS(baseWmsURL, wmsOptions);

      // quando a camada começar a carregar qualquer tile
      layer.on('loading', onLayerLoadingStart);
      // quando todos os tiles tiverem finalizado (sucesso ou erro)
      layer.on('load',    onLayerLoadingEnd);

      

      layerRef.current = layer;
      layer.addTo(map);

      map.fitBounds(bounds);

      return () => {
        layer.off('loading', onLayerLoadingStart);
        layer.off('load',    onLayerLoadingEnd);
        if (layerRef.current) {
          map.removeLayer(layerRef.current);
        }
      };
    }
  }, [map, wmsData, onLayerLoadingStart, onLayerLoadingEnd]);

  return null;
};



const SideBySideLayers = ({
  wmsLayerLeft,
  wmsLayerRight,
  onLayerLoadingStart,
  onLayerLoadingEnd,
}) => {
  const map = useMap();
  const leftLayerRef = useRef(null);
  const rightLayerRef = useRef(null);
  const sideBySideRef = useRef(null);

  useEffect(() => {
    // só executa quando temos ambos os dados
    if (!wmsLayerLeft || !wmsLayerRight) return;

    // limpa camadas antigas
    if (leftLayerRef.current)  map.removeLayer(leftLayerRef.current);
    if (rightLayerRef.current) map.removeLayer(rightLayerRef.current);
    if (sideBySideRef.current) sideBySideRef.current.remove();

    // cria bounds
    const boundsLeft = L.latLngBounds([
      [wmsLayerLeft.latitudeInicial,  wmsLayerLeft.longitudeInicial],
      [wmsLayerLeft.latitudeFinal,    wmsLayerLeft.longitudeFinal],
    ]);
    const boundsRight = L.latLngBounds([
      [wmsLayerRight.latitudeInicial, wmsLayerRight.longitudeInicial],
      [wmsLayerRight.latitudeFinal,   wmsLayerRight.longitudeFinal],
    ]);

    // opções WMS
    const leftOpts = {
      layers:     wmsLayerLeft.layer,
      format:     'image/png',
      transparent:true,
      version:    '1.3.0',
      crs:        L.CRS.EPSG3857,
      bounds:     boundsLeft,
      tileSize:   512,
      ...(wmsLayerLeft.year && {
        time: `${wmsLayerLeft.year}-01-01/${wmsLayerLeft.year}-12-31`
      }),
    };
    const rightOpts = {
      layers:     wmsLayerRight.layer,
      format:     'image/png',
      transparent:true,
      version:    '1.3.0',
      crs:        L.CRS.EPSG3857,
      bounds:     boundsRight,
      tileSize:   512,
      ...(wmsLayerRight.year && {
        time: `${wmsLayerRight.year}-01-01/${wmsLayerRight.year}-12-31`
      }),
    };

    // instancia os layers
    const leftLayer  = new L.BoundedTileLayerWMS(baseWmsURL, leftOpts);
    const rightLayer = new L.BoundedTileLayerWMS(baseWmsURL, rightOpts);

    // vincula após criar os layers
    [leftLayer, rightLayer].forEach(layer => {
      layer.on('loading', onLayerLoadingStart);
      layer.on('load',    onLayerLoadingEnd);
    });


    // adiciona ao mapa e side-by-side
    leftLayer.addTo(map);
    rightLayer.addTo(map);
    const ctl = L.control.sideBySide(leftLayer, rightLayer).addTo(map);

    // ajusta zoom
    const combined = boundsLeft.extend(boundsRight);
    map.fitBounds(combined);

    // guarda refs
    leftLayerRef.current    = leftLayer;
    rightLayerRef.current   = rightLayer;
    sideBySideRef.current   = ctl;

    // cleanup
    return () => {
      leftLayerRef.current?.off('loading', onLayerLoadingStart);
      leftLayerRef.current?.off('load',    onLayerLoadingEnd);
      if (leftLayerRef.current) map.removeLayer(leftLayerRef.current);

      rightLayerRef.current?.off('loading', onLayerLoadingStart);
      rightLayerRef.current?.off('load',    onLayerLoadingEnd);
      if (rightLayerRef.current) map.removeLayer(rightLayerRef.current);
      if (sideBySideRef.current) sideBySideRef.current.remove();
    };
  }, [
    map,
    wmsLayerLeft,
    wmsLayerRight,
    onLayerLoadingStart,
    onLayerLoadingEnd,
  ]);

  return null;
};



const MapComponent = forwardRef(({
  viewMode,
  wmsData,
  wmsDataLeft,
  wmsDataRight,
  onBoundingBoxSelected,
  selectingRectangle,
  setSelectingRectangle,
  selectionMode,
  selectingPixel,
  onPixelSelected,
  onMapClick,
  onLayerLoadingStart,
  onLayerLoadingEnd,
}, ref) => {
  const mapRef = useRef(null);
  const featureGroupRef = useRef(null);

  useImperativeHandle(ref, () => ({
    clearDrawnLayers() {
      if (featureGroupRef.current) {
        featureGroupRef.current.clearLayers();
      }
    },
  }));

  return (
    <MapContainer
      center={[-19.917299, -43.934559]}
      zoom={16}
      style={{ height: '100vh', width: '100%' }}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
      }}
    >
      <GeneralMapClickHandler 
        selectingPixel={selectingPixel} 
        onMapClick={onMapClick} 
      />

      <MapClickHandler 
        selectingPixel={selectingPixel} 
        onPixelSelected={onPixelSelected} 
      />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      
      <FeatureGroup ref={featureGroupRef} />

      <DrawRectangleHandler
        selectingRectangle={selectingRectangle}
        onBoundingBoxSelected={onBoundingBoxSelected}
        featureGroupRef={featureGroupRef}
        selectionMode={selectionMode}
        setSelectingRectangle={setSelectingRectangle}
      />

      {viewMode === 'single' && wmsData && (
        <SingleLayer
          wmsData={wmsData}
          onLayerLoadingStart={onLayerLoadingStart}
          onLayerLoadingEnd={onLayerLoadingEnd}
        />
      )}
      {viewMode === 'comparison' && wmsDataLeft && wmsDataRight && (
        <SideBySideLayers
          wmsLayerLeft={wmsDataLeft}
          wmsLayerRight={wmsDataRight}
          onLayerLoadingStart={onLayerLoadingStart}
          onLayerLoadingEnd={onLayerLoadingEnd}
        />
      )}
    </MapContainer>
  );
});

export default MapComponent;
