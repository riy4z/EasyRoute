import React, { useState } from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import axios from 'axios';

const AccountDetails = ({ addressData, isExpanded, onToggleExpand, children }) => {

  const [formData, setFormData] = useState({
    streetAddress: '',
    city: '',
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
      
      axios.patch(`http://localhost:4000/api/update-address-data/:${addressData._id}`, updatedData)
        .then(response => {
          // Handle success, update UI or show success message
          console.log('Document marked as isHidden:');
          onToggleExpand();
          alert('Information deleted successfully.');
          // Perform additional actions as needed after successful deletion
        })
        .catch(error => {
          // Handle error
          console.error('Error deleting information:', error);
          alert('Failed to delete information.');
        });
    }
  };
  
  const buttonStyle="border-2 border-red-600 mt-6 w-full py-1 rounded-lg text-red-600 text-xl text-center hover:bg-red-600 hover:text-white"

  const buttonStyle1 = "bg-blue-600 rounded-lg text-white py-1 px-2 text-center font-medium text-xl cursor-pointer bottom-64 left-2"
  const buttonStyle2 = "bg-blue-600 rounded-lg text-white py-1 px-2 text-center font-medium text-xl cursor-pointer bottom-64 right-2.5"

  return (
    <div className={`${
      isExpanded ? 'opacity-100' : 'opacity-0'
    } fixed top-0 right-0 bg-white text-black w-[300px] h-full p-0 z-0 transition-opacity ease-out duration-700 `}
  >
      <div className='bg-customColor p-1.5'>
        <h3 className='text-white ml-1.5'>
          Account Details
          <RxCrossCircled
            size={25}
            onClick={onToggleExpand}
            style={{ cursor: 'pointer', position: "absolute", right: 12, top: 16 }}
          />
        </h3>
      </div>

      <div className={`${ isExpanded ? 'display-block' : 'display-none' }`}>
        <div className='m-2'>
          {/* Display account details */}
          <p style={{ fontSize: "14px" }}>
            <strong style={{fontSize:20}}> {addressData['First Name']} {addressData['Last Name']}</strong> <i className="fas fa-thin fa-pencil" style={{ marginRight: 25, cursor:'pointer' }} /><br></br>
            {addressData['Street Address']},{addressData['City']},{addressData['State'] },{addressData['ZIP Code']}</p>

          
          <div>
             <label className="text-sm">Phone:</label>
             <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                type="tel"
                pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                className="w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"   
              />
          </div>
          <div>
            <label className="text-sm">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className=" w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="text-sm">last Check-in:</label>
            <input
              type="text"
              name="lastCheckIn"
              value={formData.lastCheckIn}
              onChange={handleInputChange}
              className=" w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="text-sm">Follow Up:</label>
            <input
              type="text"
              name="followUp"
              value={formData.followUp}
              onChange={handleInputChange}
              className="w-full px-3  border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          

          <button
            class={buttonStyle}
            onClick={handleDelete}
            // onMouseEnter={handleMouseEnter}
            // onMouseLeave={handleMouseLeave}
          >
            Delete
          </button>

          {/* Add two more buttons */}
          <button
            class={buttonStyle1}
            onClick={() => {
              // Handle the action for the first additional button
              alert('Button 1 clicked');
            }}
          >
            Add to Route
          </button>
          <button
            class={buttonStyle2}
            onClick={() => {
              // Handle the action for the second additional button
              alert('Button 2 clicked');
            }}
          >
            Check-in
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AccountDetails;