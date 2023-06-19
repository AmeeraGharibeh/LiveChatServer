import './NewName.css'
import { toast, ToastContainer } from 'react-toastify';
import RadioGroup from '../../../Components/RadioGroup/RadioGroup';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DropdownMenu from '../../../Components/DropdownMenu';





export default function NewName() {

  const [selectedOption, setSelectedOption] = useState('');
  const rooms = useSelector((state)=> state.room.rooms);
  const [inputs, setInputs] = useState({});
  const [room, setRoom] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  useEffect(()=>{
    setRoom(rooms[0])
  }, []);

const handleDropdownRooms = (value) => {
  setRoom(value);
    };

const handleChange = (e)=> {
    setInputs(prev => {
      return {...prev, [e.target.name]: e.target.value}
    })
  }
  const options = [
    { value: 'royal', label: 'اسم ملكي' },
    { value: 'protected', label: 'اسم محمي' },
  ];

  return (
    <div className='newName'>
        <h1 className="addNameTitle">إضافة اسم</h1>
        <form className="addNameForm">
             <div className="addNameItem">
          <label>الاسم</label>
          <input name="username" type="text" onChange={handleChange}/>
        </div>
        <div className="addNameItem">
          <label>كلمة مرور الغرفة</label>
          <input name="room_password" type="password"  onChange={handleChange}/>
        </div>
        <div className="addNameItem">
          <label>نوع الاسم</label>
          <RadioGroup
        options={options}
        selectedOption={selectedOption}
        onChange={handleOptionChange}
      />
          </div>
        <div className="addNameItem">
          <label>كلمة مرور الاسم</label>
          <input name="name_password" type="password" onChange={handleChange}/>
        </div>
        <div className="addNameItem">
          <label>الغرفة</label>
        <DropdownMenu className="dropdown" options={rooms} value = {'room_name'} default = {room} onDropdownChange={handleDropdownRooms}/>
        </div>
        <div className="addNameItem">
          <label>تاريخ الانتهاء</label>
          <input name="name" type="text" />
        </div>
        </form>
      <div className="addNameItem">
         <button className="addNameButton" >تأكيد</button>
         
              <ToastContainer />
              </div>
    </div>
  )
}
