// WMSForm.js
import React, { useEffect, useState } from 'react';
import '../styles/WMSForm.css'; 
import 'leaflet-draw/dist/leaflet.draw.css';
import { get_ortho_products, get_plan_products, get_classified_products } from '../services/api';

const WMSForm = ({ boundingBox, onSubmit, onSelectPixel }) => {
  // Estados para seleção de produtos esquerdo e direito
  const [productTypeLeft, setProductTypeLeft] = useState('');
  const [productsLeft, setProductsLeft] = useState([]);
  const [selectedProductLeft, setSelectedProductLeft] = useState(null);

  const [productTypeRight, setProductTypeRight] = useState('');
  const [productsRight, setProductsRight] = useState([]);
  const [selectedProductRight, setSelectedProductRight] = useState(null);

  const [formData, setFormData] = useState({
    latitudeInicial: '',
    longitudeInicial: '',
    latitudeFinal: '',
    longitudeFinal: '',
  });

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

  const handleProductTypeChangeLeft = async (e) => {
    const type = e.target.value;
    setProductTypeLeft(type);
    setSelectedProductLeft(null); // Resetar produto selecionado
    setProductsLeft([]); // Resetar lista de produtos

    try {
      let productsData = [];
      if (type === 'Ortofoto') {
        productsData = await get_ortho_products();
      } else if (type === 'Planta') {
        productsData = await get_plan_products();
      } else if (type === 'Classificados') {
        productsData = await get_classified_products();
      }
      // Ordenar produtos por data
      productsData.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
      setProductsLeft(productsData);
    } catch (error) {
      console.error('Erro ao obter os produtos:', error);
    }
  };

  const handleProductTypeChangeRight = async (e) => {
    const type = e.target.value;
    setProductTypeRight(type);
    setSelectedProductRight(null); // Resetar produto selecionado
    setProductsRight([]); // Resetar lista de produtos

    try {
      let productsData = [];
      if (type === 'Ortofoto') {
        productsData = await get_ortho_products();
      } else if (type === 'Planta') {
        productsData = await get_plan_products();
      } else if (type === 'Classificados') {
        productsData = await get_classified_products();
      }
      // Ordenar produtos por data
      productsData.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
      setProductsRight(productsData);
    } catch (error) {
      console.error('Erro ao obter os produtos:', error);
    }
  };

  const handleProductSelectionLeft = (product) => {
    setSelectedProductLeft(product);
  };

  const handleProductSelectionRight = (product) => {
    setSelectedProductRight(product);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProductLeft || !selectedProductRight) {
      alert('Por favor, selecione os dois produtos.');
      return;
    }
    const dataToSubmit = {
      ...formData,
      layerLeft: selectedProductLeft.name,
      layerRight: selectedProductRight.name,
    };
    onSubmit(dataToSubmit);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="floating-form form-group">
      <h3>Seleção de Produtos</h3>
      <div className="product-selection d-flex">
        {/* Seleção do Produto Esquerdo */}
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
                    className={`btn btn-outline-primary me-2 mt-2 ${selectedProductLeft && selectedProductLeft.name === product.name ? 'active' : ''}`}
                    onClick={() => handleProductSelectionLeft(product)}
                  >
                    {new Date(product.datetime).getFullYear()}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Seleção do Produto Direito */}
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
                    className={`btn btn-outline-primary me-2 mt-2 ${selectedProductRight && selectedProductRight.name === product.name ? 'active' : ''}`}
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
      <div className="form-group mt-3">
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
      <div className="form-group mt-3">
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
      <div className="form-group mt-3">
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
      <div className="form-group mt-3">
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
      <button type="submit" className="btn btn-primary mt-3">Fazer Requisição</button>
      <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={onSelectPixel}>
        Selecionar Ponto
      </button>
    </form>
  );
};

export default WMSForm;
