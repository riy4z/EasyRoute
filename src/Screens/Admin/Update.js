import React, { useState ,useEffect } from 'react';
import api from '../../config/api';
import fetchRoles from '../../components/fetch/fetchRoles';
import getCompanyID from "../../components/fetch/getCompany"

function UpdatePopup({ onSave, onCancel,UserDetails,updateData }) {
  console.log(updateData)
  const [role, setRole] = useState('');
  const [rolesFromServer, setRolesFromServer] = useState([]);
 
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
        <h2 className="text-xl font-semibold mb-5 text-center">Update User Location</h2>
        <form onSubmit={handleSubmit}>
          <div className="leading-none">
            <label className="text-lg font-semibold">Location:</label>
            <div className='flex text-gray-600'>     
 <span className='text-lg p-1'>
  {updateData.Location}
 </span>
  </div>
          </div>
<div className='leading-none '>
          <label className="text-lg font-semibold ">Role:</label>
          <div className='mt-2'>
         <select
  value={role}
  onChange={(event) => {
    handleRoleChange(event); 
    
  }}
  className="w-full px-1 text-xl border border-gray-300 rounded-md mb-3 focus:outline-none focus:border-blue-500"
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
</div>
</div>

          <div className="flex mt-2 text-lg justify-between items-center font-medium">
          <div onClick={() => {onUpdate(UserDetails._id, updateData._id, role)}} className="bg-blue-600 cursor-default py-1 px-6 text-white hover:bg-blue-700 px-4 rounded-md">Add</div>
            <div onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 px-4 py-1 rounded-md cursor-default">Cancel</div>
            
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdatePopup;

