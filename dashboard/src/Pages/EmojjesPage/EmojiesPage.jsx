import React, { useEffect, useRef, useState } from 'react'
import { uploadFile } from '../../Redux/Repositories/FileRepo';
import { toast , ToastContainer} from 'react-toastify';
import './EmojiesPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { addEmojie, deleteEmojie, getEmojies } from '../../Redux/Repositories/EmojieRepo';
import { resetEmojieState } from '../../Redux/EmojieRedux';


function EmojiesPage() {
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [showMenu, setShowMenu] = useState(false); 
  const [selectedEmoji, setSelectedEmoji] = useState(null); 
  const { isSuccess, isFetching, error, msg } = useSelector((state) => state.emojie);
  const emojies = useSelector((state) => state.emojie.emojies);

  const dispatch = useDispatch();

  const emojiRef = useRef();

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
  const Emojie = { category: selectedCategory.category, symbol: selectedCategory.symbol,  url: file };
  await addEmojie(Emojie, dispatch);

  setInputs({});
  setFile(null);
};

  
  const categoryMap = [
    {key: '1', category: 'Hands', symbol: '🤚'},
    {key: '2', category: 'Hearts', symbol: '🧡'},
    {key: '3', category: 'People', symbol: '🧑'},
    {key: '4', category: 'Faces', symbol: '🙂'},
    {key: '5', category: 'Other', symbol: '🎯'},
    {key: '6', category: 'Food', symbol: '🍉'},
    {key: '7', category: 'Animals', symbol: '🐕'},
  ]
  const [selectedCategory, setSelectedCategory] = useState(categoryMap[0]);

  const handleSelectChange = (event) => {
    const key = event.target.value;
    const category = categoryMap.find(item => item.key === key);
        console.log('category is ' + category.symbol)

    setSelectedCategory(category);
  };


   useEffect(() => {
        const closeDrophdown = e => {
            if (showMenu && !emojiRef.current.contains(e.target)) {
                        console.log('first')
                setShowMenu(false);
            }
        }
        document.body.addEventListener('mousedown', closeDrophdown)
        return () => document.body.removeEventListener('mousedown', closeDrophdown)
    }, [])




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

   const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
    setShowMenu(true);
  };

  const handleDelete = (id, type) => {
    deleteEmojie(id, type, dispatch)
    setShowMenu(false);
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
 <div >
    <select id='options' value={selectedCategory.key} onChange={handleSelectChange}>
  <option value="">اختر التصنيف</option>
  {categoryMap.map((item) => (
    <option key={item.key} value={item.key}>
      {`${item.symbol} ${item.category}`} 
    </option>
  ))}
</select>

    </div>              <div className="addCountryItem">
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
            <h4>{emojisInCategory[0].symbol} {category}</h4>
            <div ref={emojiRef} className="emojies-list">
          {emojisInCategory.map((emoji) => (
  <div key={emoji.id} className="emoji-wrapper" >
    <img  src={emoji.url} alt="" onClick={() => handleEmojiClick(emoji)} />
    {selectedEmoji === emoji && showMenu && (
      <div className="emoji-menu">
        <button onClick={() => handleDelete(emoji._id, 'id')}>حذف</button>
        <button onClick={() => handleDelete(emoji.category, 'category')}> حذف جميع إيموجيات {emoji.category}</button>
      </div>
    )}
  </div>
))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}


export default EmojiesPage;
