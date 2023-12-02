import React, { useState, useEffect } from 'react';
import getCompanyID from '../components/getCompany';

function RolePopup({ closePopup }) {
  const [roles, setRoles] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newRole, setNewRole] = useState('');

  
  useEffect(() => {
    // Fetch roles from the server when the component mounts
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const companyid = getCompanyID();
    try {
      const response = await fetch(`http://localhost:4000/api/getRoles?companyid=${companyid}`);
      const rolesFromServer = await response.json();
      setRoles(rolesFromServer);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

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
      // Send the new role to the server to be saved
      const response = await fetch('http://localhost:4000/api/addRoles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Role: newRole, CompanyID: companyid }),
      });

      const result = await response.json();

      if (result.message) {
        // If the role is added successfully, update the roles state
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
    closePopup();
  };

  const popupStyle = {
    position: 'fixed',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
    zIndex: 999,
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
  };

  const inputStyle = {
    marginBottom: '10px',
  };

  const buttonStyle1 = {
    margin: '5px',
    marginTop: '30px',
    marginLeft: '50px',
    width: '50%',
    padding: '8px 20px',
    fontSize: '16px',
    backgroundColor: 'white',
    fontWeight: '600',
    color: '#394359',
    borderRadius: '10px',
    cursor: 'pointer',
  };

  const buttonStyle2 = {
    margin: '5px',
    marginTop: '30px',
    marginLeft: '26%',
    width: '50%',
    padding: '8px 20px',
    fontSize: '16px',
    backgroundColor: 'white',
    fontWeight: '600',
    color: '#394359',
    borderRadius: '10px',
    cursor: 'pointer',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
  };

  return (
    <div>
      <div style={popupStyle}>
        <h2 style={labelStyle}>Roles:</h2>
        <ul>
          {roles.map((role, index) => (
            <li key={index}>{role.Role}</li>
          ))}
        </ul>
        <div>
          {showInput && (
            <>
              <form onSubmit={handleSubmit}>
                <input type="text" value={newRole} onChange={handleRoleChange} style={inputStyle} />
                <button type="button" onClick={handleAddRole} style={buttonStyle1}>
                  Add Role
                </button>
              </form>
            </>
          )}
          {!showInput && (
            <button onClick={handleAddRoleClick} style={buttonStyle1}>
              Add Role
            </button>
          )}
          <div style={buttonContainerStyle}>
            <button type="submit" style={buttonStyle1} onClick={handleSubmit}>
              Submit
            </button>
            <button onClick={closePopup} style={buttonStyle2}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RolePopup;
