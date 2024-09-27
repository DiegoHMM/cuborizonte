// WMSForm.js
import React, { useEffect, useState } from 'react';
import '../styles/WMSForm.css'; 
import 'leaflet-draw/dist/leaflet.draw.css';
import { get_ortho_products, get_plan_products, get_classified_products } from '../services/api';

const WMSForm = ({ boundingBox, onSubmit, onSelectPixel }) => {
  const [formData, setFormData] = useState({
    latitudeInicial: '',
    longitudeInicial: '',
    latitudeFinal: '',
    longitudeFinal: '',
  });

  const [productType, setProductType] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const handleProductTypeChange = async (e) => {
    const type = e.target.value;
    setProductType(type);
    setSelectedProduct(null); // Resetar produto selecionado
    setProducts([]); // Resetar lista de produtos

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
      setProducts(productsData);
    } catch (error) {
      console.error('Erro ao obter os produtos:', error);
    }
  };

  const handleProductSelection = (product) => {
    setSelectedProduct(product);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      alert('Por favor, selecione um produto.');
      return;
    }
    const dataToSubmit = {
      ...formData,
      layer: selectedProduct.name,
    };
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="floating-form form-group">
      <div className="form-group mt-3">
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
      {/* Exibir produtos como botões em uma linha do tempo */}
      {products.length > 0 && (
        <div className="form-group mt-3">
          <label>Produtos:</label>
          <div className="product-timeline">
            {products.map(product => (
              <button
                key={product.name}
                type="button"
                className={`btn btn-outline-primary me-2 mt-2 ${selectedProduct && selectedProduct.name === product.name ? 'active' : ''}`}
                onClick={() => handleProductSelection(product)}
              >
                {new Date(product.datetime).getFullYear()}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="form-group">
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
        Selecionar Pixel
      </button>
    </form>
  );
};

export default WMSForm;
