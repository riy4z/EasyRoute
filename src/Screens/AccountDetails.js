import React, { useState } from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import axios from 'axios';

const AccountDetails = ({ addressData, isExpanded, onToggleExpand, children }) => {
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    lastCheckIn: '',
    followUp: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDelete = () => {
    const confirmed = window.confirm('Are you sure you want to delete this information?');

    if (confirmed) {
      const updatedData = { ...addressData, isHidden: true };

      axios
        .patch(`http://localhost:4000/api/update-address-data/${addressData._id}`, updatedData)
        .then((response) => {
          console.log('Document marked as isHidden:');
          onToggleExpand();
          alert('Information deleted successfully.');
        })
        .catch((error) => {
          console.error('Error deleting information:', error);
          alert('Failed to delete information.');
        });
    }
  };

  return (
    <div className={`transition-opacity ease-out duration-700 fixed top-0 right-0 bg-white text-black w-[300px] h-full p-0 ${
      isExpanded ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="bg-customColor1 text-white py-4 px-4">
        <h3 className="text-2xl font-bold">Account Details</h3>
        <RxCrossCircled
          size={25}
          onClick={onToggleExpand}
          className="cursor-pointer absolute right-4 top-4"
        />
      </div>

      <div style={{ display: isExpanded ? 'block' : 'none' }}>
        <div className="m-2">
          <p className="text-lg font-semibold mb-4">
            {addressData['First Name']} {addressData['Last Name']}
          </p>
          <p className="text-sm mb-2">
            {addressData['Street Address']}, {addressData['City']}, {addressData['State']},{' '}
            {addressData['ZIP Code']}
          </p>

          {/* Input fields for user data */}
          <div className="mb-2">
            <label className="text-sm">Phone:</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              type="number"
              className="w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-2">
            <label className="text-sm">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-2">
            <label className="text-sm">Last Check-in:</label>
            <input
              type="text"
              name="lastCheckIn"
              value={formData.lastCheckIn}
              onChange={handleInputChange}
              className="w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-2">
            <label className="text-sm">Follow Up:</label>
            <input
              type="text"
              name="followUp"
              value={formData.followUp}
              onChange={handleInputChange}
              className="w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Buttons */}
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-md transition duration-300 text-sm mb-2"
            onClick={() => alert('Add to Route clicked')}
          >
            Add to Route
          </button>
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-md transition duration-300 text-sm mb-2"
            onClick={() => alert('Check-in clicked')}
          >
            Check-in
          </button>
          <button
            className="border-2 border-red-600 w-full py-1 rounded-lg text-red-600 text-xl text-center hover:bg-red-600 hover:text-white mb-4"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AccountDetails;
