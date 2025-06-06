// src/components/ProductTimeline.js
import React from 'react';
import '../styles/ProductTimeline.css';

const ProductTimeline = ({ years, selectedYear, onYearSelect, title }) => {
  if (!years || years.length === 0) {
    return null;
  }

  return (
    <div className="timeline-container">
      {title && <h5 className="timeline-title">{title}</h5>}
      <div className="timeline-wrapper">
        <div className="timeline-line" />
        {years.map((year) => (
          <div className="timeline-item" key={year}>
            <button
              className={`timeline-marker ${selectedYear === year ? 'active' : ''}`}
              onClick={() => onYearSelect(year)}
            />
            <span className="timeline-year-label">{year}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTimeline;