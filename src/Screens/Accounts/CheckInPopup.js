import React, { useState } from 'react';
import { RxCrossCircled } from 'react-icons/rx';


const CheckInPopup = ({ isOpen, onClose, onCheckInSubmit }) => {
  const [textBoxValue, setTextBoxValue] = useState('');

  const handleInputChange = (e) => {
    setTextBoxValue(e.target.value);
  };

  const handleCheckInButtonClick = async () => {
    onCheckInSubmit(textBoxValue);
    setTextBoxValue("");
    onClose()
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-50 backdrop-filter backdrop-blur-md">
      <div className="bg-white p-8 rounded shadow-lg relative">
        <div className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>
          <RxCrossCircled className="text-2xl"/>
        </div>
        <h2 className="text-xl font-bold mb-4 text-center">Check-In</h2>
        <hr className="my-4" />
        <label className="block mb-4">
          Meeting Notes:
          <textarea
            className="border border-gray-400 p-2 w-full h-32"
            value={textBoxValue}
            onChange={handleInputChange}
          />
        </label>
        
        <button className="bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none focus:ring focus:border-green-700" onClick={handleCheckInButtonClick}>
          Create Check-In
        </button>
      </div>
    </div>
  );
};

export default CheckInPopup;
