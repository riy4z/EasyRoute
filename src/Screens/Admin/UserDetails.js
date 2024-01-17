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

  const handleDropDownChange = async(value, key) => {
    await handleAddLocation(key, value);
  };

  const handleAddLocation = async (id, value) => {
    try {
      if (newLocation !== "" && Array.isArray(availableLocations) && availableLocations.length > 0) {
        // Use the addUserLocation function to add the location
        const response = await addUserLocation(UserDetails._id, id);
        console.log('addUserLocation response:', response);
  
        // Update the state to reflect the addition
        setLocation(prevLocation => [...prevLocation, { _id: id, Location: value }]);
        setNewLocation("");
      } else {
        console.error(`Error: id or availableLocations is invalid.`);
      }
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };
  
 
  const handleDeleteLocation = useCallback(async (locationId) => {
    try {
      await deleteUserLocation(UserDetails._id, locationId);
      const updatedLocations = Location.filter((location) => location._id !== locationId);
      setLocation(updatedLocations);
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  }, [Location, UserDetails._id]);

  const buttonStyle = {
    marginLeft: '10px',
    cursor: 'pointer',
  };

  const labelStyle = { marginBottom: '5px' };

  const deleteButtonClass =
    'absolute mt-24 left-2 border-2 border-red-500 px-[88px] py-2 rounded-lg text-red-500 text-xl shadow-sm text-center hover:bg-red-500 hover:text-white';

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
                <label style={labelStyle}>
                  <strong>Name:</strong>
                  <input
                    className="border border-gray-300 p-1 rounded"
                    type="text"
                    value={`${UserDetails.firstName} ${UserDetails.lastName}`}
                    readOnly
                  />
                </label>
    
                <label style={labelStyle}>
                  <strong>Email:</strong>
                  <input
                    className="border border-gray-300 p-1 rounded"
                    type="text"
                    value={`${UserDetails.email}`}
                    readOnly
                  />
                </label>
    
                <label style={labelStyle}>
                  <strong>Mobile Number:</strong>
                  <input
                    className="border border-gray-300 p-1 rounded"
                    type="text"
                    value={`${UserDetails.mobile}`}
                    readOnly
                  />
                </label>
    
                <label style={labelStyle}>
                  <strong>Location: {' '}
                    <button className="fa-solid fa-plus" size={15} style={{ cursor: 'pointer' }} onClick={toggleDropdown} />
                  </strong>
                  <div className="input-container">
                    <ul>
                      {Location.map(location => (
                        <li key={location._id}>{location.Location}
                          <button className="fa-solid fa-xmark" style={buttonStyle}
                            onClick={() => handleDeleteLocation(location._id)}></button>
                        </li>
                      ))}
                    </ul>
                    {showAddLocationDropdown && (
  <select
    value={newLocation}
    onChange={(e) => {
      const selectedLocationValue = e.target.value;
      const selectedLocationOption = Array.from(e.target.options).find(option => option.value === selectedLocationValue);

      if (selectedLocationOption) {
        const selectedLocationId = selectedLocationOption.getAttribute('data-id');
        setNewLocation(selectedLocationValue); // Update the state first
        handleDropDownChange(selectedLocationValue, selectedLocationId); // Then call the function
      } else {
        console.error("Error: Selected location not found.");
      }
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
                </label>
    
                <label style={labelStyle}>
                  <strong>Role:</strong>
                  <div className="input-container">
                    <input
                      className="border border-gray-300 p-1 rounded"
                      type="text"
                      value={Roles}
                      readOnly
                    />
                  </div>
                </label>
    
                <label style={labelStyle}>
                  <strong>Company Name:</strong>
                  <input
                    className="border border-gray-300 p-1 rounded"
                    type="text"
                    value={Company}
                    readOnly
                  />
                </label>
    
              </>
            ) : (
              <p>Loading user details...</p>
            )}
          </div>
    
          <button className={deleteButtonClass}>Delete User</button>
        </div>
      </div>
    );
  }

  export default UserDetails; 
