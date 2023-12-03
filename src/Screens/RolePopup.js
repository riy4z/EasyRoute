import React, { useState, useEffect } from 'react';
import getCompanyID from '../components/getCompany';
import fetchRoles from '../components/fetchRoles';
import { RxCrossCircled } from 'react-icons/rx';

function RolePopup(props) {
  const [roles, setRoles] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newRole, setNewRole] = useState('');

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

  const handleAddRoleClick = () => {
    setShowInput(true);
  };

  const handleRoleChange = (e) => {
    setNewRole(e.target.value);
  };

  const handleAddRole = async () => {
    const companyid = getCompanyID();
    if (!newRole.trim()) {
      alert('Please enter a valid role.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/addRoles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Role: newRole, CompanyID: companyid }),
      });

      const result = await response.json();

      if (result.message) {
        setRoles([...roles, result.role]);
        setNewRole('');
        setShowInput(false);
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
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full backdrop-filter backdrop-blur-md">
    <div className="bg-white p-8 rounded-lg shadow-lg z-50 max-w-md mx-auto">
    <div className="absolute top-4 right-4 cursor-pointer">
          <button onClick={props.closePopup} className="text-gray-500 hover:text-gray-700">
            <RxCrossCircled />
          </button>
        </div>
        <h2 className="text-3xl font-bold text-center mb-4">Invite Users</h2>
        <hr className="my-4" />
        <h2 className="text-2xl font-semibold mb-4">Roles:</h2>
        <ul className="mb-4">
          {roles.map((role, index) => (
            <li key={index} className="text-gray-800">{role.Role}</li>
          ))}
        </ul>
        <div>
          {showInput && (
            <form onSubmit={handleSubmit} className="mb-4">
              <input
                type="text"
                value={newRole}
                onChange={handleRoleChange}
                className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddRole}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 text-sm"
              >
                Add Role
              </button>
            </form>
          )}
          {!showInput && (
            <button
              onClick={handleAddRoleClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 absolute rounded-md transition duration-300 text-sm"
            >
              Add Role
            </button>
          )}
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 text-sm"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
   
  );
}

export default RolePopup;
