// Admin.js
import React, { useState } from 'react';
import InvitePopup from '../InvitePopup';

function Admin() {
  const [isPopupOpen, setPopupOpen] = useState(false);

  const buttonStyle = {
    backgroundColor: '#0066ff',
    border: "none",
    borderRadius: 10,
    color: "white",
    padding: "10px 10px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontWeight: 600,
    position: "absolute",
    fontSize: "16px",
    cursor: "pointer",
    top: "160px"
  };

  const openPopup = () => {
    setPopupOpen(true);
  }

  const closePopup = () => {
    setPopupOpen(false);
  }

  return (
    <div>
      <h1 style={{ color: 'black' }}>Admin</h1>

      <button style={buttonStyle} onClick={openPopup}>
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
