import "./NewUser.css";
import DropdownMenu from "../../../Components/DropdownMenu";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../../Redux/Repositories/UsersRepo";
import { useEffect, useState } from "react";
import { resetUserState } from "../../../Redux/UsersRedux";
import { useLocation } from "react-router-dom";


export default function NewUser() {
  const [inputs, setInputs] = useState({});
    const location = useLocation();
  const type = location.pathname.split('/')[2];
  const [room, setRoom] = useState(null);
  const [date, setDate] = useState(null);
  const rooms = useSelector((state)=> state.room.rooms);
  const success = useSelector((state) => state.user.success);
  const loading = useSelector((state) => state.user.isFetching);
  const error = useSelector((state) => state.user.error);
 const dates = ["شهر", '3 أشهر', '6 أشهر', 'سنة']
  const dispatch = useDispatch();

  useEffect(()=>{
    setRoom(rooms[0]);
    setDate(dates[0]);
    console.log(type)
  }, []);

  useEffect(()=> {
    dispatch(resetUserState());
  }, []);


const handleDropdownDate = (value) => {
  setDate(value);
    };


  const handleChange = (e)=> {
    setInputs(prev => {
      return {...prev, [e.target.name]: e.target.value}
    })
  }
 
  const handleClick = (e)=> {
    e.preventDefault();
 
  const userData = { 
      ...inputs,
    name_type: type,
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
          <input name="name_password" type="password"  onChange={handleChange}/>
        </div>
        <div className="addUserItem">
          <label>تاريخ الانتهاء</label>
          <DropdownMenu className="dropdown" options={dates} default = {date} onDropdownChange={handleDropdownDate}/>
        </div>
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