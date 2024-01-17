

  // UserDetails.js
import React, { useState, useEffect } from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import { getUsersByCompany } from '../../components/fetch/getUsersByCompany';
import getCompanyID from '../../components/fetch/getCompany';
import { getCompanyById } from '../../components/fetch/getCompanyById';
import { getRolesFromHierarchy } from '../../components/fetch/getRolesFromHierarchy';
import { getUserLocationsByUserId } from '../../components/fetch/getUserLocationsByUserId';
import fetchLocations from '../../components/fetch/fetchLocations'; 
import { MdEdit } from 'react-icons/md'; 

function UserDetails({ userName, closePopup }) {
  const [userDetails, setUserDetails] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [roleHierarchy, setRoleHierarchy] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userLocations, setUserLocations] = useState([]);
  const [locationName, setLocationName] = useState(null);
  const [companyLocations, setCompanyLocations] = useState([]);
  const [isLocationEditMode, setLocationEditMode] = useState(false);
  const [isRoleEditMode, setRoleEditMode] = useState(false);
  const [roles, setRoles] = useState([]); 

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const companyId = getCompanyID();
        const usersData = await getUsersByCompany(companyId);
        const user = usersData.find((userData) => userData.firstName === userName);

        if (user) {
          const fetchedCompanyDetails = await getCompanyById(companyId);
          setUserDetails(user);
          setCompanyDetails(fetchedCompanyDetails);
          setRoleHierarchy(user.RoleHierarchy);

          const rolesFromHierarchy = await getRolesFromHierarchy(user.RoleHierarchy);
          if (rolesFromHierarchy && rolesFromHierarchy.length > 0) {
            setRole(rolesFromHierarchy[0].Role);
            setRoles(rolesFromHierarchy.map((r) => r.Role)); 
          }

          setUserId(user._id);

          const locations = await getUserLocationsByUserId(user._id);
          setUserLocations(locations);

          const companyLocations = await fetchLocations();
          setCompanyLocations(companyLocations);

          const userLocation = locations.length > 0 ? locations[0].LocationID : null;
          const location = companyLocations.find((loc) => loc._id === userLocation);
          setLocationName(location ? location.Location : 'No location found');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [userName]);

  const labelStyle = { marginBottom: '5px' };

  const updateButtonClass =
    'absolute mt-6 left-2 border-2 border-indigo-500 px-[84px] py-2 rounded-lg text-indigo-500 text-xl shadow-sm text-center hover:bg-indigo-500 hover:text-white';

  const deleteButtonClass =
    'absolute mt-24 left-2 border-2 border-red-500 px-[88px] py-2 rounded-lg text-red-500 text-xl shadow-sm text-center hover:bg-red-500 hover:text-white';

    const handleEdit = (field) => {
      // Only allow editing for the specified field (role or location) when roleHierarchy is 0
      if (roleHierarchy === 0) {
        // Implement logic to handle editing for the specified field (role or location)
        if (field === 'location') {
          setLocationEditMode(true); // Enable edit mode for location
          setRoleEditMode(false); // Disable role edit mode
        } else if (field === 'role') {
          setRoleEditMode(true); // Enable role edit mode
          setLocationEditMode(false); // Disable location edit mode
        }
      } else {
        console.log(`User with roleHierarchy ${roleHierarchy} is not allowed to edit`);
      }
    };

  const handleLocationChange = (event) => {
    setLocationEditMode(false);
  };

  const handleRoleChange = (event) => {
    setRoleEditMode(false);
  };

  return (
    <div>
      <div className="fixed top-0 right-0 bg-white text-black w-[300px] h-full p-0 z-0 transition-opacity ease-out duration-700">
        <div style={{ backgroundColor: '#282c34', padding: 4 }}>
          <h3 style={{ color: 'white', marginLeft: 7 }}>
            User Details
            <RxCrossCircled
              size={25}
              onClick={closePopup}
              style={{ cursor: 'pointer', position: 'absolute', right: 12, top: 16 }}
            />
          </h3>
        </div>
        <div className="ml-2">
          {userDetails && companyDetails ? (
            <>
              <label style={labelStyle}>
                <strong>Name:</strong>
                <input
                  className="border border-gray-300 p-1 rounded"
                  type="text"
                  value={`${userDetails.firstName} ${userDetails.lastName}`}
                  readOnly
                />
              </label>
              <label style={labelStyle}>
  <strong>Location:</strong>
  <div className="input-container">
    <select
      value={locationName || 'No location found'}
      onChange={handleLocationChange}
      className="border border-gray-300 p-1 rounded"
    >
      <option value="">{locationName || 'No location found'}</option>
      {companyLocations.map((loc) => (
        <option key={loc._id} value={loc.Location}>
          {loc.Location}
        </option>
      ))}
    </select>
    <MdEdit size={20} className="edit-icon" onClick={() => handleEdit('location')} />
  </div>
</label>

<label style={labelStyle}>
  <strong>Role:</strong>
  <div className="input-container">
    <select
      value={role || 'No role found'}
      onChange={handleRoleChange}
      className="border border-gray-300 p-1 rounded"
    >
      {roles.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
    <MdEdit size={20} className="edit-icon" onClick={() => handleEdit('role')} />
  </div>
</label>

              <label style={labelStyle}>
                <strong>Company Name:</strong>
                <input
                  className="border border-gray-300 p-1 rounded"
                  type="text"
                  value={companyDetails.CompanyName}
                  readOnly
                />
              </label>
            </>
          ) : (
            <p>Loading user details...</p>
          )}
        </div>
        <button className={updateButtonClass}>Update User</button>
        <button className={deleteButtonClass}>Delete User</button>
      </div>
    </div>
  );
}

export default UserDetails;