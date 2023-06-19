import { useLocation } from "react-router-dom";
import "./Country.css";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCountry } from "../../../Redux/Repositories/CountriesRepo";
import { toast, ToastContainer } from 'react-toastify';
import { uploadFile } from "../../../Redux/Repositories/FileRepo";

export default function Country() {
    const location = useLocation();
    const countryId = location.pathname.split('/')[2];

    const country = useSelector((state)=> state.country.countries.find(s => s._id === countryId));
    const [inputs, setInputs] = useState({});
    const [file, setFile] = useState(null);
    const success = useSelector((state) => state.country.isSuccess);
    const loading = useSelector((state) => state.country.isFetching);
    const dispatch = useDispatch();
    const error = useSelector((state) => state.country.error);
    const msg = useSelector((state) => state.country.msg);


  useEffect(()=>{
    if(success){
      toast.success('تمت اضافة الدولة بنجاح')
    }
  }, [success]);


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
          const countryData = { ...inputs, img_url: file };
         updateCountry(country._id, countryData, dispatch);
  }
  return (
    <div className="country">
        <h1 className="countryTitle">{country.name_ar}</h1>
      <div className="countryTop">
          <div className="countryTopRight">
             <div className="countryInfoItem">
                      <span className="countryInfoKey"> :عدد الغرف</span>
                      <span className="countryInfoValue">{country.rooms_count}</span>
                  </div>
              <div className="countryInfoBottom">
                  <div className="countryInfoItem">
                      <span className="countryInfoKey"> :عدد المستخدمين</span>
                      <span className="countryInfoValue">{country.users_count}</span>
                  </div>
                      <div className="countryInfoItem">
                      <span className="countryInfoKey"> :رمز الدولة</span>
                      <div className="countryInfoValue">
                       <img className="countryImg" src={country.img_url} alt=""/>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div className="countryBottom">
          <form className="countryForm">
              <div className="countryFormLeft">
                  <label>تعديل الاسم</label>
                  <input name="name_ar" type="text" placeholder={country.title} onChange={handleChange}/>
              </div>
                <div className="countryFormRight">
             <label>تعديل الصورة </label>
              { file != null 
                      ? <img className="countryImg" src={file} alt=""/>
                      : <input type="file" id="file"  onChange={(e) => uploadImage(e.target.files[0], 1)} />}                  
                  </div>
          </form>
      </div>
      <div className="countryInfoItem">
            <button className="countryAddButton"  onClick={handleClick} disabled={loading || success} >{loading ? "بالانتظار..." : success ? "تم التعديل" : "تأكيد" }</button>
              <span style={{color: 'red', paddingTop: '15px'}}>{error && msg}</span>
              <ToastContainer />
      </div>

    </div>
  );
}