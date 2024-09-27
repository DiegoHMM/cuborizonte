// WMSForm.js
import React, { useEffect, useState } from 'react';
import '../styles/WMSForm.css'; 
import 'leaflet-draw/dist/leaflet.draw.css';

const WMSForm = ({ boundingBox, onSubmit, onSelectPixel }) => {
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
    <form onSubmit={handleSubmit} className="floating-form form-group">
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
      <div className="form-group mt-3">
        <label>Camada:</label>
        <input
          type="text"
          name="layer"
          className="form-control"
          value={formData.layer}
          onChange={handleChange}
        />
      </div>
      <div className="form-group mt-3">
        <label>Data Inicial:</label>
        <input
          type="date"
          name="startDate"
          className="form-control"
          value={formData.startDate}
          onChange={handleChange}
        />
      </div>
      <div className="form-group mt-3">
        <label>Data Final:</label>
        <input
          type="date"
          name="endDate"
          className="form-control"
          value={formData.endDate}
          onChange={handleChange}
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
