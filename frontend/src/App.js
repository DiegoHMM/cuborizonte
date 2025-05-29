// App.js
import React, { useState, useEffect, useRef } from 'react';
import WMSForm from './components/WMSForm';
import MapComponent from './components/MapComponent';
import Header from './components/Header';
import PixelChart from './components/PixelChart';
import './styles/App.css';

function App() {
  const [boundingBox, setBoundingBox] = useState(null);

  const [viewMode, setViewMode] = useState('single');

  const [wmsData, setWmsData] = useState(null);
  const [wmsDataLeft, setWmsDataLeft] = useState(null);
  const [wmsDataRight, setWmsDataRight] = useState(null);

  const [selectingPixel, setSelectingPixel] = useState(false);
  const [pixelData, setPixelData] = useState(null);
  const [selectingRectangle, setSelectingRectangle] = useState(false);
  const [selectionMode, setSelectionMode] = useState('area');

  const mapComponentRef = useRef();
  const abortControllersRef = useRef([]);

  const registerAbortController = (controller) => {
    abortControllersRef.current.push(controller);
    return () => {
      abortControllersRef.current = abortControllersRef.current.filter(c => c !== controller);
    };
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      abortControllersRef.current.forEach(controller => {
        if (controller && !controller.signal.aborted) {
          controller.abort();
          console.log('Requisições WMS canceladas ao sair da página');
        }
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, []);

  useEffect(() => {
    console.log("BoundingBox atualizado:", boundingBox);
  }, [boundingBox]);

  useEffect(() => {
    console.log("wmsData:", wmsData);
    console.log("wmsDataLeft:", wmsDataLeft);
    console.log("wmsDataRight:", wmsDataRight);
  }, [wmsData, wmsDataLeft, wmsDataRight]);

  const handleClearRectangle = () => {
    if (mapComponentRef.current) {
      mapComponentRef.current.clearDrawnLayers();
      setBoundingBox(null);
    }
  };

  const handleBoundingBoxSelected = (bbox) => {
    if (bbox) {
      console.log("Bounding box selecionada:", bbox);
      setBoundingBox(bbox);
    } else {
      console.log("Bounding box limpa.");
      setBoundingBox(null);
    }
  };

  const handleMapClick = () => {
    if (pixelData) setPixelData(null);
  };

  const handleFormSubmit = (formData) => {
    console.log("Dados do formulário recebidos:", formData);
    setViewMode(formData.viewMode);

    if (formData.viewMode === 'single') {
      const wmsLayerData = {
        layer: formData.layer,
        latitudeInicial: parseFloat(formData.latitudeInicial),
        longitudeInicial: parseFloat(formData.longitudeInicial),
        latitudeFinal: parseFloat(formData.latitudeFinal),
        longitudeFinal: parseFloat(formData.longitudeFinal),
        year: formData.year,
      };
      console.log("Configurando camada WMS (single):", wmsLayerData);
      setWmsData(wmsLayerData);
      setWmsDataLeft(null);
      setWmsDataRight(null);
    } else if (formData.viewMode === 'comparison') {
      const wmsLayerDataLeft = {
        layer: formData.layerLeft,
        latitudeInicial: parseFloat(formData.latitudeInicial),
        longitudeInicial: parseFloat(formData.longitudeInicial),
        latitudeFinal: parseFloat(formData.latitudeFinal),
        longitudeFinal: parseFloat(formData.longitudeFinal),
        year: formData.yearLeft,
      };

      const wmsLayerDataRight = {
        layer: formData.layerRight,
        latitudeInicial: parseFloat(formData.latitudeInicial),
        longitudeInicial: parseFloat(formData.longitudeInicial),
        latitudeFinal: parseFloat(formData.latitudeFinal),
        longitudeFinal: parseFloat(formData.longitudeFinal),
        year: formData.yearRight,
      };

      console.log("Configurando camadas WMS (comparison):", wmsLayerDataLeft, wmsLayerDataRight);
      setWmsData(null);
      setWmsDataLeft(wmsLayerDataLeft);
      setWmsDataRight(wmsLayerDataRight);
    }
  };

  const handleSelectPixel = () => {
    setSelectingPixel(true);
    setPixelData(null);
  };

  const handlePixelSelected = (data) => {
    setPixelData(data);
    setSelectingPixel(false);
  };

  return (
    <div>
      <Header />
      <WMSForm
        boundingBox={boundingBox}
        selectingRectangle={selectingRectangle}
        setSelectingRectangle={setSelectingRectangle}
        onSubmit={handleFormSubmit}
        onSelectPixel={handleSelectPixel}
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
        onBoundingBoxSelected={handleBoundingBoxSelected}
        onClearRectangle={handleClearRectangle}
      />

      <div className="map-container">
        <MapComponent
          ref={mapComponentRef}
          viewMode={viewMode}
          wmsData={wmsData}
          wmsDataLeft={wmsDataLeft}
          wmsDataRight={wmsDataRight}
          selectingRectangle={selectingRectangle}
          setSelectingRectangle={setSelectingRectangle}
          selectionMode={selectionMode}
          onBoundingBoxSelected={handleBoundingBoxSelected}
          selectingPixel={selectingPixel}
          onPixelSelected={handlePixelSelected}
          onMapClick={handleMapClick}
          registerAbortController={registerAbortController}
        />

        {pixelData && (
          <div className="chart-overlay">
            <PixelChart data={pixelData} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
