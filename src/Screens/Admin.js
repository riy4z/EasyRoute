// Admin.js
import React, { useState } from 'react';
import InvitePopup from './InvitePopup';

function Admin() {
  const [isPopupOpen, setPopupOpen] = useState(false);
 

  const buttonStyle = "bg-customColor1 rounded-lg text-white py-1.5 px-6 font-medium absolute cursor-pointer text-xl bottom-96 ml-10";

  const openPopup = () => {
    setPopupOpen(true);
  }

  const closePopup = () => {
    setPopupOpen(false);
  }

  return (
    <div>
      <h1 className="text-5xl font-medium text-customColor1 text-left">Admin</h1> 

      <button className={buttonStyle} onClick={openPopup}>
        <i className="fas fa-user-plus" style={{ marginRight: 10 }}></i>
        Invite Users
      </button>

      {isPopupOpen && (
        <InvitePopup closePopup={closePopup} />
      )}
    </div>
  );
}

export default Admin;

