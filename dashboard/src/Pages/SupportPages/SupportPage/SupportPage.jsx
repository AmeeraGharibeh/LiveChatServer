import React, { useEffect, useState } from 'react'
import './SupportPage.css'
import { useDispatch, useSelector } from 'react-redux';
import { getAllAdmins, updateAdmin } from '../../../Redux/Repositories/AuthRepo';
import { resetAuthState } from '../../../Redux/AuthRedux';

export default function SupportPage() {

  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({});
  const admins = useSelector((state)=> state.auth.admins);
  const msg = useSelector(state => state.auth.msg);
  const loading = useSelector((state)=> state.auth.isFetching);
  const success = useSelector((state)=> state.auth.success);
  const error = useSelector((state) => state.auth.error);
  const [showForm, setShowForm] = useState(false); 
  const [showUpdateForm, setShowUpdateForm] = useState(false); 
  const [adminId, setAdminId] = useState(''); 


  useEffect(()=> {
    dispatch(resetAuthState())
  }, [])
  useEffect(()=> {
    getAllAdmins(dispatch);
  }, [dispatch]);

  const handleForm = (e)=> {
    setShowUpdateForm(!showUpdateForm);
    setAdminId(e);
    console.log(adminId)
  }
  const handleChange = (e)=> {
    setInputs(prev => {
      return {...prev, [e.target.name]: e.target.value}
    })
  }
  const handleClick = (e)=> {
    e.preventDefault();
    const update = { ...inputs};
    updateAdmin(adminId ,update, dispatch);
  }
  return (
    <div className='supportPage'>
      <h3>مدراء لوحة التحكم:</h3>
      <div className="adminsContainer">
      <ul className='adminsList'>
      {
      admins.map((item, index) => (
        <li className='adminsItem' key={item._id}>{item.email}
        <span onClick={()=> handleForm(item._id)}>تعديل</span>
        </li>
      )
      )
      }
    </ul>

    {showUpdateForm && 
        <div className="updateAdmin">
        <div className="addAdminItem">
          <label>كلمة المرور القديمة</label>
          <input name="old_pass" type="text" onChange={handleChange}/>
        </div>
          <div className="addAdminItem">
          <label>كلمة المرور الجديدة</label>
          <input name="dashboard_password" type="text" onChange={handleChange}/>
        </div>
        <button className='addAdminFormButton' onClick={handleClick} disabled={loading || success} >{loading ? "بالانتظار..." : success ? "تم التعديل" : "تأكيد" }</button>
        <span style={{color: 'red', fontSize: '12px'}}>{error && msg}</span>
    </div>
        }
      </div>
      <div className="supportPageBottom">
        <button className='addAdminButton' onClick={() => setShowForm(!showForm)}>اضافة مدير لوحة تحكم</button>
        {showForm && <div className="newAdminForm">
          <div className="addAdminItem">
          <label>البريد الإلكتروني</label>
          <input name="email" type="text" />
        </div>
        <div className="addAdminItem">
          <label>كلمة المرور لوحة التحكم</label>
          <input name="dashboard_password" type="password" />
        </div>
          <button className='addAdminFormButton' >اضافة</button>

        </div>
}

      </div>
    </div>
  )
}
