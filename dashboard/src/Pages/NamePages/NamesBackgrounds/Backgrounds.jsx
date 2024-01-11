import './Backgrounds.css'
import { uploadFile } from '../../../Redux/Repositories/FileRepo';
import { toast , ToastContainer} from 'react-toastify';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getImages } from '../../../Redux/Repositories/ImagesRepo';
import ImageList from '../../../Components/ListBox/ListBox';

export default function Backgrounds() {
  const dispatch = useDispatch();
    const images = useSelector((state)=> state.image.images);
  const [vipImages, setVipImages] = useState([]);
  const [backgroundImages, setBackgroundImages] = useState([]);

      useEffect(()=> {
    getImages(dispatch, 'Backgrounds');
  }, [dispatch])

  useEffect(()=> {
    setVipImages(images.filter((img) => img.directory === 'VIP'))
    setBackgroundImages(images.filter((img) => img.directory === 'Backgrounds'))
  }, [images])


    const uploadImage = async (file, type) => {
  try {
    const t = type === 0 ? 'VIP' : 'Backgrounds';
    const response = await uploadFile(file, t);

    if (response && response.msg && response.files && response.files.length > 0) {
      toast.success(response.msg);
      console.log(response);
      if (type === 0) {
          setVipImages((prevImages) => [...prevImages, response.files[0]]);
        } else {
          setBackgroundImages((prevImages) => [...prevImages, response.files[0]]);
        }
    } else {
      toast.error("Invalid response data");
    }
  } catch (err) {
    toast.error(err.message);
  }
};
    return(
        <>
        <ToastContainer />
       <div className='backgrounds-layout'>           


  <div className='vip-backgrounds-container'>
    <div className='vip-background-header'>
        <label for="file1" class="custom-button">إضافة خلفية</label>
      <input type="file" id="file1" onChange={(e) => uploadImage(e.target.files[0], 0)} />
      <h3>VIP خلفيات</h3>
    </div>
    <ImageList items={vipImages}/>
  </div>

    <div className='backgrounds-container'>
    <div className='background-header'>
        <label for="file2" class="custom-button">إضافة خلفية</label>
      <input type="file" id="file2" onChange={(e) => uploadImage(e.target.files[0], 1)} />
      <h3>خلفيات الملكي</h3>
    </div>
    <ImageList items={backgroundImages}/>
  </div>
</div>
         </>
    )
}