import React, { useState } from "react";

function MultiSelectDropdown(props) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (event) => {
    const selectedValues = Array.from(event.target.selectedOptions, (option) =>
      props.value != null ? option.value : option.label
    );
    setSelectedOptions(selectedValues);

    const selectedObjects = props.options.filter((option) =>
      selectedValues.includes(props.value != null ? option._id : option)
    );
    // props.onDropdownChange(selectedObjects);
    console.log(selectedObjects);
  };

  return (
    <div>
      <select
        id="options"
        style={{ width: "100%", padding: "10px" }}
        multiple
        value={selectedOptions}
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
        {selectedOptions.map((selectedValue, index) => (
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
            {selectedValue}
            <span
              style={{ marginLeft: "5px", cursor: "pointer" }}
              onClick={() => {
                const updatedSelectedOptions = [...selectedOptions];
                updatedSelectedOptions.splice(index, 1);
                setSelectedOptions(updatedSelectedOptions);
                const selectedObjects = props.options.filter((option) =>
                  updatedSelectedOptions.includes(
                    props.value != null ? option._id : option
                  )
                );
                props.onDropdownChange(selectedObjects);
              }}
            ></span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MultiSelectDropdown;
