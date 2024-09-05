// src/components/WMSForm.js
import React, { useEffect, useState } from 'react';


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
      setFormData((prevData) => ({
        ...prevData,
        latitudeInicial: boundingBox.latitudeInicial,
        longitudeInicial: boundingBox.longitudeInicial,
        latitudeFinal: boundingBox.latitudeFinal,
        longitudeFinal: boundingBox.longitudeFinal,
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
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <div>
        <label>Latitude Inicial:</label>
        <input
          type="text"
          name="latitudeInicial"
          value={formData.latitudeInicial}
          onChange={handleChange}
          readOnly
        />
      </div>
      <div>
        <label>Longitude Inicial:</label>
        <input
          type="text"
          name="longitudeInicial"
          value={formData.longitudeInicial}
          onChange={handleChange}
          readOnly
        />
      </div>
      <div>
        <label>Latitude Final:</label>
        <input
          type="text"
          name="latitudeFinal"
          value={formData.latitudeFinal}
          onChange={handleChange}
          readOnly
        />
      </div>
      <div>
        <label>Longitude Final:</label>
        <input
          type="text"
          name="longitudeFinal"
          value={formData.longitudeFinal}
          onChange={handleChange}
          readOnly
        />
      </div>
      <div>
        <label>Camada:</label>
        <input
          type="text"
          name="layer"
          value={formData.layer}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Data Inicial:</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Data Final:</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Fazer Requisição</button>
    </form>
  );
};

export default WMSForm;
