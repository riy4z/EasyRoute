import React, { useState } from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import axios from 'axios';

const AccountDetails = ({ addressData, isExpanded, onToggleExpand, children }) => {
  // const [buttonStyle, setButtonStyle] = useState({
  //   backgroundColor: 'white',
  //   color: '#ff0000', // Text color
  //   borderColor: '#ff0000',
  //   borderRadius: 10,
  //   padding: '10px 115px',
  //   textAlign: 'center',
  //   textDecoration: 'none',
  //   display: 'inline-block',
  //   fontWeight: 600,
  //   position: 'absolute',
  //   fontSize: 16,
  //   cursor: 'pointer',
  //   top: 500,
  // });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    streetAddress: '',
    city: '',
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
  //   fontSize: 16,
  //   cursor: "pointer",
  //   top: 560,
  // };

  return (
    <div class={`${
      isExpanded ? 'opacity-100' : 'opacity-0'
    } fixed top-0 right-0 bg-white text-black w-[300px] h-full p-0 z-0 transition-opacity ease-out duration-700 `}
  >
      {/* style={{
        width: 300,
        height: '100%',
        backgroundColor: 'white',
        color: 'black',
        position: 'fixed',
        top: 0,
        right: 0,
        padding: 0,
        zIndex: 0,
        transition: 'opacity 0.6s ease',
        opacity: isExpanded ? 1 : 0,
        visibility: isExpanded ? 'visible' : 'hidden',
      }}
    > */}
      <div style={{ backgroundColor: "#282c34", padding:4}}>
        <h3 style={{ color: "white", marginLeft:7}}>
          Account Details
          <RxCrossCircled
            size={25}
            onClick={onToggleExpand}
            style={{ cursor: 'pointer', position: "absolute", right: 12, top: 16 }}
          />
        </h3>
      </div>

      <div style={{ display: isExpanded ? 'block' : 'none' }}>
        <div style={{ margin: '10px' }}>
          {/* Display account details */}
          <p style={{ fontSize: "14px" }}>
            <strong style={{fontSize:20}}> {addressData['First Name']} {addressData['Last Name']}</strong> <i className="fas fa-thin fa-pencil" style={{ marginRight: 25, cursor:'pointer' }} /><br></br>
            {addressData['Street Address']},{addressData['City']},{addressData['State'] },{addressData['ZIP Code']}</p>

          {/* Input fields for user data */}
          
          <div>
             <label className="text-sm">Phone:</label>
             <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                type="number"
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