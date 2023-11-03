import React from 'react';
import { RxCrossCircled } from 'react-icons/rx';

const AccountDetails = ({ addressData, isExpanded, onToggleExpand, children }) => {
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

          <p><strong>Street Address:</strong> {addressData['Street Address'] || "null"}</p>
          <p><strong>City:</strong> {addressData['City'] || "null"}</p>
          <p><strong>State:</strong> {addressData['State'] || "null"}</p>
          <p><strong>ZIP Code:</strong> {addressData['ZIP Code'] || "null"}</p>
          {/* Add more details as needed */}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AccountDetails;
