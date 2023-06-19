import { useEffect, useState } from "react";
import "./NewCountry.css";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addCountry } from "../../../Redux/Repositories/CountriesRepo";
import { uploadFile } from "../../../Redux/Repositories/FileRepo";


export default function NewCountry() {
  
  const [file, setFile] = useState(null);
  const [inputs, setInputs] = useState({});
  const dispatch = useDispatch();
  const success = useSelector((state) => state.country.isSuccess);
  const loading = useSelector((state) => state.country.isFetching);
  const error = useSelector((state)=> state.country.error);
  const msg = useSelector((state)=> state.country.msg);
  


  const handleChange = (e)=> {
    setInputs(prev => {
      return {...prev, [e.target.name]: e.target.value}
    })
  }
     const uploadImage = (file) => {
      const formData = new FormData();
      formData.append('image', file);
      uploadFile(formData).then((val) => {
        console.log(val)
        toast.success(val.msg)
        setFile(val.img_url)
      }).catch((err) => {
        toast.error(err)
      });
    };

  const handleClick = (e)=> {
    e.preventDefault();
        const Country = { ...inputs, img_url: file };
        addCountry(Country, dispatch);
  }

  return (
    <div className="newCountry">
      <h1 className="addCountryTitle">إضافة دولة</h1>
      <form className="addCountryForm">
       <div className="addCountryItem">
          <label>اسم الدولة</label>
          <input name="name_ar" type="text" onChange={handleChange} placeholder="Type your Country name" />
        </div>
            <div className="addCountryItem">
          <label>علم الدولة</label>
          { file != null 
          ? <img className="countryImg" src={file} alt=""/>
          : <input type="file" id="file"  onChange={(e) => uploadImage(e.target.files[0], 1)} />
      }
        </div>    
      </form>
      <div className="addCountryItem">
         <button className="addCountryButton" onClick={handleClick} disabled={loading || success}>{loading ? "بالانتظار..." : success ? "تم الرفع" : "تأكيد" }</button>
         <span style={{color: 'red', paddingTop: '15px'}}>{error && msg}</span>
              {success && toast.success('تمت اضافة الدولة بنجاح')}
              <ToastContainer />
              </div>
    </div>
  );
}