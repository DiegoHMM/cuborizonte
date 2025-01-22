// App.js
import React, { useState, useEffect } from 'react';
import WMSForm from './components/WMSForm';
import MapComponent from './components/MapComponent';
import Header from './components/Header';
import PixelChart from './components/PixelChart';
import './styles/App.css';

function App() {
  // Bounding box desenhado no mapa
  const [boundingBox, setBoundingBox] = useState(null);

  // Modo de visualização: single ou comparison
  const [viewMode, setViewMode] = useState('single');

  // Dados de WMS para visualização única (array para permitir futuras extensões)
  const [wmsData, setWmsData] = useState([]);

  // Dados de WMS para comparação lado a lado
  const [wmsDataLeft, setWmsDataLeft] = useState(null);
  const [wmsDataRight, setWmsDataRight] = useState(null);

  // Estado para selecionar um pixel no mapa
  const [selectingPixel, setSelectingPixel] = useState(false);
  const [pixelData, setPixelData] = useState(null);

  // Estado para selecionar um retângulo no mapa (Leaflet Draw)
  const [selectingRectangle, setSelectingRectangle] = useState(false);

  useEffect(() => {
    console.log("BoundingBox atualizado:", boundingBox);
  }, [boundingBox]);

  useEffect(() => {
    console.log("wmsData:", wmsData);
    console.log("wmsDataLeft:", wmsDataLeft);
    console.log("wmsDataRight:", wmsDataRight);
  }, [wmsData, wmsDataLeft, wmsDataRight]);

  // Chamado quando o retângulo é desenhado no mapa
  const handleBoundingBoxSelected = (bbox) => {
    console.log("Bounding box selecionada:", bbox);
    setBoundingBox(bbox);
    // Desativa o modo de desenho após seleção
    setSelectingRectangle(false);
  };

  const handleMapClick = () => {
    // Limpa dados de pixel se existirem
    if (pixelData) {
      setPixelData(null);
    }
  };

  // Chamado ao enviar o formulário
  const handleFormSubmit = (formData) => {
    if (!boundingBox) {
      alert("Por favor, desenhe um retângulo no mapa antes de submeter o formulário.");
      return;
    }

    console.log("Dados do formulário recebidos:", formData);
    setViewMode(formData.viewMode);

    if (formData.viewMode === 'single') {
      const wmsLayerData = {
        product: formData.layer,
        latitudeInicial: boundingBox.latitudeInicial,
        longitudeInicial: boundingBox.longitudeInicial,
        latitudeFinal: boundingBox.latitudeFinal,
        longitudeFinal: boundingBox.longitudeFinal,
      };
      console.log("Configurando dados da camada WMS:", wmsLayerData);
      
      // Substitui camadas anteriores com a nova camada
      setWmsData([wmsLayerData]);
      setWmsDataLeft(null);
      setWmsDataRight(null);
    } else if (formData.viewMode === 'comparison') {
      const wmsLayerDataLeft = {
        product: formData.layerLeft,
        latitudeInicial: boundingBox.latitudeInicial,
        longitudeInicial: boundingBox.longitudeInicial,
        latitudeFinal: boundingBox.latitudeFinal,
        longitudeFinal: boundingBox.longitudeFinal,
      };

      const wmsLayerDataRight = {
        product: formData.layerRight,
        latitudeInicial: boundingBox.latitudeInicial,
        longitudeInicial: boundingBox.longitudeInicial,
        latitudeFinal: boundingBox.latitudeFinal,
        longitudeFinal: boundingBox.longitudeFinal,
      };

      console.log("Configurando dados das camadas WMS:", wmsLayerDataLeft, wmsLayerDataRight);
      
      // Substitui camadas anteriores com as novas camadas de comparação
      setWmsData([]); // Limpa as camadas single
      setWmsDataLeft(wmsLayerDataLeft);
      setWmsDataRight(wmsLayerDataRight);
    }

    // Opcional: Resetar boundingBox após submissão
    // setBoundingBox(null);
  };

  // Chamado ao clicar em "Selecionar Ponto" no formulário
  const handleSelectPixel = () => {
    setSelectingPixel(true);
    setPixelData(null);
  };

  // Chamado quando um pixel é clicado no mapa
  const handlePixelSelected = (data) => {
    setPixelData(data);
    setSelectingPixel(false);
  };

  return (
    <div>
      <Header />

      {/* Formulário que controla as requisições WMS */}
      <WMSForm
        boundingBox={boundingBox}
        selectingRectangle={selectingRectangle}
        setSelectingRectangle={setSelectingRectangle}
        onSubmit={handleFormSubmit}
        onSelectPixel={handleSelectPixel}
      />

      <div className="map-container">
        <MapComponent
          viewMode={viewMode}
          wmsData={wmsData}
          wmsDataLeft={wmsDataLeft}
          wmsDataRight={wmsDataRight}

          // Passamos o estado de seleção de retângulo
          selectingRectangle={selectingRectangle}
          onBoundingBoxSelected={handleBoundingBoxSelected}

          // Passamos o estado de seleção de pixel
          selectingPixel={selectingPixel}
          onPixelSelected={handlePixelSelected}

          // Clique geral no mapa
          onMapClick={handleMapClick}
        />

        {/* Se houver dados de pixel, mostra um chart ou algo do tipo */}
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
