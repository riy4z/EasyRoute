import React, { useState } from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import axios from 'axios';

const AccountDetails = ({ addressData, isExpanded, onToggleExpand, children }) => {
  const [buttonStyle, setButtonStyle] = useState({
    backgroundColor: 'white',
    color: '#ff0000', // Text color
    borderColor: '#ff0000',
    borderRadius: 10,
    padding: '10px 115px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontWeight: 600,
    position: 'absolute',
    fontSize: 16,
    cursor: 'pointer',
    top: 500,
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    streetAddress: '',
    city: '',
  });

  const handleMouseEnter = () => {
    setButtonStyle({
      ...buttonStyle,
      backgroundColor: '#ff0000', // Change the background color to red on hover
      color: 'white', // Change the text color to black on hover
    });
  };

  const handleMouseLeave = () => {
    setButtonStyle({
      ...buttonStyle,
      backgroundColor: 'white', // Revert the background color on leave
      color: '#ff0000', // Revert the text color on leave
    });
  };

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

  const buttonStyle1 = {
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
    fontSize: 16,
    cursor: "pointer",
    top: 560,
  };

  return (
    <div
      style={{
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
    >
      <div style={{ backgroundColor: "#282c34", padding: 1 }}>
        <h3 style={{ color: "white", margin: 15 }}>
          Account Details
          <RxCrossCircled
            size={25}
            onClick={onToggleExpand}
            style={{ cursor: 'pointer', position: "absolute", right: 10, top: 25 }}
          />
        </h3>
      </div>

      <div style={{ display: isExpanded ? 'block' : 'none' }}>
        <div style={{ margin: '10px' }}>
          {/* Display account details */}
          <p style={{ fontSize: "14px" }}>
            <strong> {addressData['First Name']} {addressData['Last Name']}</strong> <i className="fas fa-thin fa-pencil" style={{ marginRight: 25 }} /><br></br>
            {addressData['Street Address']},{addressData['City']},{addressData['State'] },{addressData['ZIP Code']}</p>

          {/* Input fields for user data */}
          
          <div>
            <label style={{fontSize:14}}>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label style={{fontSize:14}}>Email:</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label style={{fontSize:14}}>last Check-in:</label>
            <input
              type="text"
              name="lastCheckIn"
              value={formData.lastCheckIn}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label style={{fontSize:14}}>Follow Up:</label>
            <input
              type="text"
              name="followUp"
              value={formData.followUp}
              onChange={handleInputChange}
            />
          </div>
          

          <button
            style={buttonStyle}
            onClick={handleDelete}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Delete
          </button>

          {/* Add two more buttons */}
          <button
            style={buttonStyle1}
            onClick={() => {
              // Handle the action for the first additional button
              alert('Button 1 clicked');
            }}
          >
            Add to Route
          </button>
          <button
            style={{
              ...buttonStyle1,
              top: 560,
              right: 10, // Adjust the top and right positions for the second additional button
            }}
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