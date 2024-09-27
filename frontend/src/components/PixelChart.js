// PixelChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns'; // Adaptador para lidar com datas
import { registerables, Chart } from 'chart.js';
Chart.register(...registerables);

const classMapping = {
  'no_data': 0,
  'background': 1,
  'vegetation': 2,
  'building': 3,
  
};


const classNames = Object.keys(classMapping);

const PixelChart = ({ data }) => {
  // Certifique-se de que os dados estão ordenados por data
  data.sort((a, b) => new Date(a.date_time) - new Date(b.date_time));

  const dates = data.map(item => new Date(item.date_time));
  const classes = data.map(item => item.class);

  const numericClasses = classes.map(cls => classMapping[cls]);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Classe do Pixel ao Longo do Tempo',
        data: numericClasses,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        fill: false,
        stepped: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permitir que o gráfico se ajuste ao tamanho do contêiner
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            const className = classNames.find(name => classMapping[name] === value);
            return className || value;
          },
        },
        title: {
          display: true,
          text: 'Classe',
        },
        min: 1,
        max: Object.keys(classMapping).length,
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        type: 'time',
        time: {
          unit: 'year',
          tooltipFormat: 'dd/MM/yyyy',
        },
        title: {
          display: true,
          text: 'Data',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            const className = classNames.find(name => classMapping[name] === value);
            return `Classe: ${className}`;
          },
        },
      },
      legend: {
        display: false, // Ocultar a legenda para economizar espaço
      },
    },
  };

  return (
    <div className="pixel-chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PixelChart;
