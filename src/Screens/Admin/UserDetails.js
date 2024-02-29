import React, { useState, useEffect, useCallback } from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import { getCompanyById } from '../../components/fetch/getCompanyById';
import { getUserLocationsByUserId, deleteUserLocation } from '../../components/fetch/getUserLocationsByUserId';
import fetchLocations from '../../components/fetch/fetchLocations';
import api from '../../config/api';
import UpdatePopup from './Update';
import AddLocation from './AddLocation';

function UserDetails({ UserDetails, closePopup }) {
  const [Company, setCompany] = useState("");
  const [Location, setLocation] = useState([]);
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
    ' text-red-500 text-lg w-full text-center hover:underline';
  
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
                    {`${UserDetails.firstName||""} ${UserDetails.lastName||""}`}
                    <span className='text-lg text-gray-500 font-semibold'>{` (${UserDetails.username})`}</span> 
                  </p>
                
    
                  <div className=' block border-t leading-none mt-2 py-1'>
                <label className='text-sm font-semibold leading-loose'>Address:</label>
                  <p
                    className='text-sm block'>
                    {`${UserDetails.address||"(No Address)"}`} 
                  </p>
                </div>
                  
                <label className='text-sm font-semibold leading-loose'>Email:</label>
                  <p
                    className='text-sm block'>
                    {`${UserDetails.email}`} 
                  </p>
                
    
                <div className=' block'>
                <label className='text-sm font-semibold'>Mobile Number:</label>
                  <p
                     className='text-sm block'>
                    {`${UserDetails.mobile || "(No Mobile Number)"}`} 
                  </p>
                </div>
    
                <div className='flex justify-between items-center py-4 mr-2'>
    <div className='text-sm font-semibold'>User Location:</div>
    <div className  ="text-sm text-blue-600 hover:text-blue-500 hover:underline cursor-pointer" onClick={handleAdd}><span>Add</span></div>
</div>
                 
                  <div className=" border rounded-xl">
  <ul className='overflow-y-auto max-h-24 text-xl'>
    {Location.map(location => (
      <li className="border-b border-gray-200 cursor-pointer  hover:underline p-2 text-sm flex justify-between items-center" >
        <span onClick={()=>{handleUpdate(location)}} key={location._id}>{location.Location} ({location.Role})</span>
        <div className='hover:text-red-400'>

        <i className="fa-solid fa-xmark " onClick={() => handleDeleteLocation(location._id)}></i>
        </div>
      </li>
    ))}
  </ul>
</div>
    
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
          <div className='w-full border-t border-gray-200 hover:font-medium'>

          <button className={deleteButtonClass}>Delete User</button>
          </div>
          
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
