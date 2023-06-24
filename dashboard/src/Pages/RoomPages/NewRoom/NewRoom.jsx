import { useEffect, useState } from "react";
import "./NewRoom.css";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from 'react-toastify';
import { addRoom } from "../../../Redux/Repositories/RoomsRepo";
import { useSelector } from "react-redux";
import DropdownMenu from "../../../Components/DropdownMenu";


export default function NewRoom() {
  const [inputs, setInputs] = useState({});
  const [limitsInput, setLimitsInput] = useState({});
  const [country, setCountry] = useState(null);
  const [type, setType] = useState(null);
  const success = useSelector((state) => state.room.isSuccess);
  const loading = useSelector((state) => state.room.isFetching);
  const countries = useSelector((state)=> state.country.countries);
  const dispatch = useDispatch();

  useEffect(()=>{
    setCountry(countries[0])
    setType(roomTypes[0])
  }, []);

    useEffect(() => {
  if (success) {
    toast.success("تمت اضافة الغرفة بنجاح");
  }
}, [success]);

const handleDropdownCountry = (value) => {
  console.log(value.name_ar)
  setCountry(value);
    };
    const handleDropdownRoomType = (value) => {
    setType(value);
    };


  const handleChange = (e)=> {
    setInputs(prev => {
      return {...prev, [e.target.name]: e.target.value}
    })
  }
   const handleLimits = (e)=> {
    setLimitsInput(prev => {
      return {...prev, [e.target.name]: e.target.value}
    })
  }
  const handleClick = (e)=> {
    e.preventDefault();
    const roomData = { ...inputs,
      room_country: country._id,
      room_type: type,
           account_limits:  limitsInput};
    addRoom(roomData, dispatch);
  }
  const roomTypes = ['مميزة', 'ذهبي', 'فضي']
  return (
    <div className="newRoom">
      <h1 className="addRoomTitle">إضافة غرفة</h1>
      <form className="addRoomForm">
        <div className="addRoomItem">
          <label>اسم الغرفة</label>
          <input name="room_name" type="text"  onChange={handleChange}/>
        </div>
           <div className="addRoomItem">
          <label>الدولة</label>
          <DropdownMenu className="dropdown" options={countries} value = {'name_ar'} onDropdownChange={handleDropdownCountry}/>
        </div>
           <div className="addRoomItem">
          <label>نوع الغرفة</label>
          <DropdownMenu className="dropdown" options={roomTypes} onDropdownChange={handleDropdownRoomType}/>
        </div>
          <div className="addRoomItem">
          <label>اسم المالك</label>
          <input name="room_owner" type="text" onChange={handleChange} />
        </div>
          <div className="addRoomItem">
          <label>الإيميل</label>
          <input name="email" type="text" onChange={handleChange}/>
        </div>
      
          <div className="addRoomItem">
          <label>سعة الغرفة</label>
          <input name="room_capacity" type="number" onChange={handleChange}/>
        </div>
       <div className="addRoomItem">
          <label>حد الحسابات</label>
          <div className="limits">
            <div className="addRoomItem">
            <label >Member</label>
            <input name="member" type="number"  onChange={handleLimits}/>
            </div>
              <div className="addRoomItem">
              <label >Admin</label>
            <input name="admin" type="number" onChange={handleLimits}/>
              </div>
              <div className="addRoomItem">
               <label >Super Admin</label>
              <input name="super admin" type="number" onChange={handleLimits}/>
              </div>
              <div className="addRoomItem">
              <label >Master</label>
            <input name="master" type="number" onChange={handleLimits}/>
              </div>
        
          </div>
        </div>
      </form>
         <div className="addRoomItem">
       
        <button className="addRoomButton" onClick={handleClick} disabled={loading || success} >{loading ? "بالانتظار..." : success ? "تمت الاضافة" : "تأكيد" }</button>     
         <ToastContainer />
        </div>
    </div>
  );
}