import {
  Block,
  CalendarToday,
  CallMissedOutgoingOutlined,
  ChatBubbleOutline,
  CompareArrows,
  DeleteSweep,
  FavoriteBorder,
  Flag,
  LocationSearching, 
  MessageOutlined, 
  Mic, 
  PanTool,
  Person,
  RemoveCircleOutline,
  Settings,
  WcOutlined,
  Work
} from "@material-ui/icons";
import "./User.css";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { updateUser } from "../../../Redux/Repositories/UsersRepo";
import DropdownMenu from "../../../Components/DropdownMenu";import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import Checkbox from "../../../Components/PermissionsCheckBox/Checkbox";
import permisstionsData from "../../../Data/PermissionsData";
import types from "../../../Data/Type";

export default function User() {
  const location = useLocation();
  const userId = location.pathname.split('/')[2];
  const [inputs, setInputs] = useState({});
  const [room, setRoom] = useState(null);
  const [type, setType] = useState({});
  const [selectedType, setSelectedType] = useState('');
  const user = useSelector((state)=> state.user.users.find((p)=> p._id === userId));
  const success = useSelector((state) => state.user.success);
  const error = useSelector((state) => state.user.error);
  const loading = useSelector((state) => state.user.isFetching);
  const rooms = useSelector((state)=> state.room.rooms);
  const msg = useSelector((state) => state.user.msg);
  const [checkboxes, setCheckboxes] = useState([]);
    const dispatch = useDispatch();

  useEffect(()=> {
    const room = rooms.find(c => c._id === user.room_id);
    setRoom(room);


  }, [])
  useEffect(()=>{
    const selectedObject = types.find((option) => 
    option.value === user.user_type
    )
    setSelectedType(selectedObject.id)
    setType(selectedObject);
    console.log(type)
  }, []);


           

  const handleChange = (e)=> {
    setInputs(prev => {
      return {...prev, [e.target.name]: e.target.value}
    })
  };


  const getRoom = ((id)=> {
  const room = rooms.find(c => c._id === id);
    return room
  });

  const handleClick = (e)=> {
    e.preventDefault();
    const permissions = {};
    permisstionsData.forEach((item) => {
      if(checkboxes.includes(item.id)){
        permissions[item.key] = true
      }
    })
  const userData = { ...inputs, room_id: room._id, user_type: type.value, permissions: permissions };
    updateUser(userId, userData, dispatch);
  };
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

  const handlePermissions = (value) => {
     setCheckboxes(value)
     }


  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">{user.username}</h1>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img
              src={user.pic}
              alt=""
              className="userShowImg"
            />
            <div className="userShowTopTitle">
              <span className="userShowUsername">{user.username}</span>
              <span className="userShowUserTitle">{user.user_type}</span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">معلومات المستخدم:</span>
            <div className="userShowInfo">
              <ChatBubbleOutline className="userShowIcon" />
              <span className="userShowTitle">الغرفة:</span>
              <span className="userShowInfoTitle">{getRoom(user.room_id).room_name}</span>
            </div>
            <div className="userShowInfo">
              <CalendarToday className="userShowIcon" />
              <span className="userShowTitle">تاريخ الميلاد:</span>
              <span className="userShowInfoTitle">{user.birthday}</span>
            </div>
            <div className="userShowInfo">
              <Work className="userShowIcon" />
              <span className="userShowTitle">العمل:</span>
              <span className="userShowInfoTitle">{user.work}</span>
            </div>
               <div className="userShowInfo">
              <WcOutlined className="userShowIcon" />
                <span className="userShowTitle">الجنس:</span>
              <span className="userShowInfoTitle">{user.gender}</span>
            </div>
               <div className="userShowInfo">
              <FavoriteBorder className="userShowIcon" />
                <span className="userShowTitle">الحالة الإجتماعية:</span>
              <span className="userShowInfoTitle">{user.state}</span>
            </div>
            <div className="userShowInfo">
              <LocationSearching className="userShowIcon" />
              <span className="userShowTitle">الدولة:</span>
              <span className="userShowInfoTitle">{user.country}</span>
            </div>
            <div className="userShowInfo">
              <PanTool className="userShowIcon" />
              <span className="userShowTitle">الصلاحيات:</span>
              <span className="userShowInfoTitle">{user.country}</span>
            </div> 
            <div className="permissionsIcons">
              {permisstionsData.map((item, i)=>(
                  <Tooltip placement="bottom" overlay={<span>{item.label}</span>}>
                    <span style={{margin: '2px', color: 'black'}} key= {String(item.id)}>
                    { user.permissions[item.key] && item.icon }
                    </span>
                  </Tooltip>
              ))}
              </div>           
          </div>
        </div>

      </div>
       <div className="userTitleContainer">
        <h3 className="userTitle">تعديل بيانات المستخدم</h3>
    
      </div>
      <div className="userContainer">
        <div className="userShow">
       <form className="addUserForm">
             <div className="addUserItem">
          <label>الاسم</label>
          <input name="username" type="text" placeholder={user.username} onChange={handleChange}/>
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
      {/* <div className="permissionsCheckbox">
      {permisstionsData.map((checkbox) => (
        <label className="checkboxLabel" key={checkbox.id}>
          <input
            type="checkbox"
            value={checkbox.id}
            checked ={checkboxes.includes(checkbox.id)}
            disabled={!checkbox[type.value]}
            onChange={handleCheckboxChange}
          />
          {checkbox.label}
        </label>
      ))}
    </div> */}
    <Checkbox user= {user} type= {type} onCheckboxChange={handlePermissions}/>
        </form>
             <button className="addUserButton" onClick={handleClick} disabled={loading || success} >{loading ? "بالانتظار..." : success ? "تم التعديل" : "تأكيد" }</button>
              {error &&  toast.error(msg)}
              {success && toast.success('تم تعديل المستخدم بنجاح')}
              <ToastContainer />
        </div>
      </div>
    </div>
  );
}
