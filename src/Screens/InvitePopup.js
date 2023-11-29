import React, { useState } from 'react';
import { RxCrossCircled } from 'react-icons/rx';

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

  // const popupStyle = {
  //   position: 'fixed',
  //   top: '35%',
  //   left: '50%',
  //   transform: 'translate(-50%, -50%)',
  //   backgroundColor: '#fff',
  //   padding: '20px',
  //   borderRadius: '10px',
  //   boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
  //   zIndex: 999, // Make sure it's on top
  //   background: '#394359',
  // };

  // const labelStyle = {
  //   display: 'block',
  //   marginBottom: '5px',
  //   color: 'white',
  // };

  // const inputStyle = {
  //   marginBottom: '10px',
  // };

  // const buttonStyle1 = {
  //   margin: '5px',
  //   marginTop: '30px',
  //   marginLeft: '50px',
  //   width: '50%',
  //   padding: '8px 20px',
  //   fontSize: '16px',
  //   backgroundColor: 'white',
  //   fontWeight: '600',
  //   color: '#394359',
  //   borderRadius: '10px',
  //   cursor: 'pointer',
  // };

  // const buttonStyle2 = {
  //   margin: '5px',
  //   marginTop: '30px',
  //   marginLeft: '26%',
  //   width: '50%',
  //   padding: '8px 20px',
  //   fontSize: '16px',
  //   backgroundColor: 'white',
  //   fontWeight: '600',
  //   color: '#394359',
  //   borderRadius: '10px',
  //   cursor: 'pointer',
  // };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full backdrop-filter backdrop-blur-md">
      <div className="bg-white p-8 rounded-lg shadow-lg z-50 max-w-md mx-auto">
      <div className='relative left-[360px]'>
      <button onClick={props.closePopup}>
            <RxCrossCircled />
          </button>
          </div>
        <h2 className="text-3xl font-bold text-center mb-4">Invite Users</h2>
        

        <label className="block mb-1 text-gray-700 text-sm">Email:</label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
          required
        />

        <label className="block mb-1 text-gray-700 text-sm">Role:</label>
        <select value={role} onChange={handleRoleChange} className='mb-2' required>
          <option value="">Select Role</option>
          <option value="Admin">Corporate Admin</option>
          <option value="Admin">Local Admin</option>
          <option value="User">User</option>
          {/* Add more roles as needed */}
        </select>

        <label className="block mb-1 text-gray-700 text-sm">Location:</label>
        <select value={location} onChange={handleLocationChange} className='mb-2' required>
          <option value="">Select Location</option>
          <option value="Location1">Location 1</option>
          <option value="Location2">Location 2</option>
          {/* Add more locations as needed */}
        </select>

        <div>
          <button onClick={handleInviteClick}  className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 text-sm">
            Invite
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default InvitePopup;
