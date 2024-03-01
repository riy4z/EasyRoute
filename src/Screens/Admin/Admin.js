import React, { useState, useEffect } from 'react';
import InvitePopup from './InvitePopup';
import UserDetails from './UserDetails';
import api from '../../config/api';
import { Toaster } from 'react-hot-toast';

import { getUsersByLocation } from '../../components/fetch/getUsersByLocation'; 

function Admin(props) {
  const [isInvitePopupOpen, setInvitePopupOpen] = useState(false);

  const [Role1, setRole1] = useState([])
  const [Role2, setRole2] = useState([])
  const [localAdmin, setLocalAdmin] = useState([]);
  const [users, setUsers] = useState([]);
  const isCorpAdmin=props.isCorpAdmin;
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [showLocalAdmin, setShowLocalAdmin] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [isRoleOpen, setRoleOpen] = useState(false);
  const [isLocalAdminOpen, setLocalAdminOpen] = useState(false);
  const [isUsersOpen, setUsersOpen] = useState(false);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (props.selectedLocation) {
          const usersData = await getUsersByLocation(props.selectedLocation);
          console.log(usersData);
  
          // Filter usersData based on RoleHierarchy
          const role1Users = usersData.filter(user => user.RoleHierarchy === 1);
          const role2Users = usersData.filter(user => user.RoleHierarchy === 2);
  
          // Update states
          setRole1(role1Users);
          setRole2(role2Users);
          console.log(role1Users)
          console.log(role2Users)
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchUsers();
  }, [props.selectedLocation, isRoleOpen]);

  useEffect(() => {
    const fetchRole1Users = async () => {
      try {
        const role1Details = await Promise.all(Role1.map(async user => {
          const response = await api.get(`/getUserById/${user.UserID}`);
          return response.data
        }));
        setLocalAdmin(role1Details);
      } catch (error) {
        console.error('Error fetching Role1 user details:', error);
      }
    };
  
    fetchRole1Users();
  }, [Role1]);



  useEffect(() => {
    const fetchRole2Users = async () => {
      try {
        const role2Details = await Promise.all(Role2.map(async user => {
          const response = await api.get(`/getUserById/${user.UserID}`);
          return response.data;
        }));

        setUsers(role2Details);
      } catch (error) {
        console.error('Error fetching Role2 user details:', error);
      }
    };
  
    fetchRole2Users();
  }, [Role2]);

  const openInvitePopup = () => setInvitePopupOpen(true);
  const closeInvitePopup = () => setInvitePopupOpen(false);



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
    setShowLocalAdmin(false)
    setShowUsers(false)
  };
  
console.log(users)
  return (
    <div>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <h1 className="text-5xl font-medium text-customColor1 text-left">Admin</h1>
  
  <div className='flex justify-center mt-6 '>
      <button className=" bg-blue-700 hover:bg-blue-900 rounded-lg text-white py-1.5 px-6 font-medium cursor-pointer text-xl border-" onClick={openInvitePopup}>
        <i className="fas fa-user-plus" style={{ marginRight: 10 }}></i>
        Invite Users
      </button>
      </div>
      <div className='flex pl-14 justify-start space-around border-t border-gray-200 my-3'>
      <div className="  mt-4 leading-loose">
        <div
          className="text-4x1 cursor-pointer font-medium text-black text-semibold text-left text-lg cursor-pointor hover:text-gray-600"
          onClick={toggleRole}
        >
          <i className={isRoleOpen ? "fas fa-chevron-down mr-2" : "fas fa-chevron-right mr-2 cursor-pointer"}></i>
          Current Users
        </div>
        {isRoleOpen && (
  <div>
    {isCorpAdmin === 0 && (
      <div
        className="text-customColor1 cursor-pointer flex items-center text-lg font-medium mt-2 ml-2 hover:text-gray-400"
        onClick={toggleLocalAdmin}
      >
        <i className={isLocalAdminOpen ? "fas fa-chevron-down mr-2" : "fas fa-chevron-right mr-2 cursor-pointer"}></i>
        Local Admin
      </div>
    )}
    {showLocalAdmin && isCorpAdmin === 0 && (
      <div>
        <ul className="overflow-y-auto  h-full ml-6 px-2 py-1">
          {localAdmin
            .map(localAdmin => (
              <div key={localAdmin._id} className='flex justify-start flex-row w-full' onClick={() => handleUserNameClick(localAdmin)}>
                <p className='cursor-pointer text-base hover:text-blue-400' >{`${localAdmin.firstName || ""} ${localAdmin.lastName || ""} `}
                <span className='cursor-pointer text-gray-400 text-sm' >{`(${localAdmin.username})`}</span></p>
              </div>
            ))}
            {(!localAdmin || localAdmin.length===0) &&(
              <div className='text-sm text-gray-400' >Local Admin not Found</div>
            )}
        </ul>
      </div>
    )}

    <div
      className="text-customColor1 cursor-pointer flex items-center mt-2 text-lg font-medium ml-2 hover:text-gray-400"
      onClick={toggleUsers}
    >
      <i className={isUsersOpen ? "fas fa-chevron-down mr-2" : "fas fa-chevron-right mr-2 cursor-pointer"}></i>
      User
    </div>
    {showUsers && (
      <div>
        <ul className="overflow-y-auto h-full ml-6 px-2 py-1">
          {(isCorpAdmin === 0 || isCorpAdmin === 1) && (
            users
              .map(user => (
                <div key={user._id} onClick={() => handleUserNameClick(user)}>
                  <p className='cursor-pointer text-base hover:text-blue-400' >{`${user.firstName} ${user.lastName} `}
                <span className='cursor-pointer text-gray-400 text-sm' >{`(${user.username})`}</span></p>
                </div>
              ))
          )}
          {(!users || users.length===0) &&(
              <div className='text-sm text-gray-400' >User not Found</div>
            )}
        </ul>
      </div>
    )}
  </div>
)}

      </div>
      </div>
    <div className="flex text-gray-400 text-sm p-1 h-full justify-center items-center mx-4 my-6">
              <p>ⓘ 
The admin page allows corporate and local administrators to manage users, including inviting new users and viewing existing ones categorized by roles and locations.</p>
              </div>
  
      {isInvitePopupOpen && <InvitePopup closePopup={closeInvitePopup} isCorpAdmin={isCorpAdmin}/>}
  
      {selectedUserName && (
        <UserDetails  
        UserDetails={selectedUserName}  
        closePopup={() => setSelectedUserName(null)} />
      )}
    </div>
  );
  }
  
  export default Admin;