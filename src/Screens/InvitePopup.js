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

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full backdrop-filter backdrop-blur-md">
      <div className="bg-white p-8 rounded-lg shadow-lg z-50 max-w-md mx-auto">
        <div className="absolute top-4 right-4 cursor-pointer">
          <button onClick={props.closePopup} className="text-gray-500 hover:text-gray-700">
            <RxCrossCircled />
          </button>
        </div>
        <h2 className="text-3xl font-bold text-center mb-4">Invite Users</h2>

        <label className="block mb-2 text-gray-700 text-sm">Email:</label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
          required
          className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:border-blue-500"
        />

        <label className="block mb-2 text-gray-700 text-sm">Role:</label>
        <select
          value={role}
          onChange={handleRoleChange}
          className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:border-blue-500"
          required
        >
          <option value="">Select Role</option>
          <option value="Admin">Corporate Admin</option>
          <option value="LocalAdmin">Local Admin</option>
          <option value="User">User</option>
        </select>

        <label className="block mb-2 text-gray-700 text-sm">Location:</label>
        <select
          value={location}
          onChange={handleLocationChange}
          className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:border-blue-500"
          required
        >
          <option value="">Select Location</option>
          <option value="Location1">Location 1</option>
          <option value="Location2">Location 2</option>
        </select>

        <div className="flex justify-end">
          <button
            onClick={handleInviteClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 text-sm"
          >
            Invite
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvitePopup;
