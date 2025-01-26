// App.js
import React, { useState, useEffect } from 'react';
import WMSForm from './components/WMSForm';
import MapComponent from './components/MapComponent';
import Header from './components/Header';
import PixelChart from './components/PixelChart';
import './styles/App.css';

function App() {
  // Bounding box desenhado no mapa ou selecionado via área
  const [boundingBox, setBoundingBox] = useState(null);

  // Modo de visualização: single ou comparison
  const [viewMode, setViewMode] = useState('single');

  // Dados de WMS para visualização única (objeto único)
  const [wmsData, setWmsData] = useState(null);

  // Dados de WMS para comparação lado a lado
  const [wmsDataLeft, setWmsDataLeft] = useState(null);
  const [wmsDataRight, setWmsDataRight] = useState(null);

  // Estado para selecionar um pixel no mapa
  const [selectingPixel, setSelectingPixel] = useState(false);
  const [pixelData, setPixelData] = useState(null);

  // Estado para selecionar um retângulo no mapa (Leaflet Draw)
  const [selectingRectangle, setSelectingRectangle] = useState(false);

  // Estado para controlar o modo de seleção: 'area' ou 'rectangle'
  const [selectionMode, setSelectionMode] = useState('area'); // 'area' ou 'rectangle'

  useEffect(() => {
    console.log("BoundingBox atualizado:", boundingBox);
  }, [boundingBox]);

  useEffect(() => {
    console.log("wmsData:", wmsData);
    console.log("wmsDataLeft:", wmsDataLeft);
    console.log("wmsDataRight:", wmsDataRight);
  }, [wmsData, wmsDataLeft, wmsDataRight]);

  // Chamado quando o retângulo é desenhado no mapa ou área é selecionada
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
    // Limpa dados de pixel se existirem
    if (pixelData) {
      setPixelData(null);
    }
  };

  // Chamado ao enviar o formulário
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
      };
      console.log("Configurando dados da camada WMS:", wmsLayerData);
      
      // Substitui camadas anteriores com a nova camada
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
      };

      const wmsLayerDataRight = {
        layer: formData.layerRight,
        latitudeInicial: parseFloat(formData.latitudeInicial),
        longitudeInicial: parseFloat(formData.longitudeInicial),
        latitudeFinal: parseFloat(formData.latitudeFinal),
        longitudeFinal: parseFloat(formData.longitudeFinal),
      };

      console.log("Configurando dados das camadas WMS:", wmsLayerDataLeft, wmsLayerDataRight);
      
      // Substitui camadas anteriores com as novas camadas de comparação
      setWmsData(null); // Limpa a camada single
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
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
        onBoundingBoxSelected={handleBoundingBoxSelected}
      />

      <div className="map-container">
        <MapComponent
          viewMode={viewMode}
          wmsData={wmsData}
          wmsDataLeft={wmsDataLeft}
          wmsDataRight={wmsDataRight}

          // Passamos o estado de seleção de retângulo e o modo de seleção
          selectingRectangle={selectingRectangle}
          setSelectingRectangle={setSelectingRectangle}
          selectionMode={selectionMode}
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
