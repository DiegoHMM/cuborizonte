import React, { useState, useEffect } from 'react';
import WMSForm from './components/WMSForm';
import MapComponent from './components/MapComponent';

function App() {
  const [boundingBox, setBoundingBox] = useState(null);
  const [wmsData, setWmsData] = useState(null);

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
    setWmsData({ ...wmsLayerData });  // Atualiza o estado com os novos dados da camada WMS
    resetBoundingBox();
  };
  
  const resetBoundingBox = () => {
    console.log("Resetando boundingBox");
    setBoundingBox(null);  // Permite ao usuário desenhar uma nova bounding box
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
