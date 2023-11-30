// UserDetails.js
import React from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import userDetails from '../userdetails.json'; // Import userDetails

function UserDetails({ userName, closePopup }) {
  // Find the user details based on the selected userName
  const user = userDetails.find(user => user.Name === userName);

  if (!user) {
    return null; // Handle the case where the user is not found
  }

  const labelStyle = { marginBottom: "5px" };
  const updatebutton="absolute mt-6 left-2 border-2 border-indigo-500 px-[84px] py-2 rounded-lg text-indigo-500 text-xl shadow-sm text-center hover:bg-indigo-500 hover:text-white"
  const deletebutton="absolute mt-24 left-2 border-2 border-red-500 px-[88px] py-2 rounded-lg text-red-500 text-xl shadow-sm text-center hover:bg-red-500 hover:text-white"

  return (
    <div>
      <div className="fixed top-0 right-0 bg-white text-black w-[300px] h-full p-0 z-0 transition-opacity ease-out duration-700">
        <div style={{ backgroundColor: "#282c34", padding: 4 }}>
          <h3 style={{ color: "white", marginLeft: 7 }}>
            User Details
            <RxCrossCircled
              size={25}
              onClick={closePopup}
              style={{ cursor: 'pointer', position: "absolute", right: 12, top: 16 }}
            />
          </h3>
        </div>
        <div className="ml-2">
        <p style={labelStyle}><strong>Name:</strong> </p>
        <p>{user.Name}</p>
        <p style={labelStyle}><strong>Location:</strong></p>
        <p>{user.Location}</p>
        <p style={labelStyle}><strong>Role:</strong></p>
        <p>{user.Role}</p>
        <p style={labelStyle}><strong>Company Name:</strong></p>
        <p>{user.CompanyName}</p>
        </div>
        <button className={updatebutton}>Update User</button>
      <button className={deletebutton}>Delete User</button>
      </div>
      
    </div>
  );
}

export default UserDetails;
