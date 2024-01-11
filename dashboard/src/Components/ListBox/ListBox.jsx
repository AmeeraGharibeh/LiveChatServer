import React from 'react';

import { useDispatch } from 'react-redux';
import { deleteImage } from '../../Redux/Repositories/ImagesRepo';

const ImageList = ({ items }) => {

    const dispatch = useDispatch();

  function showAlert(id) {
  const result = window.confirm('هل أنت متأكد من حذف الصورة؟');
  if (result) {
    deleteImage(id ,dispatch,);
  }
}
  return (
    <div className='image-list-container'>
      {items.map((item) => (
        <div key={item._id} className="image-item-container">
          <div className="delete-container">
            <button
              className="delete-button"
              onClick={() => showAlert(item._id)}
            >
              &#x2715;
            </button>
          </div>
          <p>{item.label}</p>
          <img
            src={item.url}
            alt={`Image for ${item.directory}`}
            style={{ maxWidth: '100%', maxHeight: '200px', alignContent: 'center' }}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageList;
