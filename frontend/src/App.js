// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import WMSForm from './components/WMSForm';
import MapComponent from './components/MapComponent';

function App() {
  const [boundingBox, setBoundingBox] = useState(null);
  const [wmsData, setWmsData] = useState(null);

  const handleBoundingBoxSelected = (bbox) => {
    setBoundingBox(bbox);
  };

  const handleFormSubmit = async (formData) => {
    // Atualizar o estado wmsData com as informações do formulário e do retângulo selecionado
    if (!boundingBox) {
      alert("Por favor, desenhe um retângulo no mapa antes de submeter o formulário.");
      return;
    }

    const wmsLayerData = {
      product: formData.layer,
      latitudeInicial: boundingBox.latitudeInicial,
      longitudeInicial: boundingBox.longitudeInicial,
      latitudeFinal: boundingBox.latitudeFinal,
      longitudeFinal: boundingBox.longitudeFinal,
      startDate: formData.startDate,
      endDate: formData.endDate
    };

    setWmsData(wmsLayerData);
  };

  return (
    <div>
      <h1>Mapa Interativo com Bounding Box e Requisições WMS</h1>
      <WMSForm onSubmit={handleFormSubmit} />
      <MapComponent onBoundingBoxSelected={handleBoundingBoxSelected} wmsLayer={wmsData} />
    </div>
  );
}

export default App;
