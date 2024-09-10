// src/components/WMSForm.js
import React, { useEffect, useState } from 'react';
import './WMSForm.css'; 

const WMSForm = ({ boundingBox, onSubmit }) => {
  const [formData, setFormData] = useState({
    latitudeInicial: '',
    longitudeInicial: '',
    latitudeFinal: '',
    longitudeFinal: '',
    layer: '',
    startDate: '',
    endDate: ''
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



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="floating-form container mt-4">
      <div className="form-group">
        <label>Latitude Inicial:</label>
        <input
          type="text"
          name="latitudeInicial"
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
          value={formData.longitudeFinal}
          onChange={handleChange}
          readOnly
        />
      </div>
      <div className="form-group mt-3">
        <label>Camada:</label>
        <input
          type="text"
          name="layer"
          value={formData.layer}
          onChange={handleChange}
        />
      </div>
      <div className="form-group mt-3">
        <label>Data Inicial:</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />
      </div>
      <div className="form-group mt-3">
        <label>Data Final:</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="btn btn-primary mt-3">Fazer Requisição</button>
    </form>
  );
};

export default WMSForm;
