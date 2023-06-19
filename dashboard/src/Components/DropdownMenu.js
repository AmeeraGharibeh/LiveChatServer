import React, { useState } from "react";

function DropdownMenu(props) {
  const [selectedOption, setSelectedOption] = useState(props.default);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    const selectedObject = props.options.find((option) => 
    props.value != null 
    ?  option._id === event.target.value 
    : option === event.target.value
    );
    props.onDropdownChange(selectedObject);
    console.log(selectedObject)
  };

  return (
    <div>
      <select id="options" style={{width: '100%' ,padding: '10px'}} value={selectedOption} onChange={handleChange}>
        {props.options.map((option) => (
          <option style={{fontSize: '14px', margin: '10px 0px'}} 
          key={props.value != null ? option._id : option}
          value={props.value != null ? option._id : option} onChange={handleChange}>
            { props.value != null ? option[props.value] : option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DropdownMenu;
