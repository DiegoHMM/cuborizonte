// PixelChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns'; // Para adaptar as datas
import { registerables, Chart } from 'chart.js';
Chart.register(...registerables);

const classMapping = {
  'building': 1,
  'vegetation': 2,
  'background': 3,
};

const classNames = Object.keys(classMapping);

const PixelChart = ({ data }) => {
  const dates = Object.keys(data);
  const classes = Object.values(data);

  const numericClasses = classes.map(cls => classMapping[cls]);

  const chartData = {
    labels: dates.map(date => {
      const [day, month, year] = date.split('/');
      return new Date(`${year}-${month}-${day}`);
    }),
    datasets: [
      {
        label: 'Mudança ao Longo do Tempo',
        data: numericClasses,
        borderColor: 'rgb(54, 162, 235)',
        fill: false,
        stepped: true,
      },
    ],
  };

  const options = {
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
        suggestedMin: 0,
        suggestedMax: 4,
        stepSize: 1,
      },
      x: {
        type: 'time',
        time: {
          unit: 'month',
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
    },
  };

  return (
    <div style={{ width: '80%', margin: '20px auto' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PixelChart;
