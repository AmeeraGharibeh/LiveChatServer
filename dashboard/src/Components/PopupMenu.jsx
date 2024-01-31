import React, { useRef, useEffect } from 'react';

const PopupMenu = ({ isOpen, onClose, children }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`popup-menu ${isOpen ? 'open' : ''}`} ref={popupRef}>
      {children}
    </div>
  );
};

export default PopupMenu;
