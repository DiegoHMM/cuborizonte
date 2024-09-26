import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { getPixelValues } from '../services/api'; // Importe a função que faz a requisição
import 'chart.js/auto';

const HistoryChart = ({ lat, lng }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPixelValues = async () => {
      try {
        const data = await getPixelValues(lat, lng);
        const processedData = processPixelData(data);
        setChartData(processedData);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao fazer a requisição:', err);
        setError('Erro ao carregar os dados.');
        setLoading(false);
      }
    };

    fetchPixelValues();
  }, [lat, lng]);

  const processPixelData = (data) => {
    const labels = Object.keys(data); // Datas (X)
    const values = Object.values(data); // Classes (Y)

    return {
      labels: labels,
      datasets: [
        {
          label: 'Valores de Classe',
          data: values,
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
          tension: 0.1,
        },
      ],
    };
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ height: '40vh', width: '100%' }}>
      {chartData ? <Line data={chartData} /> : <div>Nenhum dado encontrado.</div>}
    </div>
  );
};

export default HistoryChart;
