// RolePopup.js
import React, { useState } from 'react';

function RolePopup({ closePopup }) {
  const [role, setRole] = useState('');

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!role.trim()) {
      alert('Please select a Role.');
      return;
    }

    alert(`Role submitted: ${role}`);
    // You can perform any necessary actions with the location value here
    // For example, you might want to send it to a server or update state
    closePopup();
  }

  const popupStyle = {
    position: "fixed",
    top: "35%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
    zIndex: 999,
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
  };

  const inputStyle = {
    marginBottom: "10px",
  };

  const buttonStyle1 = {
    margin: "5px",
    marginTop: '30px',
    marginLeft: "50px",
    width: "50%",
    padding: '8px 20px',
    fontSize: '16px',
    backgroundColor: "white",
    fontWeight: '600',
    color: '#394359',
    borderRadius: '10px',
    cursor: 'pointer',
  };

  const buttonStyle2 = {
    margin: "5px",
    marginTop: '30px',
    marginLeft: "26%",
    width: "50%",
    padding: '8px 20px',
    fontSize: '16px',
    backgroundColor: "white",
    fontWeight: '600',
    color: '#394359',
    borderRadius: '10px',
    cursor: 'pointer',
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
  };

  return (
    <div>
      <div style={popupStyle}>
        <h2 style={labelStyle}>Enter Role:</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" value={role} onChange={handleRoleChange} style={inputStyle} />
          <div style={buttonContainerStyle}>
            <button type="submit" style={buttonStyle1}>
              Submit
            </button>
            <button onClick={closePopup} style={buttonStyle2}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RolePopup;
