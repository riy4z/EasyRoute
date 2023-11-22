// Admin.js
import React, { useState } from 'react';
import InvitePopup from './InvitePopup';
import LocationPopup from './LocationPopup';
import RolePopup from './RolePopup'; 

function Admin() {
  const [isInvitePopupOpen, setInvitePopupOpen] = useState(false);
  const [isLocationPopupOpen, setLocationPopupOpen] = useState(false);
  const [isRolePopupOpen, setRolePopupOpen] = useState(false);

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

  const LocationStyle = "mt-6 relative bg-customColor1 rounded-lg text-white py-1.5 px-6 font-medium absolute cursor-pointer text-xl  ml-16";
  const RoleStyle = "mt-4 relative bg-customColor1 rounded-lg text-white py-1.5 px-6 font-medium absolute cursor-pointer text-xl  ml-20";
  const InviteUserStyle = "mt-4 relative bg-customColor1 rounded-lg text-white py-1.5 px-6 font-medium absolute cursor-pointer text-xl  ml-11";

  return (
    <div>
      <h1 className="text-5xl font-medium text-customColor1 text-left">Admin</h1> 

      <button className={LocationStyle} onClick={openLocationPopup}>
        <i className="fas fa-info-circle" style={{ marginRight: 10 }}></i>
        Location 
      </button>

      <button className={RoleStyle} onClick={openRolePopup}>
        <i className="fas fa-question-circle" style={{ marginRight: 10 }}></i>
        Role 
      </button>

      <button className={InviteUserStyle} onClick={openInvitePopup}>
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
    </div>
  );
}

export default Admin;
