// ProductDropdown.js
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { get_products } from '../services/api';

const ProductDropdown = ({ onProductSelected }) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const loadAvailableProducts = async () => {
      try {
        const productsData = await get_products('');
        const opts = productsData.map((product) => ({
          value: product.name,
          label: product.label,
          description: product.description,
          datetime: product.datetime,
        }));
        setOptions(opts);
      } catch (error) {
        console.error('Erro ao obter produtos disponíveis:', error);
      }
    };

    loadAvailableProducts();
  }, []);

  const handleChange = (option) => {
    setSelectedOption(option);
    onProductSelected(option);
  };

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={handleChange}
      placeholder="Selecione um produto..."
    />
  );
};

export default ProductDropdown;
