import { useState, useEffect } from 'react';
import permisstionsData from '../../Data/PermissionsData';

export default function Checkbox(props) {
  const [checkboxes, setCheckboxes] = useState([]);

 const handleCheckboxChange = (event) => {
    const checkboxId = String(event.target.value);
    if(checkboxes.includes(checkboxId)){
          var list = checkboxes.filter((id) => id !== checkboxId)
      setCheckboxes(Array.from(list));
          props.onCheckboxChange(list) 

} else {
        var list = [...checkboxes, checkboxId]
      setCheckboxes(Array.from(list)); 
    props.onCheckboxChange(list) 

    }
    console.log(checkboxes)  
  };            

  
     useEffect(()=> {
      const list = [];
      if(props.user !== null){
         permisstionsData.forEach((item)=> {
      if(props.user.permissions.hasOwnProperty(item.key) && item[props.user.user_type] === true){
       list.push(String(item.id))}
      })
    console.log(list)
    setCheckboxes(list);
    props.onCheckboxChange(list) 

      } else {

      permisstionsData.forEach((item)=> {
      if(item[props.type['value']] === true){
       list.push(String(item.id))}
      })
    console.log(list)
    props.onCheckboxChange(list) 
    setCheckboxes(Array.from(list));
      }
    
       },[props.type])

    return (
          <div className="permissionsCheckbox">
      {permisstionsData.map((checkbox) => (
        <label className="checkboxLabel" key={checkbox.id}>
          <input
            type="checkbox"
            value={checkbox.id}
            checked ={checkboxes.includes(String(checkbox.id))}
            disabled={!checkbox[props.type.value]}
            onChange={handleCheckboxChange}
          />
          {checkbox.label}
        </label>
      ))}
    </div>
  )
}
