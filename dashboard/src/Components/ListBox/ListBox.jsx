import React, { useState } from 'react';

const ListBox = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState('');

  const handleChange = (event) => {
    setSelectedItem(event.target.value);
  };

  return (
    <div>
      <h2>Image List Box Example</h2>
      <select value={selectedItem} onChange={handleChange}>
        <option value="">Select an item</option>
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      {selectedItem && (
        <div>
          <p>Selected Item: {selectedItem}</p>
          <img
            src={items.find((item) => item.value === selectedItem)?.imageSrc}
            alt={`Image for ${selectedItem}`}
            style={{ maxWidth: '100%', maxHeight: '200px' }}
          />
        </div>
      )}
    </div>
  );
};

export default ListBox;
