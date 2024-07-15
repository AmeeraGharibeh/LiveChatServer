import React, { useEffect, useState } from 'react'
import './SupportPage.css'
import { useDispatch, useSelector } from 'react-redux';
import { addAdmin, getAllAdmins, updateAdmin } from '../../../Redux/Repositories/AuthRepo';
import { resetAuthState } from '../../../Redux/AuthRedux';
import { addSalesRoom, getSalesRooms, updateRooms } from '../../../Redux/Repositories/RoomsRepo';
import { resetRoomState } from '../../../Redux/RoomsRedux';
import permisstionsData from '../../../Data/PermissionsData';


export default function SupportPage() {
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({});
  const admins = useSelector((state) => state.auth.admins);
  const rooms = useSelector((state) => state.room.sales_room);
  const msg = useSelector((state) => state.auth.msg);
  const loading = useSelector((state) => state.auth.isFetching);
  const success = useSelector((state) => state.auth.success);
  const error = useSelector((state) => state.auth.error);
  const room_msg = useSelector((state) => state.room.msg);
  const room_loading = useSelector((state) => state.room.isFetching);
  const room_success = useSelector((state) => state.room.isSuccess);
  const room_error = useSelector((state) => state.room.error);
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showUpdateRoomForm, setShowUpdateRoomForm] = useState(false);
  const [room, setRoom] = useState(null);
  const [totalCapacity, setTotalCapacity] = useState(0);
  const [limitsInput, setLimitsInput] = useState({});

  useEffect(() => {
    dispatch(resetAuthState());
    dispatch(resetRoomState());

  }, []);

  useEffect(() => {
    getAllAdmins(dispatch);
    getSalesRooms(dispatch);
  }, [dispatch]);

  const handleForm = (e) => {
    setShowUpdateForm(!showUpdateForm);
    setAdminId(e);
  };

  const handleRoomForm = (e) => {
    setShowUpdateRoomForm(!showUpdateRoomForm);
    setRoom(e);
  };

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
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
  const handleClick = (e) => {
    e.preventDefault();
    const update = { ...inputs };
    updateAdmin(adminId, update, dispatch);
  };

  const handleRoomClick = (e) => {
    e.preventDefault();
    const update = { ...inputs, room_capacity: totalCapacity, account_limits:  limitsInput};
    updateRooms(room._id, update, dispatch);
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    const newAdmin = { ...inputs };
    addAdmin(newAdmin, dispatch);
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
   showAlert();
  };
  function showAlert() {
  const result = window.confirm("إضافة غرفة مبيعات جديدة سيؤدي إلى حذف غرفة المبيعات السابقة, هل أنت متأكد؟");
  if (result) {
          const permissions = {};
    permisstionsData.forEach((item) => {
        permissions[item.key] = true
    })
 const newRoom = { ...inputs, room_capacity: totalCapacity, account_limits:  limitsInput, permissions};
    addSalesRoom(newRoom, dispatch);  }
}
  return (
    <div className="supportPage">
      <h3>مدراء لوحة التحكم:</h3>
      <div className="adminsContainer">
        <ul className="adminsList">
          {admins.map((item) => (
            <li className="adminsItem" key={item._id}>
              {item.email}
              <span onClick={() => handleForm(item._id)}>تعديل</span>
            </li>
          ))}
        </ul>

        {showUpdateForm && (
          <div className="updateAdmin">
            <div className="addAdminItem">
              <label>كلمة المرور القديمة</label>
              <input name="old_pass" type="text" onChange={handleChange} />
            </div>
            <div className="addAdminItem">
              <label>كلمة المرور الجديدة</label>
              <input name="dashboard_password" type="text" onChange={handleChange} />
            </div>
            <button
              className="addAdminFormButton"
              onClick={handleClick}
              disabled={loading || success}
            >
              {loading ? 'بالانتظار...' : success ? 'تم التعديل' : 'تأكيد'}
            </button>
            <span style={{ color: 'red', fontSize: '12px' }}>{error && msg}</span>
          </div>
        )}
      </div>

      <div className="supportPageBottom">
        <button className="addAdminButton" onClick={() => setShowForm(!showForm)}>
          اضافة مدير لوحة تحكم
        </button>
        {showForm && (
          <div className="newAdminForm">
            <div className="addAdminItem">
              <label>البريد الإلكتروني</label>
              <input name="email" type="text" onChange={handleChange} />
            </div>
            <div className="addAdminItem">
              <label>كلمة المرور لوحة التحكم</label>
              <input name="dashboard_password" type="password" onChange={handleChange} />
            </div>
            <button className="addAdminFormButton" onClick={handleAddAdmin}>
              اضافة
            </button>
          </div>
        )}
      </div>

      <h3>غرفة المبيعات:</h3>
      <div className="adminsContainer">
      
        <ul className="adminsList">
          { rooms.map((room) => (
            <li className="adminsItem" key={room._id}>
              {room.room_name }
              <span onClick={() => handleRoomForm(room)}>تعديل </span>
            </li>
          ))
          }
          
        </ul>

        {showUpdateRoomForm && (
          <div className="updateRoom">
            <div className="addRoomItem">
              <label>اسم الغرفة</label>
              <input name="room_country" defaultValue={room.room_name} readOnly  type="text" value={inputs.room_country} />
            </div>
            <div className="addRoomItem">
              <label>كلمة المرور الغرفة</label>
              <input name="room_password" type="text" onChange={handleChange} />
            </div>
            <div className="addRoomItem">
              <label>كود الغرفة</label>
              <input name="room_code" type="text"  onChange={handleChange} />
            </div>
                <div className="addRoomItemLimits">
          <label>حد الحسابات</label>
          <div className="limits">
            <div className="addRoomItem">
            <label style={{'color': "purple"}}>Member</label>
            <input name="member" type="number" defaultValue={room['account_limits']['member']} onChange={handleLimits}/>
            </div>
              <div className="addRoomItem">
              <label style={{'color': "green"}}>Admin</label>
            <input name="admin" defaultValue={room['account_limits']['admin']} type="number" onChange={handleLimits}/>
              </div>
              <div className="addRoomItem">
               <label style={{'color': "blue"}}>Super Admin</label>
              <input name="super_admin" defaultValue={room['account_limits']['super_admin']} type="number" onChange={handleLimits}/>
              </div>
              <div className="addRoomItem">
              <label style={{'color': "red"}}>Master</label>
            <input name="master" defaultValue={room['account_limits']['master']} type="number" onChange={handleLimits}/>
              </div>
        
          </div>
        </div>
            <button
              className="addAdminFormButton"
              onClick={handleRoomClick}
              disabled={room_loading || room_success}
            >
              {room_loading ? 'بالانتظار...' : room_success ? 'تم التعديل' : 'تأكيد'}
            </button>
            <span style={{ color: 'red', fontSize: '12px' }}>{room_error && room_msg}</span>
          </div>
        )}
      </div>

      <div className="supportPageBottom">
        <button className="addRoomButton" onClick={() => setShowRoomForm(!showRoomForm)}>
          اضافة غرفة مبيعات
        </button>
        {showRoomForm && (
          <div className="newRoomForm">
            <div className="addRoomItem">
              <label>اسم الغرفة</label>
              <input name="room_name" type="text" onChange={handleChange} />
            </div>
            <div className="addRoomItem">
              <label>كلمة المرور الغرفة</label>
              <input name="room_password" type="password" onChange={handleChange} />
            </div>
            <div className="addRoomItem">
              <label>كود الغرفة</label>
              <input name="room_code" type="text" onChange={handleChange} />
            </div>
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
            <button className="addAdminFormButton" onClick={handleAddRoom}>
              {room_loading ? 'بالانتظار...' : room_success ? 'تم التعديل' : 'تأكيد'}
            </button>
            <span style={{ color: 'red', fontSize: '12px' }}>{room_error && room_msg}</span>

          </div>
        )}
      </div>
    </div>
  );
}

