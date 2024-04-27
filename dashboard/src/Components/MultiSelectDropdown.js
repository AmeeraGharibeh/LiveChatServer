import React, { useState, useEffect } from "react";

function MultiSelectDropdown(props) {
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    props.onSelectedOptionsChange(selectedOptions);
  }, [selectedOptions]);

  const handleChange = (event) => {
    const selectedValueStrings = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );

    setSelectedValues([...selectedValues, selectedValueStrings]); // Update selected values
    props.onSelectedOptionsChange(selectedValues); // Pass selected values to parent component
  };
  const handleRemove = (index) => {
    const updatedSelectedValues = [...selectedValues];
    updatedSelectedValues.splice(index, 1);

    setSelectedValues(updatedSelectedValues);

    const updatedSelectedOptions = selectedOptions.filter(
      (option) => option.room_name !== updatedSelectedValues[index]
    );

    setSelectedOptions(updatedSelectedOptions);
  };

  return (
    <div>
      <select
        id="options"
        style={{ width: "100%", padding: "10px" }}
        multiple
        value={selectedValues}
        onChange={handleChange}
      >
        {props.options.map((option) => (
          <option
            style={{ fontSize: "14px", margin: "10px 0px" }}
            key={option._id}
            value={option.room_name}
          >
            {option.room_name}
          </option>
        ))}
      </select>

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
        {selectedValues.map((selectedOption, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#e0e0e0",
              color: "black",
              padding: "5px",
              margin: "5px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {selectedOption}
            <span
              style={{ margin: "0px 5px", cursor: "pointer", color: "red" }}
              onClick={() => handleRemove(index)}
            >
              x
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MultiSelectDropdown;
