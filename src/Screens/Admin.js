// Admin.js
import React, { useState } from 'react';
import InvitePopup from './InvitePopup';

function Admin() {
  const [isPopupOpen, setPopupOpen] = useState(false);

  const buttonStyle = "bg-customColor1 rounded-lg text-white py-1.5 px-6 font-medium absolute cursor-pointer text-xl top-32 ml-10"
  // {
  //   backgroundColor: '#0066ff',
  //   border: "none",
  //   borderRadius: 10,
  //   color: "white",
  //   padding: "10px 10px",
  //   textAlign: "center",
  //   textDecoration: "none",
  //   display: "inline-block",
  //   fontWeight: 600,
  //   position: "absolute",
  //   fontSize: "16px",
  //   cursor: "pointer",
  //   top: "160px"
  // };

  const openPopup = () => {
    setPopupOpen(true);
  }

  const closePopup = () => {
    setPopupOpen(false);
  }

  return (
    <div>
      <h1 class="text-5xl font-medium text-customColor1 text-left ">Admin</h1>

      <button class={buttonStyle} onClick={openPopup}>
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
