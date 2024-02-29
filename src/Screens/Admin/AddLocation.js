import React, { useState ,useEffect,useCallback } from 'react';
import api from '../../config/api';
import fetchLocations from '../../components/fetch/fetchLocations';
import fetchRoles from '../../components/fetch/fetchRoles';
import getCompanyID from "../../components/fetch/getCompany"
import { getCompanyById } from '../../components/fetch/getCompanyById';
import { getUserLocationsByUserId, addUserLocation } from '../../components/fetch/getUserLocationsByUserId';


function AddLocation({ onSave, onCancel,UserDetails,updateData }) {
  const [role, setRole] = useState(null);
  const [rolesFromServer, setRolesFromServer] = useState([]);
  const [locationsFromServer, setLocationsFromServer] = useState([]);
  const [Location, setLocation] = useState([]);
  const [newLocation, setNewLocation] = useState("");
  const [showAddLocationDropdown, setShowAddLocationDropdown] = useState(false);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [Company, setCompany] = useState("");
  const [LocationId, setLocationId] = useState (null);

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
        <h2 className="text-xl font-bold mb-4">Add Location</h2>
        <form onSubmit={handleSubmit}>
          <div className="ml-2">
            <label className="text-xl font-bold">Location:</label>
            <div>     
                  <div>

                     
  <select className="text-xl"
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
          </div>

          <label className="text-xl font-bold">Role:</label>
         <select
  value={role}
  onChange={(event) => {
    handleRoleChange(event); 
    
  }}
  className="w-full p-1 text-xl border border-gray-300 rounded-md mb-3 focus:outline-none focus:border-blue-500"
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

          <div className="flex justify-end">
            <button type="button" onClick={onCancel} className="mr-4 bg-gray-300 hover:bg-gray-600 px-4 rounded-md">Cancel</button>
            <button type="button" onClick={() => {onAdd(UserDetails._id, newLocation, role)}} className="bg-blue-500 hover:bg-blue-800 px-4 rounded-md">Add</button>
            
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddLocation;

