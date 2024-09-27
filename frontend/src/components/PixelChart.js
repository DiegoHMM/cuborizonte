// PixelChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const classMapping = {
  'building': 1,
  'vegetation': 2,
  'background': 3,
  'no_data': 4,
};

const classColors = {
  'building': 'rgb(255, 99, 132)',      // Vermelho
  'vegetation': 'rgb(75, 192, 192)',    // Verde
  'background': 'rgb(201, 203, 207)',   // Cinza
  'no_data': 'rgb(150, 150, 150)',      // Cinza escuro
};

const classNames = Object.keys(classMapping);

const PixelChart = ({ data }) => {
  data.sort((a, b) => new Date(a.date_time) - new Date(b.date_time));

  const dates = data.map(item => new Date(item.date_time));
  const classes = data.map(item => item.class);

  const numericClasses = classes.map(cls => classMapping[cls]);
  const colors = classes.map(cls => classColors[cls]);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Classe do Pixel ao Longo do Tempo',
        data: numericClasses,
        borderColor: colors,
        backgroundColor: colors,
        fill: false,
        stepped: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        showLine: false,
      },
    ],
  };

  const legendItems = classNames.map(cls => ({
    text: cls,
    fillStyle: classColors[cls],
  }));

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
      legend: {
        display: true,
        labels: {
          generateLabels: function(chart) {
            return legendItems.map(item => ({
              text: item.text,
              fillStyle: item.fillStyle,
              strokeStyle: item.fillStyle,
              pointStyle: 'circle',
            }));
          },
        },
      },
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
    <div className="pixel-chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PixelChart;
