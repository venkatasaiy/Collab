import React from 'react';

const FilterDropdown = ({ value, onChange, options = [], placeholder = "Filter" }) => {
  return (
    <select
      className="select-control"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((opt, idx) => (
        <option key={idx} value={typeof opt === 'object' ? opt.value : opt}>
          {typeof opt === 'object' ? opt.label : opt}
        </option>
      ))}
    </select>
  );
};

export default FilterDropdown;
