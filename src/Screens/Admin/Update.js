import React, { useState ,useEffect,useCallback } from 'react';
import api from '../../config/api';
import fetchLocations from '../../components/fetch/fetchLocations';
import fetchRoles from '../../components/fetch/fetchRoles';
import getCompanyID from "../../components/fetch/getCompany"

function UpdatePopup({ onSave, onCancel,UserDetails,updateData }) {
  console.log(updateData)
  const [role, setRole] = useState('');
  const [rolesFromServer, setRolesFromServer] = useState([]);
  const [locationsFromServer, setLocationsFromServer] = useState([]);
 
  const [userData, setUserData] = useState({
    location: '',
    role: '',
    // Add other fields as needed
  });
 
  const onUpdate = async(id,locationId,role) => {
 const response = await api.patch('/updateUserLocationRole/',{userId:id, locationId:locationId, newRoleHierarchy:role})
 onCancel();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(userData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locations = await fetchLocations();
        setLocationsFromServer(locations);
        const roles = await fetchRoles();
        setRolesFromServer(roles);
      } catch (error) {

      }
    };

    fetchData();
  }, []);

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const companyId = getCompanyID();
    
  if (!companyId) {
    console.error('Company ID is not available');
    return;
  }

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Update User</h2>
        <form onSubmit={handleSubmit}>
          <div className="ml-2">
            <label className="text-xl font-bold">Location:</label>
            <div>     
 <span className='text-xl'>
  {updateData.Location}
 </span>
  </div>
          </div>

          <label className="ml-2 text-xl font-bold">Role:</label>
         <select
  value={role}
  onChange={(event) => {
    handleRoleChange(event); 
    
  }}
  className="w-full p-1 text-xl border border-gray-300 rounded-md mb-3 focus:outline-none focus:border-blue-500"
  required
>
<option>{updateData.Role}</option>
{rolesFromServer
  .filter(rol => rol.Role !== updateData.Role && rol.RoleHierarchy !== 0)
  .map(rol => (
    <option key={rol.id} value={rol.RoleHierarchy}>
      {rol.Role}
    </option>
  ))}

</select>

          <div className="flex justify-end">
            <button type="button" onClick={onCancel} className="mr-2 bg-gray-300 hover:bg-gray-600 font-bold p-2 rounded-md">Cancel</button>
            <button type="button" onClick={() => {onUpdate(UserDetails._id, updateData._id, role)}} className="bg-blue-500 hover:bg-blue-800 font-bold p-2 rounded-md">Update</button>
           
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdatePopup;

