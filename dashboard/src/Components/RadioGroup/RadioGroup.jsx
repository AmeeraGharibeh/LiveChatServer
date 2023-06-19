import React from 'react';
import './RadioGroup.css'

const RadioGroup = ({ options, selectedOption, onChange }) => {
   return (
    <div className="radio-group">
      {options.map((option) => (
        <label key={option.value} className="radio-label">
          <input
            type="radio"
            value={option.value}
            checked={option.value === selectedOption}
            onChange={onChange}
            className="radio-input"
          />
          <span className="radio-text">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;