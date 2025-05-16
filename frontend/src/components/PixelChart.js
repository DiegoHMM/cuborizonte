// PixelChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const classMapping = {
  'no_data': 4,
  'Building': 3,
  'Vegetation': 2,
  'Background': 1,
};

const classColors = {
  'Building': 'rgb(255, 99, 132)', 
  'Vegetation': 'rgb(75, 192, 192)',
  'Background': 'rgb(201, 203, 207)',
  'no_data': 'rgb(150, 150, 150)',
};

const classNames = Object.keys(classMapping);

const PixelChart = ({ data }) => {
  const filteredData = data.filter(item => item.class !== 'no_data');

  filteredData.sort((a, b) => new Date(a.date_time) - new Date(b.date_time));

  const dates = filteredData.map(item => new Date(item.date_time));
  const classes = filteredData.map(item => item.class);

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

  const legendItems = classNames
    .filter(cls => cls !== 'no_data')
    .map(cls => ({
      text: cls,
      fillStyle: classColors[cls],
    }));

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          display: false,
          callback: function(value) {
            const className = classNames.find(name => classMapping[name] === value);
            return className || value;
          },
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Classe',
        },
        max: Object.keys(classMapping).length - 0.95,
        min: 0.95,
        offset: true,
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
