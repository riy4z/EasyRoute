import React, { useState } from 'react';

function InvitePopup(props) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleInviteClick = () => {
    if (!email || !role || !location) {
      alert('Please fill in all fields');
      return;
    }

    // Add your logic for inviting users with the entered data.
    // You can use the 'email', 'role', and 'location' state variables.
    console.log('Inviting user with the following data:', { email, role, location });

    // Reset the form fields
    setEmail('');
    setRole('');
    setLocation('');

    // Close the popup
    props.closePopup();
  };

  const popupStyle = {
    position: 'fixed',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
    zIndex: 999, // Make sure it's on top
    background: '#394359',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    color: 'white',
  };

  const inputStyle = {
    marginBottom: '10px',
  };

  const buttonStyle1 = {
    margin: '5px',
    marginTop: '30px',
    marginLeft: '50px',
    width: '50%',
    padding: '8px 20px',
    fontSize: '16px',
    backgroundColor: 'white',
    fontWeight: '600',
    color: '#394359',
    borderRadius: '10px',
    cursor: 'pointer',
  };

  const buttonStyle2 = {
    margin: '5px',
    marginTop: '30px',
    marginLeft: '26%',
    width: '50%',
    padding: '8px 20px',
    fontSize: '16px',
    backgroundColor: 'white',
    fontWeight: '600',
    color: '#394359',
    borderRadius: '10px',
    cursor: 'pointer',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
  };

  return (
    <div className="popup">
      <div style={popupStyle}>
        <h2 style={labelStyle}>Invite Users</h2>

        <label style={labelStyle}>Email:</label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
          required
        />

        <label style={labelStyle}>Role:</label>
        <select value={role} onChange={handleRoleChange} style={inputStyle} required>
          <option value="">Select Role</option>
          <option value="Admin">Corporate Admin</option>
          <option value="Admin">Local Admin</option>
          <option value="User">User</option>
          {/* Add more roles as needed */}
        </select>

        <label style={labelStyle}>Location:</label>
        <select value={location} onChange={handleLocationChange} style={inputStyle} required>
          <option value="">Select Location</option>
          <option value="Location1">Location 1</option>
          <option value="Location2">Location 2</option>
          {/* Add more locations as needed */}
        </select>

        <div style={buttonContainerStyle}>
          <button onClick={handleInviteClick} style={buttonStyle1}>
            Invite
          </button>
          <button onClick={props.closePopup} style={buttonStyle2}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvitePopup;
