// WMSForm.js
import React, { useEffect, useState } from 'react';
import '../styles/WMSForm.css'; 
import 'leaflet-draw/dist/leaflet.draw.css';
import { get_ortho_products, get_plan_products, get_classified_products } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const WMSForm = ({
  boundingBox,
  onSubmit,
  onSelectPixel,
  selectingRectangle,
  setSelectingRectangle,
}) => {
  const [viewMode, setViewMode] = useState('single'); // "single" ou "comparison"

  // Estados de produtos
  const [productType, setProductType] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProducts, setShowProducts] = useState(false);

  // Estados de produtos (esquerda/direita) para comparação
  const [productTypeLeft, setProductTypeLeft] = useState('');
  const [productsLeft, setProductsLeft] = useState([]);
  const [selectedProductLeft, setSelectedProductLeft] = useState(null);

  const [productTypeRight, setProductTypeRight] = useState('');
  const [productsRight, setProductsRight] = useState([]);
  const [selectedProductRight, setSelectedProductRight] = useState(null);

  // Dados do formulário (datas, etc.)
  const [formData, setFormData] = useState({
    latitudeInicial: '',
    longitudeInicial: '',
    latitudeFinal: '',
    longitudeFinal: '',
    dataInicio: '',
    dataFim: '',
  });

  // Quando boundingBox muda, atualizar os campos
  useEffect(() => {
    if (boundingBox) {
      console.log("Atualizando formulário com:", boundingBox);
      setFormData(prevData => ({
        ...prevData,
        latitudeInicial: boundingBox.latitudeInicial.toFixed(6),
        longitudeInicial: boundingBox.longitudeInicial.toFixed(6),
        latitudeFinal: boundingBox.latitudeFinal.toFixed(6),
        longitudeFinal: boundingBox.longitudeFinal.toFixed(6),
      }));
    }
  }, [boundingBox]);

  // Filtrar lista de produtos pela data
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

  // Carrega lista de produtos (Ortofoto, Planta, Classificados)
  const loadProducts = async (type, setProductsFunc) => {
    try {
      let productsData = [];
      if (type === 'Ortofoto') {
        productsData = await get_ortho_products();
      } else if (type === 'Planta') {
        productsData = await get_plan_products();
      } else if (type === 'Classificados') {
        productsData = await get_classified_products();
      }
      // Ordena por data (crescente)
      productsData.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

      // Filtra pelo período
      const filteredProducts = filterByDate(productsData);
      setProductsFunc(filteredProducts);
    } catch (error) {
      console.error('Erro ao obter os produtos:', error);
    }
  };

  // Handlers para mudança no "tipo de produto"
  const handleProductTypeChange = (e) => {
    const type = e.target.value;
    setProductType(type);
    setSelectedProduct(null);
    setProducts([]);
    setShowProducts(false); // Esconde produtos ao mudar o tipo
  };

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

  // Handlers para seleção de um produto da lista
  const handleProductSelection = (product) => {
    setSelectedProduct(product);
    // Chama onSubmit imediatamente ao clicar em um produto
    onSubmit({
      ...formData,
      viewMode,
      layer: product.name,
    });
  };
  const handleProductSelectionLeft = (product) => {
    setSelectedProductLeft(product);
    // Verifica se já há um produto selecionado à direita
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
    // Verifica se já há um produto selecionado à esquerda
    if (selectedProductLeft) {
      onSubmit({
        ...formData,
        viewMode,
        layerLeft: selectedProductLeft.name,
        layerRight: product.name,
      });
    }
  };

  // Submissão do formulário
  const handleSubmit = (e) => {
    e.preventDefault();

    if (viewMode === 'single') {
      if (!productType) {
        alert('Por favor, selecione um tipo de produto.');
        return;
      }
      // Carrega os produtos ao clicar em "Fazer Requisição"
      loadProducts(productType, setProducts);
      setShowProducts(true); // Exibe os botões de produtos
    } else if (viewMode === 'comparison') {
      if (!productTypeLeft || !productTypeRight) {
        alert('Por favor, selecione os tipos de produtos para comparação.');
        return;
      }
      // Carrega os produtos para comparação
      loadProducts(productTypeLeft, setProductsLeft);
      loadProducts(productTypeRight, setProductsRight);
      // Opcional: pode exibir uma indicação de que as camadas serão adicionadas ao selecionar
    }
  };

  // Handler genérico para inputs (datas e coords)
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Alternar entre single e comparison
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    // Resetar estados de seleção
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
    if (mode === 'comparison') {
      setFormData(prevData => ({
        ...prevData,
        dataInicio: '',
        dataFim: '',
      }));
  }
  };

  return (
    <form onSubmit={handleSubmit} className="floating-form form-group">
      <h3>Seleção de Produtos</h3>

      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${viewMode === 'single' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('single')}
            type="button"
          >
            Seleção de Produto
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${viewMode === 'comparison' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('comparison')}
            type="button"
          >
            Comparação
          </button>
        </li>
      </ul>

      {showProducts && products.length > 0 && viewMode === 'single' && (
        <div className="form-group mt-3">
          <label>Produtos:</label>
          <div className="product-timeline">
            {products.map(product => (
              <button
                key={product.name}
                type="button"
                className={
                  "btn btn-outline-primary me-2 mt-2 " +
                  (selectedProduct && selectedProduct.name === product.name ? 'active' : '')
                }
                onClick={() => handleProductSelection(product)}
              >
                {new Date(product.datetime).getFullYear()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Seção SINGLE */}
      {viewMode === 'single' && (
        <div className="product-single mt-3">
          <div className="form-group">
            <label>Tipo de Produto:</label>
            <select
              name="productType"
              className="form-control"
              value={productType}
              onChange={handleProductTypeChange}
            >
              <option value="">Selecione um tipo de produto</option>
              <option value="Ortofoto">Ortofoto</option>
              <option value="Planta">Planta</option>
              <option value="Classificados">Classificados</option>
            </select>
          </div>
        </div>
      )}

      {/* Renderizar campos de Data apenas no modo 'single' */}
      {viewMode === 'single' && (
        <>
          <div className="form-group mt-3">
            <label>Data Início:</label>
            <input
              type="date"
              name="dataInicio"
              className="form-control"
              value={formData.dataInicio}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mt-3">
            <label>Data Fim:</label>
            <input
              type="date"
              name="dataFim"
              className="form-control"
              value={formData.dataFim}
              onChange={handleChange}
            />
          </div>
        </>
      )}

      

      {/* Seção COMPARISON */}
      {viewMode === 'comparison' && (
        <div className="product-comparison mt-3">
          <div className="product-selection d-flex">
            {/* Esquerda */}
            <div className="product-left me-3">
              <h4>Produto Esquerdo</h4>
              <div className="form-group mt-3">
                <label>Tipo de Produto:</label>
                <select
                  name="productTypeLeft"
                  className="form-control"
                  value={productTypeLeft}
                  onChange={handleProductTypeChangeLeft}
                >
                  <option value="">Selecione um tipo de produto</option>
                  <option value="Ortofoto">Ortofoto</option>
                  <option value="Planta">Planta</option>
                  <option value="Classificados">Classificados</option>
                </select>
              </div>
              {productsLeft.length > 0 && (
                <div className="form-group mt-3">
                  <label>Produtos:</label>
                  <div className="product-timeline">
                    {productsLeft.map(product => (
                      <button
                        key={product.name}
                        type="button"
                        className={
                          "btn btn-outline-primary me-2 mt-2 " +
                          (selectedProductLeft && selectedProductLeft.name === product.name ? 'active' : '')
                        }
                        onClick={() => handleProductSelectionLeft(product)}
                      >
                        {new Date(product.datetime).getFullYear()}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Direita */}
            <div className="product-right">
              <h4>Produto Direito</h4>
              <div className="form-group mt-3">
                <label>Tipo de Produto:</label>
                <select
                  name="productTypeRight"
                  className="form-control"
                  value={productTypeRight}
                  onChange={handleProductTypeChangeRight}
                >
                  <option value="">Selecione um tipo de produto</option>
                  <option value="Ortofoto">Ortofoto</option>
                  <option value="Planta">Planta</option>
                  <option value="Classificados">Classificados</option>
                </select>
              </div>
              {productsRight.length > 0 && (
                <div className="form-group mt-3">
                  <label>Produtos:</label>
                  <div className="product-timeline">
                    {productsRight.map(product => (
                      <button
                        key={product.name}
                        type="button"
                        className={
                          "btn btn-outline-primary me-2 mt-2 " +
                          (selectedProductRight && selectedProductRight.name === product.name ? 'active' : '')
                        }
                        onClick={() => handleProductSelectionRight(product)}
                      >
                        {new Date(product.datetime).getFullYear()}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Botão para iniciar o desenho do retângulo */}
      <div className="form-group mt-3">
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={() => setSelectingRectangle(true)}
        >
          Selecionar Retângulo no Mapa
        </button>
      </div>

      {/* Campos de Coordenadas (preenchidos após desenhar no mapa) */}
      <div className="form-group mt-3">
        <label>Coordenadas:</label>
        <div className="row">
          {/* Latitude Inicial */}
          <div className="col-6">
            <label>Latitude Inicial:</label>
            <input
              type="text"
              name="latitudeInicial"
              className="form-control"
              value={formData.latitudeInicial}
              onChange={handleChange}
              readOnly
            />
          </div>
          {/* Latitude Final */}
          <div className="col-6">
            <label>Latitude Final:</label>
            <input
              type="text"
              name="latitudeFinal"
              className="form-control"
              value={formData.latitudeFinal}
              onChange={handleChange}
              readOnly
            />
          </div>
        </div>
        <div className="row mt-3">
          {/* Longitude Inicial */}
          <div className="col-6">
            <label>Longitude Inicial:</label>
            <input
              type="text"
              name="longitudeInicial"
              className="form-control"
              value={formData.longitudeInicial}
              onChange={handleChange}
              readOnly
            />
          </div>
          {/* Longitude Final */}
          <div className="col-6">
            <label>Longitude Final:</label>
            <input
              type="text"
              name="longitudeFinal"
              className="form-control"
              value={formData.longitudeFinal}
              onChange={handleChange}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Renderizar botões apenas no modo 'single' */}
      {viewMode === 'single' && (
        <>
          {/* Botão principal para enviar a requisição */}
          <button type="submit" className="btn btn-primary mt-3">
            Fazer Requisição
          </button>

          {/* Botão para selecionar um ponto no mapa */}
          <button
            type="button"
            className="btn btn-secondary mt-3 ms-2"
            onClick={onSelectPixel}
          >
            Selecionar Ponto
          </button>
        </>
      )}
    </form>
  );
};

export default WMSForm;
