import React, { useState } from 'react';
import LogoutPopup from './LogoutPopup';

function Settings() {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const openPopup = () => {
    setPopupOpen(true);
  }

  const closePopup = () => {
    setPopupOpen(false);
  }

  const buttonStyle1 = "cursor-pointer bg-gray-200 rounded-lg px-8 py-1 text-red font-medium absolute mt-16 left-11 text-xl text-red-700"
  // {
  //   top:200,
  //   backgroundColor: 'red',
  //   border: "none", 
  //   padding: "10px 10px",
  //   textAlign: "center",
  //   textDecoration: "none",
  //   display: "inline-block",
  //   fontWeight: 600,
  //   position: "absolute",
  //   fontSize: "16px",
  //   cursor: "pointer",
  //   justifyContent:"center",
  //   left:"20px",
  // };
 
  return (
    <div>
      <h1 class="text-5xl font-medium text-customColor1 text-left ">Settings</h1>
      <p> <br></br></p>
      <span className='text-gray-500 '>Come back later? <button class={buttonStyle1} onClick={openPopup}>
        {/* <i className="fas fa-right-from-bracket" style={{ marginRight: 25}}></i> */}
          Logout Account
        </button></span>

        {isPopupOpen && (
        <LogoutPopup closePopup={closePopup} />
      )}
      
    </div>
  );
}

export default Settings;