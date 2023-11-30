// Admin.js
import React, { useState } from 'react';
import InvitePopup from './InvitePopup';
import LocationPopup from './LocationPopup';
import RolePopup from './RolePopup';
import UserDetails from './UserDetails'; // Import UserDetails component
import userDetails from '../userdetails.json';

function Admin() {
  const [isInvitePopupOpen, setInvitePopupOpen] = useState(false);
  const [isLocationPopupOpen, setLocationPopupOpen] = useState(false);
  const [isRolePopupOpen, setRolePopupOpen] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState(null); // Track selected user name

  const openInvitePopup = () => {
    setInvitePopupOpen(true);
  }

  const closeInvitePopup = () => {
    setInvitePopupOpen(false);
  }

  const openLocationPopup = () => {
    setLocationPopupOpen(true);
  }

  const closeLocationPopup = () => {
    setLocationPopupOpen(false);
  }

  const openRolePopup = () => {
    setRolePopupOpen(true);
  }

  const closeRolePopup = () => {
    setRolePopupOpen(false);
  }

  const openUserDetails = (userName) => {
    setSelectedUserName(userName);
  }

  const closeUserDetails = () => {
    setSelectedUserName(null);
  }

  return (
    <div>
      <h1 className="text-5xl font-medium text-customColor1 text-left">Admin</h1>

      <button className="mt-6 bg-customColor1 rounded-lg text-white py-1.5 px-6 font-medium cursor-pointer text-xl ml-16" onClick={openLocationPopup}>
        <i className="fas fa-info-circle" style={{ marginRight: 10 }}></i>
        Location
      </button>

      <button className="mt-4 bg-customColor1 rounded-lg text-white py-1.5 px-6 font-medium cursor-pointer text-xl ml-20" onClick={openRolePopup}>
        <i className="fas fa-question-circle" style={{ marginRight: 10 }}></i>
        Role
      </button>

      <button className="mt-4 bg-customColor1 rounded-lg text-white py-1.5 px-6 font-medium cursor-pointer text-xl ml-11" onClick={openInvitePopup}>
        <i className="fas fa-user-plus" style={{ marginRight: 10 }}></i>
        Invite Users
      </button>

      {/* Render the Location Popup if isLocationPopupOpen is true */}
      {isLocationPopupOpen && (
        <LocationPopup closePopup={closeLocationPopup} />
      )}

      {/* Render the Role Popup if isRolePopupOpen is true */}
      {isRolePopupOpen && (
        <RolePopup closePopup={closeRolePopup} />
      )}

      {/* Render the Invite Users popup if isInvitePopupOpen is true */}
      {isInvitePopupOpen && (
        <InvitePopup closePopup={closeInvitePopup} />
      )}

      {/* Render UserDetails component if a user is selected */}
      {selectedUserName && (
        <UserDetails userName={selectedUserName} closePopup={closeUserDetails} />
      )}

      <div className="mt-24">
        {/* Render the user names as a list */}
        <h2><strong>Current Users:</strong></h2>
        <ul className="overflow-y-scroll h-32 mt-4">
          {userDetails.map((user, index) => (
            <li key={index} className="cursor-pointer border-b-2" onClick={() => openUserDetails(user.Name)}>
              {user.Name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Admin;
