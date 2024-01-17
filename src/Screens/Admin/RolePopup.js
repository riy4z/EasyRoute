import React, { useState, useEffect } from 'react';
import getCompanyID from '../../components/fetch/getCompany';
import fetchRoles from '../../components/fetch/fetchRoles';
import { RxCrossCircled } from 'react-icons/rx';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../config/api';

function RolePopup(props) {
  const [roles, setRoles] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const rolesFromServer = await fetchRoles();
        setRoles(rolesFromServer);
      } catch (error) {
        // Handle the error as needed
      }
    };

    fetchRole();
  }, []);

  const handleCheckboxChange = (e) => {
    setIsAdmin(e.target.checked);
  };

  const handleAddRoleClick = () => {
    setShowInput(true);
  };

  const handleRoleChange = (e) => {
    setNewRole(e.target.value);
  };

  const handleAddRole = async () => {
    const companyid = getCompanyID();
    const roleHierarchy = isAdmin ? 1 : 2;
    
    if (!newRole.trim()) {
      alert('Please enter a valid role.');
      return;
    }
  
    try {
      const response = await api.post('/addRoles', {
        Role: newRole,
        CompanyID: companyid,
        RoleHierarchy: roleHierarchy,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const result = response.data;
  
      if (result.message) {
        setRoles([...roles, result.role]);
        setNewRole('');
        setShowInput(false);
        // Show a success toast notification
        toast.success('Role added successfully');
      } else {
        alert(result.error || 'Error adding role');
      }
    } catch (error) {
      console.error('Error adding role:', error);
      alert('Error adding role');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (roles.length === 0) {
      alert('Please add at least one role.');
      return;
    }

    alert(`Roles submitted: ${roles.map((role) => role.Role).join(', ')}`);
    props.closePopup();
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full backdrop-filter backdrop-blur-md">
        <div className="bg-white p-8 rounded-lg shadow-lg z-50 max-w-md mx-auto">
          <div className="flex justify-end">
            <button onClick={props.closePopup} className="text-gray-500 hover:text-gray-700">
              <RxCrossCircled />
            </button>
          </div>
          <h2 className="text-3xl font-bold text-center mb-4">Roles</h2>
          <hr className="my-4" />
          <ul>
            {roles.map((role, index) => (
              <li key={index} className="text-gray-800">
                {role.Role}
              </li>
            ))}
          </ul>
          <div>
            {showInput && (
              <form onSubmit={handleSubmit} className="mb-4">
                <input
                  type="text"
                  value={newRole}
                  onChange={handleRoleChange}
                  className="w-full p-1 border border-gray-300 rounded-md mb-3 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="checkbox"
                  id="isAdmin"
                  name="isAdmin"
                  checked={isAdmin}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="isAdmin">Admin</label>
                <div>
                  <button
                    type="button"
                    onClick={handleAddRole}
                    className="border border-black text-black bg-blue-500 hover:bg-blue-500 hover:text-white hover:border-none font-bold py-2 px-4 rounded-md transition duration-300 text-sm"
                  >
                    Add Role
                  </button>
                </div>
              </form>
            )}
            {!showInput && (
              <button
                onClick={handleAddRoleClick}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 text-sm"
              >
                Add Role
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RolePopup;
