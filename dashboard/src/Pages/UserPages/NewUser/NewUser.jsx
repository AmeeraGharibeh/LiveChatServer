import "./NewUser.css";
import DropdownMenu from "../../../Components/DropdownMenu";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../../Redux/Repositories/UsersRepo";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { resetUserState } from "../../../Redux/UsersRedux";
//import Checkbox from "../../../Components/PermissionsCheckBox/Checkbox";
//import permisstionsData from "../../../Data/PermissionsData";
import RadioGroup from '../../../Components/RadioGroup/RadioGroup';


export default function NewUser() {
  const [inputs, setInputs] = useState({});
  const [room, setRoom] = useState(null);
  const [date, setDate] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const rooms = useSelector((state)=> state.room.rooms);
  const success = useSelector((state) => state.user.success);
  const loading = useSelector((state) => state.user.isFetching);
  const msg = useSelector((state) => state.user.msg);
  const error = useSelector((state) => state.user.error);
 // const [checkboxes, setCheckboxes] = useState([]);
 // const [selectedType, setSelectedType] = useState('');
 const dates = ["شهر", '3 أشهر', '6 أشهر', 'سنة']
  const dispatch = useDispatch();

  const options = [
    { value: 'royal', label: 'اسم ملكي' },
    { value: 'protected', label: 'اسم محمي' },
    { value: 'root', label: 'اسم روت' },

  ];
  useEffect(()=>{
    setRoom(rooms[0]);
    setDate(dates[0])
  }, []);

  useEffect(()=> {
    dispatch(resetUserState());
  }, []);

const handleDropdownRooms = (value) => {
  setRoom(value);
    };
const handleDropdownDate = (value) => {
  setDate(value);
    };
      const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
/*  const handleDropdownUser = (event) => {
    setSelectedType(event.target.value)
    const selectedObject = types.find((option) => 
    option.id === event.target.value
    );
    setType(event.target.value);
     };
*/
  const handleChange = (e)=> {
    setInputs(prev => {
      return {...prev, [e.target.name]: e.target.value}
    })
  }
  /*const handlePermissions = (value) => {
   setCheckboxes(value)
   console.log(checkboxes) }*/
     
  const handleClick = (e)=> {
    e.preventDefault();
   /* const permissions = {};
    permisstionsData.forEach((item) => {
      if(checkboxes.includes(item.id)){
        permissions[item.key] = true
      }
    })*/
  const userData = { 
      ...inputs,
      user_type: selectedOption,
      room_id: room._id,
     user_type: selectedOption,
    name_end_date: date };
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
        <label>نوع الاسم</label>
          <RadioGroup
        options={options}
        selectedOption={selectedOption}
        onChange={handleOptionChange}
      />  
          </div>
        <div className="addUserItem">
          <label>الغرفة</label>
          <DropdownMenu className="dropdown" options={rooms} value = {'room_name'} default = {room} onDropdownChange={handleDropdownRooms}/>
        </div>
        <div className="addUserItem">
          <label>تاريخ الانتهاء</label>
          <DropdownMenu className="dropdown" options={dates} default = {date} onDropdownChange={handleDropdownDate}/>
        </div>
        </form>
        {
        //<Checkbox user= {null} type= {type} onCheckboxChange={handlePermissions}/>
        /*<div className="addUserItem">
        <Link to="/newroot">
          <button className="rootAddButton">اضافة روت</button>
        </Link>
          <Link to="/newname">
          <button className="rootAddButton">اضافة اسم مسجل</button>
        </Link>
          </div>*/}
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