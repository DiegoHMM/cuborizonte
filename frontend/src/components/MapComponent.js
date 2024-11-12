// MapComponent.js
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, useMap, useMapEvents } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-side-by-side';
import { getPixelValues } from '../services/api';

// Import the CSS for Side by Side if you have it
import '../styles/leaflet-side-by-side.css';

// Define the custom bounded tile layer
L.BoundedTileLayerWMS = L.TileLayer.WMS.extend({
  initialize: function (url, options) {
    L.TileLayer.WMS.prototype.initialize.call(this, url, options);
    if (options.bounds) {
      this._bounds = L.latLngBounds(options.bounds);
    }
  },

  getTileUrl: function (coords) {
    // Get the tile bounds
    const tileBounds = this._tileCoordsToBounds(coords);

    // Check if the tile bounds intersect the bounding box
    if (this._bounds && !this._bounds.overlaps(tileBounds)) {
      // Return a transparent tile to prevent loading
      return L.Util.emptyImageUrl;
    }

    // Call the original getTileUrl function
    return L.TileLayer.WMS.prototype.getTileUrl.call(this, coords);
  },
});

const SingleLayer = ({ wmsData }) => {
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

      const layer = new L.BoundedTileLayerWMS('/cuborizonte/ows/', {
        layers: wmsData.product,
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        crs: L.CRS.EPSG3857,
        bounds: bounds,
      });

      layerRef.current = layer;

      layer.addTo(map);

      return () => {
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
      if (leftLayerRef.current) {
        map.removeLayer(leftLayerRef.current);
      }
      if (rightLayerRef.current) {
        map.removeLayer(rightLayerRef.current);
      }
      if (sideBySideRef.current) {
        sideBySideRef.current.remove();
      }

      const boundsLeft = L.latLngBounds([
        [wmsLayerLeft.latitudeInicial, wmsLayerLeft.longitudeInicial],
        [wmsLayerLeft.latitudeFinal, wmsLayerLeft.longitudeFinal],
      ]);

      const boundsRight = L.latLngBounds([
        [wmsLayerRight.latitudeInicial, wmsLayerRight.longitudeInicial],
        [wmsLayerRight.latitudeFinal, wmsLayerRight.longitudeFinal],
      ]);

      const leftLayer = new L.BoundedTileLayerWMS('/cuborizonte/ows/', {
        layers: wmsLayerLeft.product,
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        crs: L.CRS.EPSG3857,
        bounds: boundsLeft,
      });

      const rightLayer = new L.BoundedTileLayerWMS('/cuborizonte/ows/', {
        layers: wmsLayerRight.product,
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        crs: L.CRS.EPSG3857,
        bounds: boundsRight,
      });

      leftLayerRef.current = leftLayer;
      rightLayerRef.current = rightLayer;

      leftLayer.addTo(map);
      rightLayer.addTo(map);

      const sideBySide = L.control.sideBySide(leftLayer, rightLayer).addTo(map);
      sideBySideRef.current = sideBySide;

      return () => {
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
        console.log('Clicked coordinates:', lat, lng);

        try {
          const data = await getPixelValues(lat, lng);
          console.log('Data returned from backend:', data);
          onPixelSelected(data);
        } catch (error) {
          console.error('Error making request:', error);
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

    // Clear existing layers in the FeatureGroup
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers();
    }

    // Add the new layer to the FeatureGroup
    if (featureGroupRef.current) {
      featureGroupRef.current.addLayer(layer);
    }

    // Get the coordinates of the rectangle
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
