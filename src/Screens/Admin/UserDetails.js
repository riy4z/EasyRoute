import React, { useState, useEffect, useCallback } from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import { getCompanyById } from '../../components/fetch/getCompanyById';
import { getUserLocationsByUserId, deleteUserLocation, addUserLocation } from '../../components/fetch/getUserLocationsByUserId';
import fetchLocations from '../../components/fetch/fetchLocations';
import api from '../../config/api';
import UpdatePopup from './Update';
import AddLocation from './AddLocation';

function UserDetails({ UserDetails, closePopup }) {
  const [Company, setCompany] = useState("");
  const [Location, setLocation] = useState([]);
  // const [newLocation, setNewLocation] = useState("");
  // const [showAddLocationDropdown, setShowAddLocationDropdown] = useState(false);
  // const [availableLocations, setAvailableLocations] = useState([]);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [updateData, setUpdateData]= useState([]);

  const handleUpdate = (location) => {
    setUpdateData(location)
    setShowUpdatePopup(true);
  };
  const handleAdd = () => {
    setShowAddLocation(true);
  };

  const handleCancelUpdate = () => {
    setShowUpdatePopup(false);
    setShowAddLocation(false);
  };

  const handleSaveUpdate = (updatedUserData) => {
    setShowUpdatePopup(false);
  };


  useEffect(() => {
    const fetchUser = async () => {
      const company = await getCompanyById(UserDetails.CompanyID);
      setCompany(company.CompanyName);
      
      try {
        const userLocations = await getUserLocationsByUserId(UserDetails._id);
        
        if (userLocations.length > 0) {
          const allLocations = await fetchLocations();
          const fetchedLocations = [];
          const response = await api.get(`/getRoles?companyid=${UserDetails.CompanyID}`);
          
          for (const userLocation of userLocations) {
            const locationID = userLocation.LocationID;
            const location = allLocations.find(loc => loc._id === locationID);
            
            if (location) {
              location.RoleHierarchy = userLocation.RoleHierarchy;
              const locationRole = response.data.find(role => role.RoleHierarchy === location.RoleHierarchy);
              location.Role=locationRole.Role
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

  // useEffect(() => {
  //   const fetchDropdown = async () => {
  //     try {
  //       const allLocations = await fetchLocations();
  //       const availableLocs = allLocations.filter(loc => !Location.find(selectedLoc => selectedLoc._id === loc._id));
  //       setAvailableLocations(availableLocs);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchDropdown();
  // }, [Location]);

  // const toggleDropdown = useCallback(() => {
  //   setShowAddLocationDropdown(prevState => !prevState);
  // }, []);

  // const handleDropdownChangeAndAddLocation = async (selectedLocationValue) => {
  //   try {
  //     const selectedLocationOption = availableLocations.find(location => location.Location === selectedLocationValue);
  
  //     if (selectedLocationOption) {
  //       const selectedLocationId = selectedLocationOption._id;
  //       const confirmed = window.confirm(`Are you sure you want to add "${selectedLocationValue}" as a new location?`);
  
  //       if (confirmed) {
  //         const response = await addUserLocation(UserDetails._id, selectedLocationId);
  //         console.log('addUserLocation response:', response);
  
  //         setLocation(prevLocation => [...prevLocation, { _id: selectedLocationId, Location: selectedLocationValue }]);
  //         setNewLocation("");
  //       }
  //     } else {
  //       console.error("Error: Selected location not found.");
  //     }
  //   } catch (error) {
  //     console.error('Error handling dropdown change and adding location:', error);
  //   }
  // };
 
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

  // const labelStyle = 'mb-2 text-xl';

  const deleteButtonClass =
    'absolute mt-28 left-2 border-2 border-red-500 px-[88px] py-2 rounded-lg text-red-500 text-xl shadow-sm text-center hover:bg-red-500 hover:text-white';
  const locationButtonClass=
  'absolute mt-10 left-2 border-2 border-blue-700 px-20 py-2 rounded-lg text-blue-700 text-xl shadow-sm text-center hover:bg-blue-700 hover:text-white'
 
console.log(Location)

    return (
      <div>
        <div className="fixed top-0 right-0 bg-white text-black w-[300px] h-full p-0 z-0 transition-opacity ease-out duration-700 text-2xl leading-loose">
        <div className='bg-customColor p-3'>
            <h3 className='text-white text-xl ml-2 flex items-center justify-between'>
              User Details
              <RxCrossCircled
            size={30}
            onClick={closePopup}
            className='cursor-pointer'
          />
            </h3>
          </div>
          <div className="p-4">
            {UserDetails ? (
              <>
                    
                  <p 
                    className="text-xl font-bold">
                    {`${UserDetails.firstName} ${UserDetails.lastName}`} 
                  </p>
                
    
                  <div className=' block'>
                <label className='text-sm font-semibold'>Email:</label>
                  <p
                    className='text-sm block'>
                    {`${UserDetails.email}`} 
                  </p>
                </div>
    
                <div className=' block'>
                <label className='text-sm font-semibold'>Mobile Number:</label>
                  <p
                     className='text-sm block'>
                    {`${UserDetails.mobile}`} 
                  </p>
                </div>
    
                <div className=' block'>
                  <label className='text-sm font-semibold'>Location: {' '}
                  </label></div>
                 
                  <div className=" border">
  <ul className='overflow-y-auto max-h-24 text-xl'>
    {Location.map(location => (
      <li className="border-b cursor-pointer hover:underline p-2 text-sm flex justify-between items-center" onClick={()=>{handleUpdate(location)}} key={location._id}>
        <span>{location.Location} ({location.Role})</span>
        <i className="fa-solid fa-xmark" onClick={() => handleDeleteLocation(location._id)}></i>
      </li>
    ))}
  </ul>
</div>

                    {/* {showAddLocationDropdown && (
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
)} */}
                    
                 
              
    
                  <div className=' block'>
                <label className='text-sm font-semibold'>Company:</label>
                  <p
                    className='text-sm block'>
                    {`${Company}`} 
                  </p>
                </div>
    
              </>
            ) : (
              <p>Loading user details...</p>
            )}
          </div>
          <button className={locationButtonClass} onClick={handleAdd}>Add Location</button>
          <button className={deleteButtonClass}>Delete User</button>
          
          {showUpdatePopup && (
        <UpdatePopup UserDetails={UserDetails} updateData={updateData} onSave={handleSaveUpdate} onCancel={handleCancelUpdate} />
      )}
          {showAddLocation && (
        <AddLocation UserDetails={UserDetails} updateData={updateData} onSave={handleSaveUpdate} onCancel={handleCancelUpdate} />
      )}
        </div>
      </div>
    );
  }

  export default UserDetails; 
