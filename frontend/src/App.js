// App.js
import React, { useState, useEffect, useRef } from 'react';
import WMSForm from './components/WMSForm';
import MapComponent from './components/MapComponent';
import Header from './components/Header';
import PixelChart from './components/PixelChart';
import './styles/App.css';

function App() {
  // Bounding box desenhado ou selecionado
  const [boundingBox, setBoundingBox] = useState(null);

  // Modo de visualização: single ou comparison
  const [viewMode, setViewMode] = useState('single');

  // Dados para camada single
  const [wmsData, setWmsData] = useState(null);
  // Dados para camada comparison
  const [wmsDataLeft, setWmsDataLeft] = useState(null);
  const [wmsDataRight, setWmsDataRight] = useState(null);

  // Estados de seleção de pixel e retângulo (não alterados)
  const [selectingPixel, setSelectingPixel] = useState(false);
  const [pixelData, setPixelData] = useState(null);
  const [selectingRectangle, setSelectingRectangle] = useState(false);
  const [selectionMode, setSelectionMode] = useState('area');

  const mapComponentRef = useRef();

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

  // Essa função é chamada tanto na submissão inicial quanto via atualização imediata
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
        year: formData.year, // valor único para single
      };
      console.log("Configurando camada WMS (single):", wmsLayerData);
      setWmsData(wmsLayerData);
      setWmsDataLeft(null);
      setWmsDataRight(null);
    } else if (formData.viewMode === 'comparison') {
      // Para comparação, usamos yearLeft e yearRight (cada lado pode ser atualizado separadamente)
      const wmsLayerDataLeft = {
        layer: formData.layerLeft,
        latitudeInicial: parseFloat(formData.latitudeInicial),
        longitudeInicial: parseFloat(formData.longitudeInicial),
        latitudeFinal: parseFloat(formData.latitudeFinal),
        longitudeFinal: parseFloat(formData.longitudeFinal),
        year: formData.yearLeft, // valor para o lado esquerdo
      };

      const wmsLayerDataRight = {
        layer: formData.layerRight,
        latitudeInicial: parseFloat(formData.latitudeInicial),
        longitudeInicial: parseFloat(formData.longitudeInicial),
        latitudeFinal: parseFloat(formData.latitudeFinal),
        longitudeFinal: parseFloat(formData.longitudeFinal),
        year: formData.yearRight, // valor para o lado direito
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

      {/* O formulário recebe handleFormSubmit como onSubmit */}
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
