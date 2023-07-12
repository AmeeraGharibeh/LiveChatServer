import { useLocation } from "react-router-dom";
import "./Room.css";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { updateRooms } from "../../../Redux/Repositories/RoomsRepo";

export default function Room() {
    const location = useLocation();
    const roomId = location.pathname.split('/')[2];
    const room = useSelector((state)=> state.room.rooms.find((p)=> p._id === roomId));
    const [inputs, setInputs] = useState({});
    const countries = useSelector((state)=> state.country.countries)
    const success = useSelector((state) => state.room.isSuccess);
    const loading = useSelector((state) => state.room.isFetching);
    const msg = useSelector((state) => state.room.msg);
    const error = useSelector((state) => state.room.error);

    const dispatch = useDispatch();

  
  useEffect(()=>{
    if(success){
      toast.success('تم تعديل الغرفة بنجاح')
    }
  }, [success]);
    const getCountry = ((id)=> {
      const country = countries.find(c => c._id === id);
        return country.name_ar
   })
  const handleChange = (e)=> {
    setInputs(prev => {
      return {...prev, [e.target.name]: e.target.value}
    })
  }
 
  const handleClick = (e)=> {
    e.preventDefault();
    const roomData = { ...inputs};
    updateRooms(roomId, roomData, dispatch);
  }
  return (
    <div className="room">
      <div className="roomTitleContainer">
        <h1>{room.room_name}</h1>
      </div>
      <div className="roomTop">
          <div className="roomTopContainer">
                  <div className="roomInfoItem">
                      <span className="roomInfoKey">اسم الغرفة:</span>
                      <span className="roomInfoValue">{room.room_name}</span>
                  </div>
                    <div className="roomInfoItem">
                      <span className="roomInfoKey">نوع الغرفة:</span>
                      <span className="roomInfoValue">{room.room_type}</span>
                  </div>
                      <div className="roomInfoItem">
                      <span className="roomInfoKey">الدولة:</span>
                      <span className="roomInfoValue">{getCountry(room.room_country)}</span>
                  </div>
                   <div className="roomInfoItem">
                      <span className="roomInfoKey">مالك الغرفة:</span>
                      <span className="roomInfoValue">{room.room_owner}</span>
                  </div>
                  <div className="roomInfoItem">
                      <span className="roomInfoKey">الإيميل:</span>
                      <span className="roomInfoValue">{room.email}</span>
                  </div>
                   <div className="roomInfoItem">
                      <span className="roomInfoKey">الوصف:</span>
                      <span className="roomInfoValue">{room.description}</span>
                  </div>
                   <div className="roomInfoItem">
                      <span className="roomInfoKey">تاريخ الإنتهاء:</span>
                      <span className="roomInfoValue">{room.end_date}</span>
                  </div>
                   <div className="roomInfoItem">
                      <span className="roomInfoKey">كود الغرفة:</span>
                      <span className="roomInfoValue">{room.room_code}</span>
                  </div>
                  <div className="roomInfoItem">
                      <span className="roomInfoKey">سعة الغرفة:</span>
                      <span className="roomInfoValue">{room.room_capacity}</span>
                  </div>
                 <div className="roomInfoItem">
                      <span className="roomInfoKey">المدة:</span>
                      <span className="roomInfoValue">{room.room_duration}</span>
                  </div>
          </div>
      </div>
      <div className="roomBottom">
           <div className="roomBottomContainer">
          <form className="roomForm">
              <div className="roomFormItem">
                 <label>اسم الغرفة</label>
                  <input name="room_name" type="text" placeholder={room.room_name} onChange={handleChange}/>
              </div>
              <div className="roomFormItem">
                 <label>كلمة مرور الغرفة</label>
                  <input name="room_password" type="text"  onChange={handleChange}/>
              </div>
              <div className="roomFormItem">
                 <label>كود الغرفة</label>
                  <input name="room_code" type="text"  onChange={handleChange}/>
              </div>                
               
              <div className="roomFormItem">
                 <label>المدة</label>
                  <input name="room_duration" type="text" placeholder={room.room_duration} onChange={handleChange}/>
              </div>        
                                       
          </form>
        <button className="roomUpdateButton" onClick={handleClick} disabled={loading || success} >{loading ? "بالانتظار..." : success ? "تم التعديل" : "تأكيد" }</button>     
        <span style={{color: 'red', paddingTop: '15px'}}>{error && msg}</span>
         <ToastContainer />
      </div>
      </div>
    </div>
  );
}