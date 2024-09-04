// src/App.js
import React, { useState } from 'react';
import axios from 'axios';  // Importar axios para fazer requisições HTTP
import WMSForm from './components/WMSForm';
import MapComponent from './components/MapComponent';

function App() {
  const [boundingBox, setBoundingBox] = useState(null);
  const [wmsData, setWmsData] = useState({});

  const handleBoundingBoxSelected = (bbox) => {
    setBoundingBox(bbox);
  };

  const handleFormSubmit = async (formData) => {
    setWmsData(formData);

    // Cria a query para enviar ao backend
    const query = {
      time: `${formData.startDate}/${formData.endDate}`,
      x: [formData.longitudeInicial, formData.longitudeFinal],
      y: [formData.latitudeInicial, formData.latitudeFinal],
      crs: 'EPSG:3857',
      resolution: [-30, 30],  // Ajuste a resolução conforme necessário
    };

    // Enviar a requisição para o backend FastAPI
    try {
      const response = await axios.post('http://localhost:8004/load_datacube', query);
      console.log('Dados recebidos do DataCube:', response.data);
      
      // Aqui você pode adicionar a lógica para exibir os dados no mapa
    } catch (error) {
      console.error('Erro ao carregar dados do DataCube:', error);
    }
  };

  return (
    <div>
      <h1>Mapa Interativo com Bounding Box e Requisições WMS</h1>
      <WMSForm boundingBox={boundingBox} onSubmit={handleFormSubmit} />
      <MapComponent onBoundingBoxSelected={handleBoundingBoxSelected} />
    </div>
  );
}

export default App;
