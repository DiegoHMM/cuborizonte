import React, { useEffect, useState } from 'react';
import '../styles/WMSForm.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import {
  get_products,
  get_all_areas
} from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';
import { BsBoundingBoxCircles } from 'react-icons/bs';

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
  // ----------------------------------
  // Tabs principais: single ou comparison
  // ----------------------------------
  const [viewMode, setViewMode] = useState('single'); 
  // Sub-tabs internos para a seleção de área: "bairros" ou "regiao"
  const [areaTabSingle, setAreaTabSingle] = useState('bairros');   // controla sub-tab dentro de SINGLE
  const [areaTabCompar, setAreaTabCompar] = useState('bairros');   // controla sub-tab dentro de COMPARISON

  // ----------------------------------
  // Estados gerais do formulário
  // ----------------------------------
  const [formData, setFormData] = useState({
    latitudeInicial: '',
    longitudeInicial: '',
    latitudeFinal: '',
    longitudeFinal: '',
    dataInicio: '',
    dataFim: '',
  });

  // Mensagens de erro
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState('');
  const [coordinateError, setCoordinateError] = useState('');

  // ----------------------------------------------------
  // Estados e Funções para modo SINGLE
  // ----------------------------------------------------
  const [productType, setProductType] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProducts, setShowProducts] = useState(false);

  // ----------------------------------------------------
  // Estados e Funções para modo COMPARISON
  // ----------------------------------------------------
  const [productTypeLeft, setProductTypeLeft] = useState('');
  const [productsLeft, setProductsLeft] = useState([]);
  const [selectedProductLeft, setSelectedProductLeft] = useState(null);

  const [productTypeRight, setProductTypeRight] = useState('');
  const [productsRight, setProductsRight] = useState([]);
  const [selectedProductRight, setSelectedProductRight] = useState(null);

  // ----------------------------------------------------
  // Estados para carregamento das áreas (single e compar.)
  // Precisamos separar, pois cada sub-tab pode ter uma tabela
  // ----------------------------------------------------
  // SINGLE - Bairros
  const [bairrosSingle, setBairrosSingle] = useState([]);
  const [selectedBairroSingle, setSelectedBairroSingle] = useState(null);
  const [loadingBairroSingle, setLoadingBairroSingle] = useState(false);

  // SINGLE - Regiao
  const [regioesSingle, setRegioesSingle] = useState([]);
  const [selectedRegiaoSingle, setSelectedRegiaoSingle] = useState(null);
  const [loadingRegiaoSingle, setLoadingRegiaoSingle] = useState(false);

  // COMPARISON - Bairros
  const [bairrosCompar, setBairrosCompar] = useState([]);
  const [selectedBairroCompar, setSelectedBairroCompar] = useState(null);
  const [loadingBairroCompar, setLoadingBairroCompar] = useState(false);

  // COMPARISON - Regiao
  const [regioesCompar, setRegioesCompar] = useState([]);
  const [selectedRegiaoCompar, setSelectedRegiaoCompar] = useState(null);
  const [loadingRegiaoCompar, setLoadingRegiaoCompar] = useState(false);

  // ----------------------------------------------------
  // useEffect para carregar Bairros e Regiao (SINGLE)
  // ----------------------------------------------------
  useEffect(() => {
    const fetchBairrosSingle = async () => {
      setLoadingBairroSingle(true);
      try {
        // busca da tabela "bairro_popular"
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
        // busca da tabela "regiao"
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

  // ----------------------------------------------------
  // useEffect para carregar Bairros e Regiao (COMPARISON)
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // Atualizar coordenadas ao desenhar retângulo
  // (válido para single ou comparison)
  // ----------------------------------------------------
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
      // Limpamos a seleção de bairros ou regiões (tanto single quanto compar)
      setSelectedBairroSingle(null);
      setSelectedRegiaoSingle(null);
      setSelectedBairroCompar(null);
      setSelectedRegiaoCompar(null);
    }
  }, [boundingBox, selectionMode]);

  // ----------------------------------------------------
  // Seleção de Bairros/Região (SINGLE)
  // ----------------------------------------------------
  const handleSelectBairroSingle = (selectedOption) => {
    setSelectedBairroSingle(selectedOption);
    setSelectedRegiaoSingle(null); // limpa a outra sub-tab
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
      // se desmarcar
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
    setSelectedBairroSingle(null); // limpa a outra sub-tab
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

  // ----------------------------------------------------
  // Seleção de Bairros/Região (COMPARISON)
  // ----------------------------------------------------
  const handleSelectBairroCompar = (selectedOption) => {
    setSelectedBairroCompar(selectedOption);
    setSelectedRegiaoCompar(null);
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

  const handleSelectRegiaoCompar = (selectedOption) => {
    setSelectedRegiaoCompar(selectedOption);
    setSelectedBairroCompar(null);
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

  // ----------------------------------------------------
  // Manipulação de datas e coordenadas
  // ----------------------------------------------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ----------------------------------------------------
  // Funções de carregamento de produtos
  // ----------------------------------------------------
  const filterByDate = (productsData) => {
    if (viewMode !== 'single') return productsData;
    const { dataInicio, dataFim } = formData;
    if (!dataInicio || !dataFim) return productsData;

    const start = new Date(dataInicio);
    const end = new Date(dataFim);
    return productsData.filter((product) => {
      const productDate = new Date(product.datetime);
      return productDate >= start && productDate <= end;
    });
  };

  const loadProducts = async (type, setProductsFunc) => {
    try {
      let productsData = [];
      if (type === 'Ortofoto') {
        productsData = await get_products('bh_ortophoto');
      } else if (type === 'Planta') {
        productsData = await get_products('bh_planta_');
      } else if (type === 'Classificados') {
        productsData = await get_products('bh_class');
      }
      productsData.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
      const filtered = filterByDate(productsData);
      setProductsFunc(filtered);
    } catch (error) {
      console.error('Erro ao obter produtos:', error);
    }
  };

  // ----------------------------------------------------
  // Handlers de tipo de produto (single)
  // ----------------------------------------------------
  const handleProductTypeChange = (e) => {
    const type = e.target.value;
    setProductType(type);
    setSelectedProduct(null);
    setProducts([]);
    setShowProducts(false);
  };

  // Handler de seleção de produto (single)
  const handleProductSelection = (product) => {
    setSelectedProduct(product);
    onSubmit({
      ...formData,
      viewMode,
      layer: product.name,
    });
  };

  // ----------------------------------------------------
  // Handlers de tipo de produto (comparison)
  // ----------------------------------------------------
  const handleProductTypeChangeLeft = (e) => {
    const type = e.target.value;
    setProductTypeLeft(type);
    setSelectedProductLeft(null);
    setProductsLeft([]);
    loadProducts(type, setProductsLeft);
  };

  const handleProductTypeChangeRight = (e) => {
    const type = e.target.value;
    setProductTypeRight(type);
    setSelectedProductRight(null);
    setProductsRight([]);
    loadProducts(type, setProductsRight);
  };

  // Handler de seleção de produto (comparison)
  const handleProductSelectionLeft = (product) => {
    setSelectedProductLeft(product);
    if (selectedProductRight) {
      onSubmit({
        ...formData,
        viewMode,
        layerLeft: product.name,
        layerRight: selectedProductRight.name,
      });
    }
  };

  const handleProductSelectionRight = (product) => {
    setSelectedProductRight(product);
    if (selectedProductLeft) {
      onSubmit({
        ...formData,
        viewMode,
        layerLeft: selectedProductLeft.name,
        layerRight: product.name,
      });
    }
  };

  // ----------------------------------------------------
  // Submissão do formulário
  // ----------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setCoordinateError('');

    // Checar coordenadas (para ambos os modos)
    const { latitudeInicial, longitudeInicial, latitudeFinal, longitudeFinal } = formData;
    if (!latitudeInicial || !longitudeInicial || !latitudeFinal || !longitudeFinal) {
      setCoordinateError('Por favor, preencha todas as coordenadas ou selecione uma área.');
      return;
    }

    if (viewMode === 'single') {
      // Garantir que tipo de produto foi selecionado
      if (!productType) {
        alert('Por favor, Selecione o tipo de produto.');
        return;
      }
      // Carregar produtos (vai mostrar a timeline para clicar no ano)
      loadProducts(productType, setProducts);
      setShowProducts(true);
      return;
    }

    if (viewMode === 'comparison') {
      if (!productTypeLeft || !productTypeRight) {
        alert('Por favor, selecione os tipos de produtos para comparação.');
        return;
      }
      // Carrega os produtos para comparação
      loadProducts(productTypeLeft, setProductsLeft);
      loadProducts(productTypeRight, setProductsRight);
      return;
    }
  };

  // ----------------------------------------------------
  // Alternar abas de exibição
  // ----------------------------------------------------
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    // limpar estados específicos
    setFormError('');
    setCoordinateError('');

    setProductType('');
    setProducts([]);
    setSelectedProduct(null);
    setShowProducts(false);

    setProductTypeLeft('');
    setProductsLeft([]);
    setSelectedProductLeft(null);

    setProductTypeRight('');
    setProductsRight([]);
    setSelectedProductRight(null);

    // Se trocar para comparison, limpa as datas
    if (mode === 'comparison') {
      setFormData((prev) => ({
        ...prev,
        dataInicio: '',
        dataFim: '',
      }));
    }
  };

  // Sub-tabs "bairros" ou "regiao" (SINGLE)
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
                // limpar seleção
                setSelectedBairroSingle(null);
                setSelectedRegiaoSingle(null);
                // limpar coords
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
                // limpar seleção
                setSelectedBairroSingle(null);
                setSelectedRegiaoSingle(null);
                // limpar coords
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

        {/* Área de Bairros (SINGLE) */}
        {areaTabSingle === 'bairros' && (
          <div className="mt-3">
            <label>Buscar Bairro:</label>
            <Select
              styles={{ container: (base) => ({ ...base, width: '100%' }) }}
              options={bairrosSingle}
              value={selectedBairroSingle}
              onChange={handleSelectBairroSingle}
              isLoading={loadingBairroSingle}
              isClearable
              placeholder="Selecione o Bairro..."
            />
          </div>
        )}

        {/* Área de Regiões (SINGLE) */}
        {areaTabSingle === 'regiao' && (
          <div className="mt-3">
            <label>Buscar Região:</label>
            <Select
              styles={{ container: (base) => ({ ...base, width: '100%' }) }}
              options={regioesSingle}
              value={selectedRegiaoSingle}
              onChange={handleSelectRegiaoSingle}
              isLoading={loadingRegiaoSingle}
              isClearable
              placeholder="Selecione a Região..."
            />
          </div>
        )}

        {/* Botão de Desenhar Retângulo */}
        <div className="mt-3 d-flex align-items-center">
          <button
            type="button"
            className="btn btn-outline-success d-flex align-items-center"
            onClick={() => {
              setSelectingRectangle(true);
              setSelectionMode('rectangle');
              // limpar seleções
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
            <BsBoundingBoxCircles size={24} className="me-2" />
            Desenhar Retângulo
          </button>
        </div>
      </div>
    );
  };

  // Sub-tabs "bairros" ou "regiao" (COMPARISON)
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
                // limpar seleção
                setSelectedBairroCompar(null);
                setSelectedRegiaoCompar(null);
                // limpar coords
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
                // limpar seleção
                setSelectedBairroCompar(null);
                setSelectedRegiaoCompar(null);
                // limpar coords
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

        {/* Área de Bairros (COMPARISON) */}
        {areaTabCompar === 'bairros' && (
          <div className="mt-3">
            <label>Buscar Bairro:</label>
            <Select
              styles={{ container: (base) => ({ ...base, width: '100%' }) }}
              options={bairrosCompar}
              value={selectedBairroCompar}
              onChange={handleSelectBairroCompar}
              isLoading={loadingBairroCompar}
              isClearable
              placeholder="Selecione o Bairro..."
            />
          </div>
        )}

        {/* Área de Regiões (COMPARISON) */}
        {areaTabCompar === 'regiao' && (
          <div className="mt-3">
            <label>Buscar Região:</label>
            <Select
              styles={{ container: (base) => ({ ...base, width: '100%' }) }}
              options={regioesCompar}
              value={selectedRegiaoCompar}
              onChange={handleSelectRegiaoCompar}
              isLoading={loadingRegiaoCompar}
              isClearable
              placeholder="Selecione a Região..."
            />
          </div>
        )}

        {/* Botão de Desenhar Retângulo */}
        <div className="mt-3 d-flex align-items-center">
          <button
            type="button"
            className="btn btn-outline-success d-flex align-items-center"
            onClick={() => {
              setSelectingRectangle(true);
              setSelectionMode('rectangle');
              // limpar seleções
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
            <BsBoundingBoxCircles size={24} className="me-2" />
            Desenhar Retângulo
          </button>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // Renderização Principal
  // ----------------------------------------------------
  return (
    <form onSubmit={handleSubmit} className="floating-form form-group p-4">
      <h3>Seleção de Produtos</h3>

      {/* Tabs principais: SINGLE x COMPARISON */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${viewMode === 'single' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('single')}
          >
            Single
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${viewMode === 'comparison' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('comparison')}
          >
            Comparison
          </button>
        </li>
      </ul>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {formError && <div className="alert alert-warning mt-3">{formError}</div>}
      {coordinateError && <div className="alert alert-warning mt-3">{coordinateError}</div>}

      {/* ----------------------------------------- */}
      {/* ABA SINGLE */}
      {/* ----------------------------------------- */}
      {viewMode === 'single' && (
        <>
          {/* Sub-tabs "bairros" ou "regiao" (SINGLE) */}
          {renderAreaSubTabSingle()}

          {/* Datas (exclusivo do modo single) */}
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

          {/* Tipo de Produto (single) */}
          <div className="form-group mt-3">
            <label>Tipo de Produto:</label>
            <select
              name="productType"
              className="form-control"
              value={productType}
              onChange={handleProductTypeChange}
            >
              <option value="">Selecione o tipo</option>
              <option value="Ortofoto">Ortofoto</option>
              <option value="Planta">Planta</option>
              <option value="Classificados">Classificados</option>
            </select>
          </div>

          {/* Exibir timeline de produtos (anos) */}
          {showProducts && products.length > 0 && (
            <div className="form-group mt-3">
              <label>Anos Disponíveis:</label>
              <div className="product-timeline">
                {products.map((prod) => (
                  <button
                    key={prod.name}
                    type="button"
                    className={
                      'btn btn-outline-primary me-2 mt-2 ' +
                      (selectedProduct && selectedProduct.name === prod.name ? 'active' : '')
                    }
                    onClick={() => handleProductSelection(prod)}
                  >
                    {new Date(prod.datetime).getFullYear()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Coordenadas */}
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

          {/* Botões de ação (Single) */}
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

      {/* ----------------------------------------- */}
      {/* ABA COMPARISON */}
      {/* ----------------------------------------- */}
      {viewMode === 'comparison' && (
        <>
          {/* Sub-tabs "bairros" ou "regiao" (COMPARISON) */}
          {renderAreaSubTabComparison()}

          {/* Seleção de Produtos (Esquerda / Direita) */}
          <div className="mt-4">
            <div className="d-flex">
              <div className="me-3" style={{ width: '50%' }}>
                <h5>Produto Esquerdo</h5>
                <select
                  name="productTypeLeft"
                  className="form-control"
                  value={productTypeLeft}
                  onChange={handleProductTypeChangeLeft}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="Ortofoto">Ortofoto</option>
                  <option value="Planta">Planta</option>
                  <option value="Classificados">Classificados</option>
                </select>
                {productsLeft.length > 0 && (
                  <div className="form-group mt-3">
                    <label>Anos Disponíveis:</label>
                    <div className="product-timeline">
                      {productsLeft.map((prod) => (
                        <button
                          key={prod.name}
                          type="button"
                          className={
                            'btn btn-outline-primary me-2 mt-2 ' +
                            (selectedProductLeft && selectedProductLeft.name === prod.name ? 'active' : '')
                          }
                          onClick={() => handleProductSelectionLeft(prod)}
                        >
                          {new Date(prod.datetime).getFullYear()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ width: '50%' }}>
                <h5>Produto Direito</h5>
                <select
                  name="productTypeRight"
                  className="form-control"
                  value={productTypeRight}
                  onChange={handleProductTypeChangeRight}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="Ortofoto">Ortofoto</option>
                  <option value="Planta">Planta</option>
                  <option value="Classificados">Classificados</option>
                </select>
                {productsRight.length > 0 && (
                  <div className="form-group mt-3">
                    <label>Anos Disponíveis:</label>
                    <div className="product-timeline">
                      {productsRight.map((prod) => (
                        <button
                          key={prod.name}
                          type="button"
                          className={
                            'btn btn-outline-primary me-2 mt-2 ' +
                            (selectedProductRight && selectedProductRight.name === prod.name ? 'active' : '')
                          }
                          onClick={() => handleProductSelectionRight(prod)}
                        >
                          {new Date(prod.datetime).getFullYear()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Coordenadas */}
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

          {/* Botão de ação (Comparison) */}
          <div className="mt-3">
            <button type="submit" className="btn btn-primary">
              Fazer Requisição
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default WMSForm;
