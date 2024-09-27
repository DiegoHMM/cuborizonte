// App.js
import React, { useState, useEffect } from 'react';
import WMSForm from './components/WMSForm';
import MapComponent from './components/MapComponent';
import Header from './components/Header';
import PixelChart from './components/PixelChart';
import './styles/App.css';

function App() {
  const [boundingBox, setBoundingBox] = useState(null);
  const [wmsData, setWmsData] = useState(null);
  const [selectingPixel, setSelectingPixel] = useState(false);
  const [pixelData, setPixelData] = useState(null);

  useEffect(() => {
    console.log("Atualização do estado boundingBox:", boundingBox);
  }, [boundingBox]);

  useEffect(() => {
    console.log("Atualização do estado wmsData:", wmsData);
  }, [wmsData]);

  const handleBoundingBoxSelected = (bbox) => {
    console.log("Bounding box selecionada:", bbox);
    setBoundingBox(bbox);
  };

  const handleFormSubmit = async (formData) => {
    if (!boundingBox) {
      alert("Por favor, desenhe um retângulo no mapa antes de submeter o formulário.");
      return;
    }

    console.log("Dados do formulário recebidos:", formData);
    const wmsLayerData = {
      product: formData.layer,
      latitudeInicial: boundingBox.latitudeInicial,
      longitudeInicial: boundingBox.longitudeInicial,
      latitudeFinal: boundingBox.latitudeFinal,
      longitudeFinal: boundingBox.longitudeFinal,
      startDate: formData.startDate,
      endDate: formData.endDate
    };

    console.log("Configurando dados da camada WMS:", wmsLayerData);
    setWmsData({ ...wmsLayerData });
    resetBoundingBox();
  };

  const resetBoundingBox = () => {
    console.log("Resetando boundingBox");
    setBoundingBox(null);
  };

  const handleSelectPixel = () => {
    setSelectingPixel(true);
    setPixelData(null); // Resetar dados anteriores
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
        onSubmit={handleFormSubmit}
        onSelectPixel={handleSelectPixel}
      />
      <div className="map-container">
        <MapComponent
          onBoundingBoxSelected={handleBoundingBoxSelected}
          wmsLayer={wmsData}
          selectingPixel={selectingPixel}
          onPixelSelected={handlePixelSelected}
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
