import React, { useState ,useEffect} from 'react';
import api from '../../config/api';
import fetchLocations from '../../components/fetch/fetchLocations';
import fetchRoles from '../../components/fetch/fetchRoles';
import fetchUserLocations from '../../components/fetch/fetchUserLocations';
import getCompanyID from "../../components/fetch/getCompany"
import { getUserLocationsByUserId, addUserLocation } from '../../components/fetch/getUserLocationsByUserId';


function AddLocation({ onSave, onCancel,UserDetails,updateData }) {
  const [role, setRole] = useState(null);
  const [rolesFromServer, setRolesFromServer] = useState([]);
  const [locationsFromServer, setLocationsFromServer] = useState([]);
  const [Location, setLocation] = useState([]);
  const [newLocation, setNewLocation] = useState("");
  const [availableLocations, setAvailableLocations] = useState([]);


  const [userData, setUserData] = useState({
    location: '',
    role: '',
    // Add other fields as needed
  });

  const onAdd = async(id, location, role) => {
    addUserLocation(id, location, role)
    onCancel();
     }
   
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(userData);
  };

  useEffect(() => {
    const fetchUser = async () => {
      
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

  useEffect(() => {
    const fetchDropdown = async () => {
      try {
        const availableLocs = locationsFromServer.filter(loc => !Location.find(selectedLoc => selectedLoc._id === loc._id));
        setAvailableLocations(availableLocs);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDropdown();
  }, [Location]);

  useEffect(() => {
    // Fetch locations from the server when the component mounts
    const fetchData = async () => {
      try {
        const userLocationsData = await fetchUserLocations();
        const locations = await fetchLocations();
        const matchedLocations = userLocationsData.map(userLocation => {
          const matchingLocation = locations.find(location => location._id === userLocation.LocationID);
          return { ...userLocation, ...matchingLocation }; // Merge userLocation and matchingLocation
        });
        setLocationsFromServer(matchedLocations);
    
        const roles = await fetchRoles();
        setRolesFromServer(roles);
      } catch (error) {
        // Handle the error as needed
      }
    };

    fetchData();
  }, []);
console.log(locationsFromServer)
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
        <h2 className="text-xl font-semibold mb-5 text-center">Add User Location</h2>
        <form onSubmit={handleSubmit}>
          <div className="leading-none">
            <label className="text-lg font-semibold ">Location:</label>
            <div>     
                  

                     
  <select className="w-full px-1 text-xl border border-gray-300 rounded-md mt-2 mb-4 focus:outline-none focus:border-blue-500"
    value={newLocation}
    onChange={(e) => {
      const selectedLocationValue = e.target.value;
      setNewLocation(selectedLocationValue); // Update the state first
      console.log(e.target.value)
    }}
  >
    <option value="">Select a location</option>
    {availableLocations.map(location => (
      <option key={location._id} value={location._id} data-id={location._id}>
        {location.Location}
      </option>
    ))}
  </select>

                    
                  
  </div>
          </div>
<div className='leading-none'>
          <label className="text-lg font-semibold">Role:</label>
         <select
  value={role}
  onChange={(event) => {
    handleRoleChange(event); 
    
  }}
  className="w-full px-1 text-xl border border-gray-300 rounded-md mt-2 mb-1 focus:outline-none focus:border-blue-500"
  required
>
<option>Select Role</option>
{rolesFromServer
  .filter(rol => rol.RoleHierarchy !== 0)
  .map(rol => (
    <option key={rol.id} value={rol.RoleHierarchy}>
      {rol.Role}
    </option>
  ))}

</select>
</div>
          <div className="flex mt-2 text-lg justify-between items-center font-medium">
            <div onClick={() => {onAdd(UserDetails._id, newLocation, role)}} className="bg-blue-600 cursor-default py-1 px-6 text-white hover:bg-blue-700 px-4 rounded-md">Add</div>
            <div onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 px-4 py-1 rounded-md cursor-default">Cancel</div>
            
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddLocation;

