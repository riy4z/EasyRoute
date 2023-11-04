import React from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import axios from 'axios';

const AccountDetails = ({ addressData, isExpanded, onToggleExpand, children }) => {

  const handleDelete = () => {
    const confirmed = window.confirm('Are you sure you want to delete this information?');

    if (confirmed) {
      const updatedData = { ...addressData, isHidden: true }; // Mark isHidden as true

      axios.patch(`http://localhost:4000/api/update-address-data/${addressData._id}`, updatedData)
        .then(response => {
          // Handle success, update UI or show success message
          console.log('Document marked as isHidden:');
          // Close the screen
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
        opacity: isExpanded ? 1 : 0, // Adjusted opacity conditions
        visibility: isExpanded ? 'visible' : 'hidden', // Added visibility to avoid clicks when not expanded
      }}
    >
      <div style={{ backgroundColor: "#282c34", padding: 1 }}>
        <h3 style={{ color: "lightblue", margin: 15 }}>
          Account Details
          <RxCrossCircled
            size={25}
            onClick={onToggleExpand}
            style={{ cursor: 'pointer', position: "absolute", right: 10, top: 25 }} // Adjusted positioning
          />
        </h3>
      </div>

      <div style={{ display: isExpanded ? 'block' : 'none' }}>
        <div style={{ margin: '10px' }}>
          {/* Display account details */}
          <p><strong>Name:</strong> {addressData['First Name']} {addressData['Last Name']}</p>
          <p><strong>Street Address:</strong> {addressData['Street Address']}</p>
          <p><strong>City:</strong> {addressData['City']}</p>
          <p><strong>State:</strong> {addressData['State'] }</p>
          <p><strong>ZIP Code:</strong> {addressData['ZIP Code']}</p>
          {/* Add more details as needed */}
          <button onClick={handleDelete}>Delete</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AccountDetails;
