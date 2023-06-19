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
                      <span className="roomInfoKey">الدولة:</span>
                      <span className="roomInfoValue">{room.room_country}</span>
                  </div>
                   <div className="roomInfoItem">
                      <span className="roomInfoKey">مالك الغرفة:</span>
                      <span className="roomInfoValue">{room.room_owner}</span>
                  </div>
                  <div className="roomInfoItem">
                      <span className="roomInfoKey">الإيميل:</span>
                      <span className="roomInfoValue">{room.email}$</span>
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
                      <span className="roomInfoKey">رسالة الترحيب:</span>
                      <span className="roomInfoValue">{room.welcome_msg}</span>
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
                 <label>الوصف</label>
                  <input name="description" type="text" placeholder={room.description} onChange={handleChange}/>
              </div>
              <div className="roomFormItem">
                 <label>رسالة الترحيب</label>
                  <input name="welcome_msg" type="text" placeholder={room.welcome_msg} onChange={handleChange}/>
              </div>                
              <div className="roomFormItem">
                 <label>سعة الغرفة</label>
                  <input name="room_capacity" type="text" placeholder={room.room_capacity} onChange={handleChange}/>
              </div>   
              <div className="roomFormItem">
                 <label>المدة</label>
                  <input name="room_duration" type="text" placeholder={room.room_duration} onChange={handleChange}/>
              </div>        
              <div className="roomFormItem">
                 <label>تاريخ الإنتهاء</label>
                  <input name="end_date" type="text" placeholder={room.end_date} onChange={handleChange}/>
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