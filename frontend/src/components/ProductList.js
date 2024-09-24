// src/components/ProductList.js
import React from 'react';

const ProductList = ({ produtos, onProductSelect }) => {
  return (
    <div>
      <h3>Produtos Disponíveis</h3>
      <ul>
        {produtos.map((produto, index) => (
          <li key={index} onClick={() => onProductSelect(produto)}>
            {produto.product} ({produto.date[0]} - {produto.date[1]})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
