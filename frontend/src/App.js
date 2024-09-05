// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import WMSForm from './components/WMSForm';
import MapComponent from './components/MapComponent';

function App() {
  const [boundingBox, setBoundingBox] = useState(null);
  const [wmsData, setWmsData] = useState(null);

  // Dentro do App.js
  const handleBoundingBoxSelected = (bbox) => {
    console.log("Bounding box selecionada:", bbox); // Adicione este log
    setBoundingBox(bbox);
  };


  const handleFormSubmit = async (formData) => {
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
    resetBoundingBox();
  };
  
  const resetBoundingBox = () => {
    setBoundingBox(null); // Isso permitirá ao usuário desenhar uma nova bounding box
  };
  

  return (
    <div>
      <h1>Mapa Interativo com Bounding Box e Requisições WMS</h1>
      <WMSForm boundingBox={boundingBox} onSubmit={handleFormSubmit} />
      <MapComponent onBoundingBoxSelected={handleBoundingBoxSelected} wmsLayer={wmsData} />
    </div>
  );
}

export default App;
