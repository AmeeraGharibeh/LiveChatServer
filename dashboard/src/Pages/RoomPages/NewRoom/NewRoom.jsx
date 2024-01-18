import { useEffect, useState } from "react";
import "./NewRoom.css";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from 'react-toastify';
import permisstionsData from "../../../Data/PermissionsData";
import { addRoom } from "../../../Redux/Repositories/RoomsRepo";
import { useSelector } from "react-redux";
import DropdownMenu from "../../../Components/DropdownMenu";
import { resetRoomState } from "../../../Redux/RoomsRedux";
import { uploadFile } from "../../../Redux/Repositories/FileRepo";


export default function NewRoom() {
  const [inputs, setInputs] = useState({});
  const [limitsInput, setLimitsInput] = useState({});
  const [country, setCountry] = useState(null);
  const [type, setType] = useState(null);
  const {isSuccess, error, isFetching} = useSelector((state) => state.room);
  const countries = useSelector((state)=> state.country.countries);
  const [file, setFile] = useState(null);
  const [totalCapacity, setTotalCapacity] = useState(0);

  const dispatch = useDispatch();

  useEffect(()=>{
    setCountry(countries[0])
    setType(roomTypes[0])
  }, []);

useEffect(()=> {
  dispatch(resetRoomState());
}, [])


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
    setLimitsInput((prev) => {
    const updatedLimits = { ...prev, [e.target.name]: e.target.value };

    const newTotalCapacity = Object.values(updatedLimits).reduce(
      (total, value) => total + parseInt(value, 10) || 0,
      0
    );

    setTotalCapacity(newTotalCapacity);

    return updatedLimits;
  });
  }
   const uploadImage = async (file) => {
  try {
    const response = await uploadFile(file, 'RoomsPics');

    if (response && response.msg && response.files && response.files.length > 0) {
      toast.success(response.msg);
      console.log(response);
      setFile(response.files[0].url);
    } else {
      toast.error("Invalid response data");
    }
  } catch (err) {
    toast.error(err.message);
  }
};
 
  const handleClick = (e)=> {
    e.preventDefault();
       const permissions = {};
    permisstionsData.forEach((item) => {
        permissions[item.key] = true
    })
    console.log(permissions)
    const roomData = { ...inputs,
      room_country: country._id,
      room_type: type.name_en,
      permissions, 
      room_img: file,
      room_capacity: totalCapacity,
      account_limits:  limitsInput};
    addRoom(roomData, dispatch);
  }
  const roomTypes = [
    {_id: '1', name_ar: 'عادي' , name_en: 'silver'},
    {_id: '2', name_ar: 'ذهبي', name_en: 'gold'},
    {_id: '3', name_ar: 'مميز', name_en: 'special'}
  ]
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
          <DropdownMenu className="dropdown" options={roomTypes} value = {'name_ar'} onDropdownChange={handleDropdownRoomType}/>
        </div>
          <div className="addRoomItem">
          <label>اسم المالك</label>
          <input name="room_owner" type="text" onChange={handleChange} />
        </div>
             <div className="addRoomItem">
          <label>كلمة المرور للغرفة</label>
          <input name="room_password" type="text" onChange={handleChange} />
        </div>
          <div className="addRoomItem">
          <label>كود الغرفة</label>
          <input name="room_code" type="text" onChange={handleChange} />
        </div>
          <div className="addRoomItem">
          <label>الإيميل</label>
          <input name="email" type="text" onChange={handleChange}/>
        </div>
          <div className="addRoomItem">
          <label>مدة الغرفة</label>
          <input name="room_duration" type="text" onChange={handleChange} />
        </div>
         <div className="addRoomItem">
          <label>صورة الغرفة</label>
          { file != null 
          ? <img className="countryImg" src={file} alt=""/>
          : <input type="file" id="file"  onChange={(e) => uploadImage(e.target.files[0], 1)} />
      }
        </div>  
      
      </form>
       <div className="addRoomItemLimits">
          <label>حد الحسابات</label>
          <div className="limits">
            <div className="addRoomItem">
            <label style={{'color': "purple"}}>Member</label>
            <input name="member" type="number"  onChange={handleLimits}/>
            </div>
              <div className="addRoomItem">
              <label style={{'color': "green"}}>Admin</label>
            <input name="admin" type="number" onChange={handleLimits}/>
              </div>
              <div className="addRoomItem">
               <label style={{'color': "blue"}}>Super Admin</label>
              <input name="super_admin" type="number" onChange={handleLimits}/>
              </div>
              <div className="addRoomItem">
              <label style={{'color': "red"}}>Master</label>
            <input name="master" type="number" onChange={handleLimits}/>
              </div>
        
          </div>
        </div>
         <div className="addRoomItem">
       
        <button className="addRoomButton" onClick={handleClick} disabled={isFetching || isSuccess} >{isFetching ? "بالانتظار..." : isSuccess ? "تمت الاضافة" : "تأكيد" }</button>     
    <div style={{color: isSuccess ? 'green' : error ? 'red' : 'black'}}>
               {isSuccess && "تمت اضافة الغرفة بنجاح"}
               {error }
      </div>
    </div>
    </div>
  );
}