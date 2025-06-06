import React, { useEffect, useState } from 'react';
import '../styles/WMSForm.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { get_products, get_all_areas } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import { BsBoundingBoxCircles } from 'react-icons/bs';

import ProductTimeline from './ProductTimeline'; 
import '../styles/ProductTimeline.css';

const WMSForm = ({
  boundingBox,
  onSubmit,
  onSelectPixel,
  selectingRectangle,
  setSelectingRectangle,
  selectionMode,
  setSelectionMode,
  onBoundingBoxSelected,
  onClearRectangle
}) => {
  // Aba principal: single ou comparison
  const [viewMode, setViewMode] = useState('single');

  // Estados para áreas (SINGLE e COMPARISON)
  const [areaTabSingle, setAreaTabSingle] = useState('bairros');
  const [areaTabCompar, setAreaTabCompar] = useState('bairros');

  // Estados gerais do formulário
  const [formData, setFormData] = useState({
    latitudeInicial: '',
    longitudeInicial: '',
    latitudeFinal: '',
    longitudeFinal: '',
    dataInicio: '',
    dataFim: ''
  });
  const [error] = useState(null);
  const [formError, setFormError] = useState('');
  const [coordinateError, setCoordinateError] = useState('');

  // Estados para áreas (SINGLE)
  const [bairrosSingle, setBairrosSingle] = useState([]);
  const [selectedBairroSingle, setSelectedBairroSingle] = useState(null);
  const [loadingBairroSingle, setLoadingBairroSingle] = useState(false);
  const [regioesSingle, setRegioesSingle] = useState([]);
  const [selectedRegiaoSingle, setSelectedRegiaoSingle] = useState(null);
  const [loadingRegiaoSingle, setLoadingRegiaoSingle] = useState(false);

  // Estados para áreas (COMPARISON)
  const [bairrosCompar, setBairrosCompar] = useState([]);
  const [selectedBairroCompar, setSelectedBairroCompar] = useState(null);
  const [loadingBairroCompar, setLoadingBairroCompar] = useState(false);
  const [regioesCompar, setRegioesCompar] = useState([]);
  const [selectedRegiaoCompar, setSelectedRegiaoCompar] = useState(null);
  const [loadingRegiaoCompar, setLoadingRegiaoCompar] = useState(false);

  // Estados para seleção de produto (SINGLE)
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [yearOptions, setYearOptions] = useState([]);
  const [showYearButtons, setShowYearButtons] = useState(false);

  // Estados para seleção de produto (COMPARISON)
  const [selectedProductLeft, setSelectedProductLeft] = useState(null);
  const [selectedProductRight, setSelectedProductRight] = useState(null);
  // Estados para ano em comparação
  const [leftYearOptions, setLeftYearOptions] = useState([]);
  const [rightYearOptions, setRightYearOptions] = useState([]);
  const [leftShowYearButtons, setLeftShowYearButtons] = useState(false);
  const [rightShowYearButtons, setRightShowYearButtons] = useState(false);
  const [leftSelectedYear, setLeftSelectedYear] = useState(null);
  const [rightSelectedYear, setRightSelectedYear] = useState(null);

  const clearForm = () => {
    setFormData({
      latitudeInicial: '',
      longitudeInicial: '',
      latitudeFinal: '',
      longitudeFinal: '',
      dataInicio: '',
      dataFim: ''
    });
    //setSelectedProduct(null);
    setSelectedProductLeft(null);
    setSelectedProductRight(null);
    setYearOptions([]);
    setShowYearButtons(false);
    setLeftYearOptions([]);
    setRightYearOptions([]);
    setLeftShowYearButtons(false);
    setRightShowYearButtons(false);
    setLeftSelectedYear(null);
    setRightSelectedYear(null);
    setFormError('');
    //setCoordinateError('');

    
  };

  // Carregar áreas para SINGLE
  useEffect(() => {
    const fetchBairrosSingle = async () => {
      setLoadingBairroSingle(true);
      try {
        const areas = await get_all_areas('bairro_popular');
        const options = areas
          .map((area) => ({ label: area.nome, value: area }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setBairrosSingle(options);
      } catch (e) {
        console.error('Erro ao carregar bairros (single):', e);
      } finally {
        setLoadingBairroSingle(false);
      }
    };

    const fetchRegioesSingle = async () => {
      setLoadingRegiaoSingle(true);
      try {
        const areas = await get_all_areas('regiao');
        const options = areas
          .map((area) => ({ label: area.nome, value: area }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setRegioesSingle(options);
      } catch (e) {
        console.error('Erro ao carregar regiões (single):', e);
      } finally {
        setLoadingRegiaoSingle(false);
      }
    };

    fetchBairrosSingle();
    fetchRegioesSingle();
  }, []);

  // Carregar áreas para COMPARISON
  useEffect(() => {
    const fetchBairrosCompar = async () => {
      setLoadingBairroCompar(true);
      try {
        const areas = await get_all_areas('bairro_popular');
        const options = areas
          .map((area) => ({ label: area.nome, value: area }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setBairrosCompar(options);
      } catch (e) {
        console.error('Erro ao carregar bairros (comparison):', e);
      } finally {
        setLoadingBairroCompar(false);
      }
    };

    const fetchRegioesCompar = async () => {
      setLoadingRegiaoCompar(true);
      try {
        const areas = await get_all_areas('regiao');
        const options = areas
          .map((area) => ({ label: area.nome, value: area }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setRegioesCompar(options);
      } catch (e) {
        console.error('Erro ao carregar regiões (comparison):', e);
      } finally {
        setLoadingRegiaoCompar(false);
      }
    };

    fetchBairrosCompar();
    fetchRegioesCompar();
  }, []);

  // Atualizar coordenadas ao desenhar retângulo
  useEffect(() => {
    if (boundingBox && selectionMode === 'rectangle') {
      setFormData((prevData) => ({
        ...prevData,
        latitudeInicial: boundingBox.latitudeInicial.toFixed(6),
        longitudeInicial: boundingBox.longitudeInicial.toFixed(6),
        latitudeFinal: boundingBox.latitudeFinal.toFixed(6),
        longitudeFinal: boundingBox.longitudeFinal.toFixed(6),
      }));
      setCoordinateError('');
    }
  }, [boundingBox, selectionMode]);

  // Carregar produtos (para ambos os modos)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await get_products();
        productsData.sort((a, b) =>
          (a.label || a.name).localeCompare(b.label || b.name)
        );
        setAvailableProducts(productsData);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Função de submissão do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setCoordinateError('');

    const { latitudeInicial, longitudeInicial, latitudeFinal, longitudeFinal } = formData;
    if (!latitudeInicial || !longitudeInicial || !latitudeFinal || !longitudeFinal) {
      setCoordinateError('Por favor, preencha todas as coordenadas ou selecione uma área.');
      return;
    }

    if (viewMode === 'single') {
      if (!selectedProduct) {
        alert('Por favor, selecione um produto.');
        return;
      }
      let years = selectedProduct.datetime.map(dateStr => new Date(dateStr).getFullYear());
      years = Array.from(new Set(years)).sort((a, b) => a - b);

      if (formData.dataInicio && formData.dataFim) {
        const startYear = new Date(formData.dataInicio).getFullYear();
        const endYear = new Date(formData.dataFim).getFullYear();
        years = years.filter(year => year >= startYear && year <= endYear);
      }
      if (years.length === 0) {
        setFormError('Nenhum ano disponível para o produto selecionado no intervalo de datas fornecido.');
        return;
      }
      setYearOptions(years);
      setShowYearButtons(true);
      return;
    }

    if (viewMode === 'comparison') {
      if (!selectedProductLeft || !selectedProductRight) {
        alert('Por favor, selecione os produtos para ambos os lados.');
        return;
      }
      let leftYears = selectedProductLeft.datetime.map(d => new Date(d).getFullYear());
      leftYears = Array.from(new Set(leftYears)).sort((a, b) => a - b);

      let rightYears = selectedProductRight.datetime.map(d => new Date(d).getFullYear());
      rightYears = Array.from(new Set(rightYears)).sort((a, b) => a - b);

      if (formData.dataInicio && formData.dataFim) {
        const startYear = new Date(formData.dataInicio).getFullYear();
        const endYear = new Date(formData.dataFim).getFullYear();
        leftYears = leftYears.filter(year => year >= startYear && year <= endYear);
        rightYears = rightYears.filter(year => year >= startYear && year <= endYear);
      }

      if (leftYears.length === 0 || rightYears.length === 0) {
        setFormError('Nenhum ano disponível para um dos produtos no intervalo de datas fornecido.');
        return;
      }
      setLeftYearOptions(leftYears);
      setRightYearOptions(rightYears);
      setLeftShowYearButtons(true);
      setRightShowYearButtons(true);
      return;
    }
  };

  // Handler para seleção de ano no modo single
  const handleYearSelection = (year) => {
    onSubmit({
      ...formData,
      viewMode,
      layer: selectedProduct.name,
      year: year,
    });
  };

  // Handler para seleção de ano em comparison para cada lado
  const handleComparisonYearChange = (side, year) => {
    if (side === 'left') {
      setLeftSelectedYear(year);
      if (year && rightSelectedYear) {
        onSubmit({
          ...formData,
          viewMode,
          layerLeft: selectedProductLeft.name,
          layerRight: selectedProductRight.name,
          yearLeft: year,
          yearRight: rightSelectedYear,
        });
      }
    } else if (side === 'right') {
      setRightSelectedYear(year);
      if (leftSelectedYear && year) {
        onSubmit({
          ...formData,
          viewMode,
          layerLeft: selectedProductLeft.name,
          layerRight: selectedProductRight.name,
          yearLeft: leftSelectedYear,
          yearRight: year,
        });
      }
    }
  };

  // Handlers de seleção de área (SINGLE)
  const handleSelectBairroSingle = (selectedOption) => {
    setYearOptions([]);
    setShowYearButtons(false);
    setFormError('');
    
    setSelectedBairroSingle(selectedOption);
    setSelectedRegiaoSingle(null);
    if (selectedOption) {
      const bbox = selectedOption.value.bounding_box;
      onClearRectangle();
      if (bbox) {
        const newBoundingBox = {
          latitudeInicial: bbox[1],
          longitudeInicial: bbox[0],
          latitudeFinal: bbox[3],
          longitudeFinal: bbox[2],
        };
        setFormData((prev) => ({
          ...prev,
          latitudeInicial: newBoundingBox.latitudeInicial.toFixed(6),
          longitudeInicial: newBoundingBox.longitudeInicial.toFixed(6),
          latitudeFinal: newBoundingBox.latitudeFinal.toFixed(6),
          longitudeFinal: newBoundingBox.longitudeFinal.toFixed(6),
        }));
        onBoundingBoxSelected(newBoundingBox);
      }
    } else {
      onClearRectangle();
      onBoundingBoxSelected(null);
      setFormData((prev) => ({
        ...prev,
        latitudeInicial: '',
        longitudeInicial: '',
        latitudeFinal: '',
        longitudeFinal: '',
      }));
    }
  };

  const handleSelectRegiaoSingle = (selectedOption) => {
    setSelectedRegiaoSingle(selectedOption);
    setSelectedBairroSingle(null);
    if (selectedOption) {
      const bbox = selectedOption.value.bounding_box;
      if (bbox) {
        const newBoundingBox = {
          latitudeInicial: bbox[1],
          longitudeInicial: bbox[0],
          latitudeFinal: bbox[3],
          longitudeFinal: bbox[2],
        };
        setFormData((prev) => ({
          ...prev,
          latitudeInicial: newBoundingBox.latitudeInicial.toFixed(6),
          longitudeInicial: newBoundingBox.longitudeInicial.toFixed(6),
          latitudeFinal: newBoundingBox.latitudeFinal.toFixed(6),
          longitudeFinal: newBoundingBox.longitudeFinal.toFixed(6),
        }));
        onBoundingBoxSelected(newBoundingBox);
      }
    } else {
      onClearRectangle();
      onBoundingBoxSelected(null);
      setFormData((prev) => ({
        ...prev,
        latitudeInicial: '',
        longitudeInicial: '',
        latitudeFinal: '',
        longitudeFinal: '',
      }));
    }
  };

  // Handlers de seleção de área (COMPARISON)
  const handleSelectBairroCompar = (option) => {
    setSelectedBairroCompar(option);
    setSelectedRegiaoCompar(null);
    if (option) {
      const bbox = option.value.bounding_box;
      if (bbox) {
        const newBoundingBox = {
          latitudeInicial: bbox[1],
          longitudeInicial: bbox[0],
          latitudeFinal: bbox[3],
          longitudeFinal: bbox[2],
        };
        setFormData((prev) => ({
          ...prev,
          latitudeInicial: newBoundingBox.latitudeInicial.toFixed(6),
          longitudeInicial: newBoundingBox.longitudeInicial.toFixed(6),
          latitudeFinal: newBoundingBox.latitudeFinal.toFixed(6),
          longitudeFinal: newBoundingBox.longitudeFinal.toFixed(6),
        }));
        onBoundingBoxSelected(newBoundingBox);
      }
    } else {
      onClearRectangle();
      onBoundingBoxSelected(null);
      setFormData((prev) => ({
        ...prev,
        latitudeInicial: '',
        longitudeInicial: '',
        latitudeFinal: '',
        longitudeFinal: '',
      }));
    }
  };

  const handleSelectRegiaoCompar = (option) => {
    setSelectedRegiaoCompar(option);
    setSelectedBairroCompar(null);
    if (option) {
      const bbox = option.value.bounding_box;
      if (bbox) {
        const newBoundingBox = {
          latitudeInicial: bbox[1],
          longitudeInicial: bbox[0],
          latitudeFinal: bbox[3],
          longitudeFinal: bbox[2],
        };
        setFormData((prev) => ({
          ...prev,
          latitudeInicial: newBoundingBox.latitudeInicial.toFixed(6),
          longitudeInicial: newBoundingBox.longitudeInicial.toFixed(6),
          latitudeFinal: newBoundingBox.latitudeFinal.toFixed(6),
          longitudeFinal: newBoundingBox.longitudeFinal.toFixed(6),
        }));
        onBoundingBoxSelected(newBoundingBox);
      }
    } else {
      onClearRectangle();
      onBoundingBoxSelected(null);
      setFormData((prev) => ({
        ...prev,
        latitudeInicial: '',
        longitudeInicial: '',
        latitudeFinal: '',
        longitudeFinal: '',
      }));
    }
  };

  // Renderização das sub-tabs para SINGLE
  const renderAreaSubTabSingle = () => {
    return (
      <div className="mt-3">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${areaTabSingle === 'bairros' ? 'active' : ''}`}
              onClick={() => {
                
                setAreaTabSingle('bairros');
                setSelectedBairroSingle(null);
                setSelectedRegiaoSingle(null);
                setFormData((prev) => ({
                  ...prev,
                  latitudeInicial: '',
                  longitudeInicial: '',
                  latitudeFinal: '',
                  longitudeFinal: '',
                }));
                onClearRectangle();
                onBoundingBoxSelected(null);
              }}
            >
              Bairros
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${areaTabSingle === 'regiao' ? 'active' : ''}`}
              onClick={() => {
                setAreaTabSingle('regiao');
                setSelectedBairroSingle(null);
                setSelectedRegiaoSingle(null);
                setFormData((prev) => ({
                  ...prev,
                  latitudeInicial: '',
                  longitudeInicial: '',
                  latitudeFinal: '',
                  longitudeFinal: '',
                }));
                onClearRectangle();
                onBoundingBoxSelected(null);
              }}
            >
              Região
            </button>
          </li>
        </ul>

        {areaTabSingle === 'bairros' && (
          <div className="d-flex align-items-end mt-3">
            <div className="flex-grow-1 me-2">
              <label>Buscar Bairro:</label>
              <Select
                styles={{ container: (base) => ({ ...base, width: '100%' }) }}
                options={bairrosSingle}
                value={selectedBairroSingle}
                onChange={handleSelectBairroSingle}
                isLoading={loadingBairroSingle}
                isClearable
                placeholder="Selecione o Bairro"
              />
            </div>
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => {
                clearForm();
                setSelectingRectangle(true);
                setSelectionMode('rectangle');
                setSelectedBairroSingle(null);
                setSelectedRegiaoSingle(null);
                onClearRectangle();
                setFormData((prev) => ({
                  ...prev,
                  latitudeInicial: '',
                  longitudeInicial: '',
                  latitudeFinal: '',
                  longitudeFinal: '',
                }));
                onBoundingBoxSelected(null);
              }}
            >
              <BsBoundingBoxCircles size={24} />
            </button>
          </div>
        )}

        {areaTabSingle === 'regiao' && (
          <div className="d-flex align-items-end mt-3">
            <div className="flex-grow-1 me-2">
              <label>Buscar Região:</label>
              <Select
                styles={{ container: (base) => ({ ...base, width: '100%' }) }}
                options={regioesSingle}
                value={selectedRegiaoSingle}
                onChange={handleSelectRegiaoSingle}
                isLoading={loadingRegiaoSingle}
                isClearable
                placeholder="Selecione a Região"
              />
            </div>
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => {
                setSelectingRectangle(true);
                setSelectionMode('rectangle');
                setSelectedBairroSingle(null);
                setSelectedRegiaoSingle(null);
                onClearRectangle();
                setFormData((prev) => ({
                  ...prev,
                  latitudeInicial: '',
                  longitudeInicial: '',
                  latitudeFinal: '',
                  longitudeFinal: '',
                }));
                onBoundingBoxSelected(null);
              }}
            >
              <BsBoundingBoxCircles size={24} />
            </button>
          </div>
        )}
      </div>
    );
  };

  // Renderização das sub-tabs para COMPARISON
  const renderAreaSubTabComparison = () => {
    return (
      <div className="mt-3">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${areaTabCompar === 'bairros' ? 'active' : ''}`}
              onClick={() => {
                setAreaTabCompar('bairros');
                setSelectedBairroCompar(null);
                setSelectedRegiaoCompar(null);
                setFormData((prev) => ({
                  ...prev,
                  latitudeInicial: '',
                  longitudeInicial: '',
                  latitudeFinal: '',
                  longitudeFinal: '',
                }));
                onClearRectangle();
                onBoundingBoxSelected(null);
              }}
            >
              Bairros
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${areaTabCompar === 'regiao' ? 'active' : ''}`}
              onClick={() => {
                setAreaTabCompar('regiao');
                setSelectedBairroCompar(null);
                setSelectedRegiaoCompar(null);
                setFormData((prev) => ({
                  ...prev,
                  latitudeInicial: '',
                  longitudeInicial: '',
                  latitudeFinal: '',
                  longitudeFinal: '',
                }));
                onClearRectangle();
                onBoundingBoxSelected(null);
              }}
            >
              Região
            </button>
          </li>
        </ul>

        {areaTabCompar === 'bairros' && (
          <div className="d-flex align-items-end mt-3">
            <div className="flex-grow-1 me-2">
              <label>Buscar Bairro:</label>
              <Select
                styles={{ container: (base) => ({ ...base, width: '100%' }) }}
                options={bairrosCompar}
                value={selectedBairroCompar}
                onChange={handleSelectBairroCompar}
                isLoading={loadingBairroCompar}
                isClearable
                placeholder="Selecione o Bairro"
              />
            </div>
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => {
                setSelectingRectangle(true);
                setSelectionMode('rectangle');
                setSelectedBairroCompar(null);
                setSelectedRegiaoCompar(null);
                onClearRectangle();
                setFormData((prev) => ({
                  ...prev,
                  latitudeInicial: '',
                  longitudeInicial: '',
                  latitudeFinal: '',
                  longitudeFinal: '',
                }));
                onBoundingBoxSelected(null);
              }}
            >
              <BsBoundingBoxCircles size={24} />
            </button>
          </div>
        )}

        {areaTabCompar === 'regiao' && (
          <div className="d-flex align-items-end mt-3">
            <div className="flex-grow-1 me-2">
              <label>Buscar Região:</label>
              <Select
                styles={{ container: (base) => ({ ...base, width: '100%' }) }}
                options={regioesCompar}
                value={selectedRegiaoCompar}
                onChange={handleSelectRegiaoCompar}
                isLoading={loadingRegiaoCompar}
                isClearable
                placeholder="Selecione a Região"
              />
            </div>
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => {
                setSelectingRectangle(true);
                setSelectionMode('rectangle');
                setSelectedBairroCompar(null);
                setSelectedRegiaoCompar(null);
                onClearRectangle();
                setFormData((prev) => ({
                  ...prev,
                  latitudeInicial: '',
                  longitudeInicial: '',
                  latitudeFinal: '',
                  longitudeFinal: '',
                }));
                onBoundingBoxSelected(null);
              }}
            >
              <BsBoundingBoxCircles size={24} />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    // Envolvemos o formulário e a timeline em um React.Fragment (<>)
    <>
      <form onSubmit={handleSubmit} className="floating-form form-group p-4">
        <h3>Seleção de Produtos</h3>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${viewMode === 'single' ? 'active' : ''}`}
              onClick={() => {
                setViewMode('single');
                setFormError('');
                setCoordinateError('');
                setSelectedProduct(null);
                setYearOptions([]);
                setShowYearButtons(false);
              }}
            >
              Single
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${viewMode === 'comparison' ? 'active' : ''}`}
              onClick={() => {
                setViewMode('comparison');
                setFormError('');
                setCoordinateError('');
                setSelectedProductLeft(null);
                setSelectedProductRight(null);
                setLeftYearOptions([]);
                setRightYearOptions([]);
                setLeftShowYearButtons(false);
                setRightShowYearButtons(false);
              }}
            >
              Comparativo
            </button>
          </li>
        </ul>

        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {formError && <div className="alert alert-warning mt-3">{formError}</div>}
        {coordinateError && <div className="alert alert-warning mt-3">{coordinateError}</div>}

        {viewMode === 'single' && (
          <>
            {renderAreaSubTabSingle()}

            <div className="row mt-4">
              <div className="col-md-6">
                <label>Data Início:</label>
                <input
                  type="date"
                  name="dataInicio"
                  className="form-control"
                  value={formData.dataInicio}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label>Data Fim:</label>
                <input
                  type="date"
                  name="dataFim"
                  className="form-control"
                  value={formData.dataFim}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group mt-3">
              <label>Produto:</label>
              <Select
                styles={{ container: (base) => ({ ...base, width: '100%' }) }}
                options={availableProducts.map((prod) => ({
                  value: prod,
                  label: prod.label || prod.name,
                }))}
                value={
                  selectedProduct
                    ? { value: selectedProduct, label: selectedProduct.label || selectedProduct.name }
                    : null
                }
                onChange={(option) => setSelectedProduct(option.value)}
                placeholder="Selecione o produto"
              />
            </div>
            
            {/* O BLOCO DE BOTÕES DE ANO FOI REMOVIDO DESTA ÁREA */}

            <div className="form-group mt-3">
              <label>Coordenadas Selecionadas:</label>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Latitude Inicial:</label>
                  <input
                    type="text"
                    name="latitudeInicial"
                    className="form-control"
                    value={formData.latitudeInicial}
                    onChange={handleChange}
                    placeholder="Preencha ou selecione"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Latitude Final:</label>
                  <input
                    type="text"
                    name="latitudeFinal"
                    className="form-control"
                    value={formData.latitudeFinal}
                    onChange={handleChange}
                    placeholder="Preencha ou selecione"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Longitude Inicial:</label>
                  <input
                    type="text"
                    name="longitudeInicial"
                    className="form-control"
                    value={formData.longitudeInicial}
                    onChange={handleChange}
                    placeholder="Preencha ou selecione"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Longitude Final:</label>
                  <input
                    type="text"
                    name="longitudeFinal"
                    className="form-control"
                    value={formData.longitudeFinal}
                    onChange={handleChange}
                    placeholder="Preencha ou selecione"
                  />
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6 mb-2">
                <button type="submit" className="btn btn-primary w-100">
                  Fazer Requisição
                </button>
              </div>
              <div className="col-md-6 mb-2">
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={onSelectPixel}
                >
                  Selecionar Ponto
                </button>
              </div>
            </div>
          </>
        )}

        {viewMode === 'comparison' && (
          <>
            {renderAreaSubTabComparison()}
            <div className="row mt-3">
              <div className="col-md-6">
                <label>Data Início:</label>
                <input
                  type="date"
                  name="dataInicio"
                  className="form-control"
                  value={formData.dataInicio}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label>Data Fim:</label>
                <input
                  type="date"
                  name="dataFim"
                  className="form-control"
                  value={formData.dataFim}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <label>Produto Esquerdo:</label>
                <Select
                  styles={{ container: (base) => ({ ...base, width: '100%' }) }}
                  options={availableProducts.map((prod) => ({
                    value: prod,
                    label: prod.label || prod.name,
                  }))}
                  value={
                    selectedProductLeft
                      ? {
                          value: selectedProductLeft,
                          label: selectedProductLeft.label || selectedProductLeft.name
                        }
                      : null
                  }
                  onChange={(option) => setSelectedProductLeft(option.value)}
                  placeholder="Produto 1"
                />
              </div>
              <div className="col-md-6">
                <label>Produto Direito:</label>
                <Select
                  styles={{ container: (base) => ({ ...base, width: '100%' }) }}
                  options={availableProducts.map((prod) => ({
                    value: prod,
                    label: prod.label || prod.name,
                  }))}
                  value={
                    selectedProductRight
                      ? {
                          value: selectedProductRight,
                          label: selectedProductRight.label || selectedProductRight.name
                        }
                      : null
                  }
                  onChange={(option) => setSelectedProductRight(option.value)}
                  placeholder="Produto 2"
                />
              </div>
            </div>
            
            {/* OS BLOCOS DE BOTÕES DE ANO FORAM REMOVIDOS DESTA ÁREA */}
            
            <div className="form-group mt-4">
              <label>Coordenadas Selecionadas:</label>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Latitude Inicial:</label>
                  <input
                    type="text"
                    name="latitudeInicial"
                    className="form-control"
                    value={formData.latitudeInicial}
                    onChange={handleChange}
                    placeholder="Preencha ou selecione"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Latitude Final:</label>
                  <input
                    type="text"
                    name="latitudeFinal"
                    className="form-control"
                    value={formData.latitudeFinal}
                    onChange={handleChange}
                    placeholder="Preencha ou selecione"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Longitude Inicial:</label>
                  <input
                    type="text"
                    name="longitudeInicial"
                    className="form-control"
                    value={formData.longitudeInicial}
                    onChange={handleChange}
                    placeholder="Preencha ou selecione"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Longitude Final:</label>
                  <input
                    type="text"
                    name="longitudeFinal"
                    className="form-control"
                    value={formData.longitudeFinal}
                    onChange={handleChange}
                    placeholder="Preencha ou selecione"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </form>

      {/* A nova lógica de renderização da timeline fica aqui, fora do formulário */}
      {viewMode === 'single' && showYearButtons && yearOptions.length > 0 && (
        <ProductTimeline
          years={yearOptions}
          selectedYear={formData.year}
          onYearSelect={handleYearSelection}
          title={selectedProduct?.label || selectedProduct?.name}
        />
      )}

      {viewMode === 'comparison' && (leftShowYearButtons || rightShowYearButtons) && (
        <div className="comparison-timelines-container">
          {leftShowYearButtons && leftYearOptions.length > 0 && (
            <ProductTimeline
              years={leftYearOptions}
              selectedYear={leftSelectedYear}
              onYearSelect={(year) => handleComparisonYearChange('left', year)}
              title={`Esquerda: ${selectedProductLeft?.label || selectedProductLeft?.name}`}
            />
          )}
          {rightShowYearButtons && rightYearOptions.length > 0 && (
            <ProductTimeline
              years={rightYearOptions}
              selectedYear={rightSelectedYear}
              onYearSelect={(year) => handleComparisonYearChange('right', year)}
              title={`Direita: ${selectedProductRight?.label || selectedProductRight?.name}`}
            />
          )}
        </div>
      )}
    </>
  );
};

export default WMSForm;
