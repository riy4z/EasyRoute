import React, { useState, useEffect } from 'react';
import InvitePopup from './InvitePopup';
import LocationPopup from './LocationPopup';
import RolePopup from './RolePopup';
import UserDetails from './UserDetails';
import getRoleHierarchy from '../../components/fetch/getRoleHierarchy';
import getCompanyID from '../../components/fetch/getCompany';
import { getUsersByCompany } from '../../components/fetch/getUsersByCompany'; 

function Admin() {
  const [isInvitePopupOpen, setInvitePopupOpen] = useState(false);
  const [isLocationPopupOpen, setLocationPopupOpen] = useState(false);
  const [isRolePopupOpen, setRolePopupOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const companyId = getCompanyID();
  const isCorpAdmin = getRoleHierarchy();
  const showAddButtons = isCorpAdmin;
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [showLocalAdmin, setShowLocalAdmin] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [isRoleOpen, setRoleOpen] = useState(false);
  const [isLocalAdminOpen, setLocalAdminOpen] = useState(false);
  const [isUsersOpen, setUsersOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (companyId) {
          const usersData = await getUsersByCompany(companyId);
          setUsers(usersData);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
  }, [companyId]);

  const openInvitePopup = () => setInvitePopupOpen(true);
  const closeInvitePopup = () => setInvitePopupOpen(false);

  const openLocationPopup = () => setLocationPopupOpen(true);
  const closeLocationPopup = () => setLocationPopupOpen(false);

  const openRolePopup = () => setRolePopupOpen(true);
  const closeRolePopup = () => setRolePopupOpen(false);

  const handleUserNameClick = (userName) => {
    setSelectedUserName(userName);
  };

  const toggleLocalAdmin = () => {
    setShowLocalAdmin(!showLocalAdmin);
    setLocalAdminOpen(!isLocalAdminOpen);
  };

  const toggleUsers = () => {
    setShowUsers(!showUsers);
    setUsersOpen(!isUsersOpen);
  };

  const toggleRole = () => {
    setRoleOpen(!isRoleOpen);
  };
  

  return (
    <div>
      <h1 className="text-5xl font-medium text-customColor1 text-left">Admin</h1>
  
      {showAddButtons === 0 && (
        <>
          <button className="mt-6 bg-blue-700 hover:bg-blue-900 rounded-lg text-white py-1.5 px-6 font-medium cursor-pointer text-xl ml-16" onClick={openLocationPopup}>
            <i className="fas fa-info-circle" style={{ marginRight: 10 }}></i>
            Location
          </button>
  
          <button className="mt-4 bg-blue-700 hover:bg-blue-900 rounded-lg text-white py-1.5 px-6 font-medium cursor-pointer text-xl ml-20" onClick={openRolePopup}>
            <i className="fas fa-solid fa-users" style={{ marginRight: 10 }}></i>
            Role
          </button>
        </>
      )}
  
      <button className="mt-4 bg-blue-700 hover:bg-blue-900 rounded-lg text-white py-1.5 px-6 font-medium cursor-pointer text-xl ml-11" onClick={openInvitePopup}>
        <i className="fas fa-user-plus" style={{ marginRight: 10 }}></i>
        Invite Users
      </button>
  
      
      <div className="mt-4 ml-11 text-2xl leading-loose">
        <div
          className="text-4x1 font-medium text-black text-semibold text-left cursor-pointor "
          onClick={toggleRole}
        >
          Current Users
          <i className={isRoleOpen ? "fas fa-chevron-up ml-2" : "fas fa-chevron-down ml-2 cursor-pointer"}></i>
        </div>
        {isRoleOpen && (
  <div>
    {isCorpAdmin === 0 && (
      <div
        className="text-customColor1 cursor-pointer flex items-center mt-2"
        onClick={toggleLocalAdmin}
      >
        Local Admin
        <i className={isLocalAdminOpen ? "fas fa-chevron-up ml-2" : "fas fa-chevron-down ml-2 cursor-pointer"}></i>
      </div>
    )}
    {showLocalAdmin && isCorpAdmin === 0 && (
      <div>
        <ul className="overflow-y-auto max-h-32 mt-2 border rounded-md p-2 ">
          {users
            .filter(user => user.RoleHierarchy === 1)
            .map(user => (
              <div key={user._id} onClick={() => handleUserNameClick(user.firstName)}>
                <p style={{ cursor: 'pointer' }}>{`${user.firstName} `}</p>
              </div>
            ))}
        </ul>
      </div>
    )}

    <div
      className="text-customColor1 cursor-pointer flex items-center mt-2"
      onClick={toggleUsers}
    >
      User
      <i className={isUsersOpen ? "fas fa-chevron-up ml-2" : "fas fa-chevron-down ml-2 cursor-pointer"}></i>
    </div>
    {showUsers && (
      <div>
        <ul className="overflow-y-auto max-h-32 mt-2 border rounded-md p-2 l">
          {(isCorpAdmin === 0 || isCorpAdmin === 1) && (
            users
              .filter(user => user.RoleHierarchy === 2)
              .map(user => (
                <div key={user._id} onClick={() => handleUserNameClick(user.firstName)}>
                  <p style={{ cursor: 'pointer' }}>{`${user.firstName} `}</p>
                </div>
              ))
          )}
        </ul>
      </div>
    )}
  </div>
)}

      </div>
  
      {isLocationPopupOpen && <LocationPopup closePopup={closeLocationPopup} />}
      {isRolePopupOpen && <RolePopup closePopup={closeRolePopup} />}
      {isInvitePopupOpen && <InvitePopup closePopup={closeInvitePopup} />}
  
      {selectedUserName && (
        <UserDetails userName={selectedUserName} 
        UserDetails={{
          _id:"65643d525b99a474bd4713ba",
          username:"riy4z",
          password:"$2b$10$6vm1h3mR6OIUXIySUI2Y6OPvKApzcGPy6wBQ5mtEIdyNI4Dt0GdTe",
          email:"shehnazrasheetha2@gmail.com",
          address:"haha",
          firstName:"Riyaz",
          lastName:"Ahamed",
          mobile:"hardcoded data for testing",
          CompanyID:"65644b1071ffc1cf2bcee6cf",
          RoleHierarchy:0}}  
        closePopup={() => setSelectedUserName(null)} />
      )}
    </div>
  );
  }
  
  export default Admin;