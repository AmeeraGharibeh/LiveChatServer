import './NewRoot.css'
import { toast, ToastContainer } from 'react-toastify';

export default function NewRoot() {
  return (
    <div className='newRoot'>
        <h1 className="addRootTitle">إضافة روت</h1>
        <form className="addRootForm">
             <div className="addRootItem">
          <label>الاسم</label>
          <input name="name" type="text" />
        </div>
        <div className="addRootItem">
          <label>كلمة المرور</label>
          <input name="name" type="text" />
        </div>
        <div className="addRootItem">
          <label>الغرفة</label>
          <input name="name" type="text" />
        </div>
        <div className="addRootItem">
          <label>تاريخ الانتهاء</label>
          <input name="name" type="text" />
        </div>
        </form>
      <div className="addRootItem">
         <button className="addRootButton" >تأكيد</button>
              <ToastContainer />
              </div>
    </div>
  )
}
