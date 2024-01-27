import React, { useEffect, useState } from 'react'
import { uploadFile } from '../../Redux/Repositories/FileRepo';
import { toast , ToastContainer} from 'react-toastify';
import './EmojiesPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { addEmojie, getEmojies } from '../../Redux/Repositories/EmojieRepo';
import { resetEmojieState } from '../../Redux/EmojieRedux';


function EmojiesPage() {
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const { isSuccess, isFetching, error, msg } = useSelector((state) => state.emojie);
  const emojies = useSelector((state) => state.emojie.emojies);
  const dispatch = useDispatch();

  useEffect(() => {
    getEmojies(dispatch);
  }, [dispatch]);

  useEffect(() => {
    dispatch(resetEmojieState());
  }, []);

  useEffect(() => {
    isSuccess && toast.success(msg);
    error && toast.error(error);
        dispatch(resetEmojieState());
  }, [isSuccess, error]);

const handleClick = async (e) => {
  e.preventDefault();
  const Emojie = { ...inputs, url: file };
  await addEmojie(Emojie, dispatch);

  setInputs({});
  setFile(null);
};


  const uploadImage = async (file) => {
    try {
      const response = await uploadFile(file, 'Emojies');
      if (response && response.msg && response.files && response.files.length > 0) {
        toast.success(response.msg);
        setFile(response.files[0].url);
      } else {
        toast.error("Invalid response data");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const groupedEmojies = emojies.reduce((acc, emojie) => {
    if (!acc[emojie.category]) {
      acc[emojie.category] = [];
    }
    acc[emojie.category].push(emojie);
    return acc;
  }, {});

  return (
    <>
      <ToastContainer />
      <div className='emojies'>
        <div className='emojiesTopContainer'>
          <h3 className="emojiesTopTitle">جميع الإيموجيات والسمايلات</h3>
          {file != null ? (
            <div className='emojie'>
              <img src={file} alt=""/>
              <label>التصنيف:</label>
              <input name="category" type="text" onChange={handleChange} placeholder='example: hearts' />
              <div className="addCountryItem">
         <button className="custom-button" onClick={handleClick} disabled={isFetching || isSuccess}>{isFetching ? "بالانتظار..." : isSuccess ? "تم الرفع" : "تأكيد" }</button>
         <span style={{color: 'red', paddingTop: '15px'}}>{error && msg}</span>
              </div>
            </div>
          ) : (
            <>
              <label htmlFor="file" className="custom-button">إضافة</label>
              <input className='upload-button' type="file" id="file" onChange={(e) => uploadImage(e.target.files[0], 1)} />
            </>
          )}
        </div>
        {Object.entries(groupedEmojies).map(([category, emojisInCategory]) => (
          <div key={category}>
            <h4>{category}</h4>
            <div className="emojies-list">
              {emojisInCategory.map((emoji) => (
                <img key={emoji.id} src={emoji.url} alt="" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default EmojiesPage;
