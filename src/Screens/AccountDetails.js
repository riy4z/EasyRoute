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

  // const handleMouseEnter = () => {
  //   setButtonStyle({
  //     ...buttonStyle,
  //     backgroundColor: '#ff0000', // Change the background color to red on hover
  //     color: 'white', // Change the text color to black on hover
  //   });
  // };

  // const handleMouseLeave = () => {
  //   setButtonStyle({
  //     ...buttonStyle,
  //     backgroundColor: 'white', // Revert the background color on leave
  //     color: '#ff0000', // Revert the text color on leave
  //   });
  // };



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

      axios.patch(`http://localhost:4000/api/update-address-data/${addressData._id}`, updatedData)
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

  const buttonStyle1 = "bg-blue-600 rounded-lg text-white py-1 px-2 text-center font-medium absolute text-xl cursor-pointer bottom-64 left-2"
  const buttonStyle2 = "bg-blue-600 rounded-lg text-white py-1 px-2 text-center font-medium absolute text-xl cursor-pointer bottom-64 right-2.5"
 
  return (
    <div className={`${
      isExpanded ? 'opacity-100' : 'opacity-0'
    } fixed top-0 right-0 bg-white text-black w-[300px] h-full p-0 z-0 transition-opacity ease-out duration-700 `}
  >
      <div className="bg-customColor1 text-white py-4 px-3">
        <h3 className="text-2xl font-normal">
          Account Details
          <RxCrossCircled
            size={25}
            onClick={onToggleExpand}
            className="cursor-pointer absolute right-4 top-5"
          />
        </h3>
      </div>

      <div className={`${isExpanded ? 'block' : 'none' }`}>
        <div className="m-2">
          {/* Display account details */}
          <p className="text-lg font-semibold mb-4">
            {addressData['First Name']} {addressData['Last Name']}
          </p>
          <p className="text-sm mb-2">
            {addressData['Street Address']}, {addressData['City']}, {addressData['State']},{' '}
            {addressData['ZIP Code']}
          </p>

          
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
              className=" w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-2">
            <label className="text-sm">last Check-in:</label>
            <input
              type="text"
              name="lastCheckIn"
              value={formData.lastCheckIn}
              onChange={handleInputChange}
              className=" w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-2">
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
            className={buttonStyle}
            onClick={handleDelete}
            // onMouseEnter={handleMouseEnter}
            // onMouseLeave={handleMouseLeave}
          >
            Delete
          </button>

          {/* Add two more buttons */}
          <button
            className={buttonStyle1}
            onClick={() => {
              // Handle the action for the first additional button
              alert('Add to Route clicked');
            }}
          >
            Add to Route
          </button>
          <button
            className={buttonStyle2}
            onClick={() => {
              // Handle the action for the second additional button
              alert('Check-in clicked');
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