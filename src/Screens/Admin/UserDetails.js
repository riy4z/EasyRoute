import React, { useState, useEffect, useCallback } from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import { getCompanyById } from '../../components/fetch/getCompanyById';
import { getUserLocationsByUserId, deleteUserLocation, addUserLocation } from '../../components/fetch/getUserLocationsByUserId';
import fetchLocations from '../../components/fetch/fetchLocations';
import api from '../../config/api';

function UserDetails({ UserDetails, closePopup }) {
  const [Roles, setRoles] = useState("");
  const [Company, setCompany] = useState("");
  const [Location, setLocation] = useState([]);
  const [newLocation, setNewLocation] = useState("");
  const [showAddLocationDropdown, setShowAddLocationDropdown] = useState(false);
  const [availableLocations, setAvailableLocations] = useState([]);
 


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/getRoles?companyid=${UserDetails.CompanyID}`);

        const userRoleHierarchy = UserDetails.RoleHierarchy;
        const userRole = response.data.find(role => role.RoleHierarchy === userRoleHierarchy);

        if (userRole) {
          setRoles(userRole.Role);
        } else {
          console.warn('User role not found in response data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      const company = await getCompanyById(UserDetails.CompanyID);
      setCompany(company.CompanyName);

      try {
        const userLocations = await getUserLocationsByUserId(UserDetails._id);

        if (userLocations.length > 0) {
          const allLocations = await fetchLocations();
          const fetchedLocations = [];

          for (const userLocation of userLocations) {
            const locationID = userLocation.LocationID;
            const location = allLocations.find(loc => loc._id === locationID);

            if (location) {
              fetchedLocations.push(location);
            } else {
              console.warn(`Location not found for ${locationID}`);
            }
          }

          setLocation(fetchedLocations);
        } else {
          console.warn('User has no locations');
        }
      } catch (error) {
        console.error('Error fetching user locations:', error);
      }
    };

    fetchUser();
  }, [UserDetails]);

  useEffect(() => {
    const fetchDropdown = async () => {
      try {
        const allLocations = await fetchLocations();
        const availableLocs = allLocations.filter(loc => !Location.find(selectedLoc => selectedLoc._id === loc._id));
        setAvailableLocations(availableLocs);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDropdown();
  }, [Location]);

  const toggleDropdown = useCallback(() => {
    setShowAddLocationDropdown(prevState => !prevState);
  }, []);

  const handleDropdownChangeAndAddLocation = async (selectedLocationValue) => {
    try {
      const selectedLocationOption = availableLocations.find(location => location.Location === selectedLocationValue);
  
      if (selectedLocationOption) {
        const selectedLocationId = selectedLocationOption._id;
        const confirmed = window.confirm(`Are you sure you want to add "${selectedLocationValue}" as a new location?`);
  
        if (confirmed) {
          const response = await addUserLocation(UserDetails._id, selectedLocationId);
          console.log('addUserLocation response:', response);
  
          setLocation(prevLocation => [...prevLocation, { _id: selectedLocationId, Location: selectedLocationValue }]);
          setNewLocation("");
        }
      } else {
        console.error("Error: Selected location not found.");
      }
    } catch (error) {
      console.error('Error handling dropdown change and adding location:', error);
    }
  };
 
  const handleDeleteLocation = useCallback(async (locationId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this location?');
    
      if (confirmDelete) {
      await deleteUserLocation(UserDetails._id, locationId);
      const updatedLocations = Location.filter((location) => location._id !== locationId);
      setLocation(updatedLocations);
    }} catch (error) {
      console.error('Error deleting location:', error);
    }
  }, [Location, UserDetails._id]);

  const labelStyle = 'mb-2 text-xl';

  const deleteButtonClass =
    'absolute mt-28 left-2 border-2 border-red-500 px-[88px] py-2 rounded-lg text-red-500 text-xl shadow-sm text-center hover:bg-red-500 hover:text-white';
  const locationButtonClass=
  'absolute mt-10 left-2 border-2 border-blue-700 px-20 py-2 rounded-lg text-blue-700 text-xl shadow-sm text-center hover:bg-blue-700 hover:text-white'
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
            {UserDetails ? (
              <>


                <label className={labelStyle}>
                  <strong>Name:</strong>
                  <p
                    className="text-xl text-black">
                    {`${UserDetails.firstName} ${UserDetails.lastName}`} 
                  </p>
                </label>
    
                <label className={labelStyle}>
                  <strong>Email:</strong>
                  <p
                    className="text-xl text-black">
                    {`${UserDetails.email}`} 
                  </p>
                </label>
    
                <label className={labelStyle}>
                  <strong>Mobile Number:</strong>
                  <p
                    className="text-xl text-black">
                    {`${UserDetails.mobile}`} 
                  </p>
                </label>
    
                <label className='mb-2 text-xl'>
                  <strong>Location: {' '}
                    {/* <button className="fa-solid fa-circle-plus cursor-pointer text-2xl ml-40"   ></button> */}
                  </strong></label>
                  <div>
                  <div className="mt-2 border">
  <ul className='overflow-y-auto max-h-24 text-xl'>
    {Location.map(location => (
      <li className="border-b p-2 flex justify-between items-center" key={location._id}>
        <span>{location.Location}</span>
        <i className="fa-solid fa-xmark" onClick={() => handleDeleteLocation(location._id)}></i>
      </li>
    ))}
  </ul>
</div>

                    {showAddLocationDropdown && (
  <select className="text-xl"
    value={newLocation}
    onChange={(e) => {
      const selectedLocationValue = e.target.value;
      setNewLocation(selectedLocationValue); // Update the state first
      handleDropdownChangeAndAddLocation(selectedLocationValue); // Then call the function
    }}
  >
    <option value="">Select a location</option>
    {availableLocations.map(location => (
      <option key={location._id} value={location.Location} data-id={location._id}>
        {location.Location}
      </option>
    ))}
  </select>
)}
                    
                  </div>
              
    
                <label className={labelStyle}>
                  <strong>Role:</strong>
                  <p
                    className="text-xl text-black">
                    {`${Roles}`} 
                  </p>
                </label>
    
                <label className={labelStyle}>
                  <strong>Company Name:</strong>
                  <p
                    className="text-xl text-black">
                    {`${Company}`} 
                  </p>
                </label>
    
              </>
            ) : (
              <p>Loading user details...</p>
            )}
          </div>
          <button className={locationButtonClass} onClick={toggleDropdown}>Add Location</button>
          <button className={deleteButtonClass}>Delete User</button>
        </div>
      </div>
    );
  }

  export default UserDetails; 
