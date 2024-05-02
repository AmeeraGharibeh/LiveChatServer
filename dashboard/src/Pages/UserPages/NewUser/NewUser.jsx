import "./NewUser.css";
import DropdownMenu from "../../../Components/DropdownMenu";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../../Redux/Repositories/UsersRepo";
import { useEffect, useState } from "react";
import { resetUserState } from "../../../Redux/UsersRedux";
import { useLocation } from "react-router-dom";
import MultiSelectDropdown from "../../../Components/SmallWidget/MultiSelectMenu/MultiSelectDropdown";


export default function NewUser() {
   const dates = [
  {"_id" : '1', 'ar': 'شهر', 'en' : '1 month'}, 
  {"_id" : '2', 'ar': '3 أشهر', 'en' :"3 months"},
  {"_id" : '3', 'ar': '6 أشهر', 'en': "6 months"},
  {"_id" : '4', 'ar': 'سنة', 'en': "12 months"}
  ]
  const [inputs, setInputs] = useState({});
    const location = useLocation();
  const type = location.pathname.split('/')[2];
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [date, setDate] = useState(dates[0]);
  const allRooms = useSelector((state)=> state.room.rooms);
  const success = useSelector((state) => state.user.success);
  const loading = useSelector((state) => state.user.isFetching);
  const error = useSelector((state) => state.user.error);

  const dispatch = useDispatch();

  // useEffect(()=>{
  //   setRooms(allRooms);
  //   console.log(type)
  // }, []);

  useEffect(()=> {
    dispatch(resetUserState());
  }, []);

 useEffect(()=> {
  }, [date]);

const handleDropdownDate = (value) => {
  console.log('data is ' + value)
  setDate(value);
    };

const handleSelectedOptionsChange = (newSelectedOptions) => {
  setSelectedRooms(newSelectedOptions)
  console.log(selectedRooms);
};
  const handleChange = (e)=> {
    setInputs(prev => {
      return {...prev, [e.target.name]: e.target.value}
    })
  }
 
  const handleClick = (e)=> {
    e.preventDefault();
       const selectedRoomIds = selectedRooms.map((option) => option._id);
       const userType = type === 'root' ? 'root' : '-';
       const nameType = type === 'root' ? '-' : type;
  const userData = { 
      ...inputs,
    room_ids: selectedRoomIds,
    user_type: userType,
    name_type: nameType,
    name_end_date: date['en']
  };
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
          <input name={type === 'root' ? 'room_password' : 'name_password'} type="password"  onChange={handleChange}/>
        </div>
        <div className="addUserItem">
          <label>تاريخ الانتهاء</label>
          <DropdownMenu className="dropdown" options={dates} value = {'ar'} default = {date} onDropdownChange={handleDropdownDate}/>
        </div> 
      { type === 'root' 
      ?  <div className="addUserItem">
          <label> اضافة الروت إلى غرفة أو عدة غرف</label>
          <MultiSelectDropdown className="dropdown" options={allRooms} onSelectionChange={handleSelectedOptionsChange}
          />
        </div> 
        : <div></div> }

      
        </form>
        
      <div className="addUserItem">
         <button className="addUserButton" onClick={handleClick} disabled={loading || success} >{loading ? "بالانتظار..." : success ? "تمت الاضافة" : "تأكيد" }</button>
            <div style={{color: success ? 'green' : error ? 'red' : 'black'}}>
               {success && 'تمت اضافة المستخدم بنجاح'}
               {error }
      </div>
        </div>
 
    </div>
  );
}