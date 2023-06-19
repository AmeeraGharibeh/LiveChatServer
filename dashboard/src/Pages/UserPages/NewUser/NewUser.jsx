import "./NewUser.css";
import DropdownMenu from "../../../Components/DropdownMenu";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../../Redux/Repositories/UsersRepo";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { resetUserState } from "../../../Redux/UsersRedux";
import Checkbox from "../../../Components/PermissionsCheckBox/Checkbox";
import permisstionsData from "../../../Data/PermissionsData";
import types from '../../../Data/Type'


export default function NewUser() {
  const [inputs, setInputs] = useState({});
  const [room, setRoom] = useState(null);
  const [type, setType] = useState({});
  const rooms = useSelector((state)=> state.room.rooms);
  const success = useSelector((state) => state.user.success);
  const loading = useSelector((state) => state.user.isFetching);
  const msg = useSelector((state) => state.user.msg);
  const error = useSelector((state) => state.user.error);
  const [checkboxes, setCheckboxes] = useState([]);
  const [selectedType, setSelectedType] = useState('');

  const dispatch = useDispatch();


  useEffect(()=>{
    setRoom(rooms[0])
    setType(types[0])
  }, []);

  useEffect(()=> {
    dispatch(resetUserState());
  }, []);

const handleDropdownRooms = (value) => {
  setRoom(value);
    };
  const handleDropdownUser = (event) => {
    setSelectedType(event.target.value)
    const selectedObject = types.find((option) => 
    option.id === event.target.value
    );
    setType(selectedObject);
     };

  const handleChange = (e)=> {
    setInputs(prev => {
      return {...prev, [e.target.name]: e.target.value}
    })
  }
  const handlePermissions = (value) => {
   setCheckboxes(value)
   console.log(checkboxes)
     }
  const handleClick = (e)=> {
    e.preventDefault();
    const permissions = {};
    permisstionsData.forEach((item) => {
      if(checkboxes.includes(item.id)){
        permissions[item.key] = true
      }
    })
  const userData = { 
      ...inputs,
      user_type: type,
      room_id: room._id,
     user_type: type.value, permissions: permissions };
          console.log(userData)
    addUser(userData, dispatch);

  }
  return (
    <div className='newUser'>
        <h1 className="addUserTitle">إضافة مستخدم جديد</h1>
        <form className="addUserForm">
        <div className="addUserItem">
          <label>الاسم</label>
          <input name="username" type="text" onChange={handleChange}/>
        </div>
        <div className="addUserItem">
          <label>كلمة المرور</label>
          <input name="room_password" type="password"  onChange={handleChange}/>
        </div>
        <div className="addUserItem">
          <label>نوع المستخدم</label>
       <select id="options" style={{width: '100%' ,padding: '10px'}} value={selectedType} onChange={handleDropdownUser}>
          {types.map((option) => (
          <option style={{fontSize: '14px', margin: '10px 0px'}} 
          key={option.id}
          value={option.id} onChange={handleDropdownUser}>
            {option.label}
          </option>
        ))}
      </select>   
          </div>
        <div className="addUserItem">
          <label>الغرفة</label>
          <DropdownMenu className="dropdown" options={rooms} value = {'room_name'} default = {room} onDropdownChange={handleDropdownRooms}/>
        </div>
            <Checkbox user= {null} type= {type} onCheckboxChange={handlePermissions}/>

        </form>
        <div className="addUserItem">
        <Link to="/newroot">
          <button className="rootAddButton">اضافة روت</button>
        </Link>
          <Link to="/newname">
          <button className="rootAddButton">اضافة اسم مسجل</button>
        </Link>
        </div>
      <div className="addUserItem">
         <button className="addUserButton" onClick={handleClick} disabled={loading || success} >{loading ? "بالانتظار..." : success ? "تمت الاضافة" : "تأكيد" }</button>
            <div style={{color: success ? 'green' : error ? 'red' : 'black'}}>
               {success && 'تمت اضافة المستخدم بنجاح'}
               {error && msg}
      </div>
        </div>
 
    </div>
  );
}