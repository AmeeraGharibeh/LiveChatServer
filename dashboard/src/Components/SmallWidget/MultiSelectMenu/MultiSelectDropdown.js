import React, { useState, useEffect } from "react";
import Pill from "./Pill";
import "../MultiSelectMenu/MultiSelectDropDown.css";

const MultiSelectDropdown = (props) => {
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedValueset, setSelectedValueset] = useState(new Set());

  useEffect(() => {
    if (props.onSelectionChange) {
      props.onSelectionChange(selectedValues);
    }
  }, [selectedValues]);

  const handleSelectValue = (item) => {
    setSelectedValues([...selectedValues, item]);
    setSelectedValueset(new Set([...selectedValueset, item._id]));
  };

  const handleRemoveValue = (item) => {
    const updatedValue = selectedValues.filter(
      (selected) => selected._id !== item._id
    );
    setSelectedValues(updatedValue);
    const updated = new Set(selectedValueset);
    updated.delete(item._id);
    setSelectedValueset(updated);
  };

  return (
    <div className="user-search-container">
      <div className="user-search-input">
        {selectedValues.map((item) => {
          return (
            <Pill
              key={item._id}
              text={`${item.room_name}`}
              onClick={() => handleRemoveValue(item)}
            />
          );
        })}

        <div>
          <ul className="suggestions-list">
            {props.options.map((item) => {
              return !selectedValueset.has(item._id) ? (
                <li key={item._id} onClick={() => handleSelectValue(item)}>
                  <span>{item.room_name}</span>
                </li>
              ) : (
                <></>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
