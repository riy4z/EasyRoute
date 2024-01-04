import React, { useState, useEffect } from 'react';
import getCompanyID from '../components/getCompany';
import { RxCrossCircled } from 'react-icons/rx';
import fetchLocations from '../components/fetchLocations';
import toast, { Toaster } from 'react-hot-toast';
import api from '../config/api';

function LocationPopup({ closePopup }) {
  const [locations, setLocations] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [newStreetAddress,setNewStreetAddress] = useState('');
  const [newCity,setNewCity] = useState('');
  const [newState,setNewState] = useState('');
  const [newZipCode,setNewZipCode] = useState('');

  
  useEffect(() => {
    // Fetch locations from the server when the component mounts
    const fetchData = async () => {
      try {
        const locationsFromServer = await fetchLocations();
        setLocations(locationsFromServer);
      } catch (error) {
        // Handle the error as needed
      }
    };

    fetchData();
  }, []);

  const handleAddLocationClick = () => {
    setShowInput(true);
  };

  const handleLocationChange = (e) => {
    setNewLocation(e.target.value);
  };
  const handleStreetAddressChange = (e) => {
    setNewStreetAddress(e.target.value);
  };
  const handleCityChange = (e) => {
    setNewCity(e.target.value);
  };
  const handleStateChange = (e) => {
    setNewState(e.target.value);
  };
  const handleZipCodeChange = (e) => {
    setNewZipCode(e.target.value);
  };

  const handleAddLocation = async () => {
    const companyid = getCompanyID();
    if (!newLocation.trim()) {
      alert('Please enter a valid location.');
      return;
    }
  
    try {
      // Send the new location to the server to be saved
      const response = await api.post('/addLocations', {
        Location: newLocation,
        CompanyID: companyid,
        StreetAddress: newStreetAddress,
        City: newCity,
        State: newState,
        ZipCode: newZipCode,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const result = response.data;
  
      if (result.message) {
        // If the role is added successfully, update the roles state
        setLocations([...locations, result.location]);
        setNewLocation('');
        setNewStreetAddress('');
        setNewCity('');
        setNewState('');
        setNewZipCode('');
        setShowInput(false);
        // Show a success toast notification
        toast.success('Location added successfully');
      } else {
        alert(result.error || 'Error adding location');
      }
    } catch (error) {
      console.error('Error adding location:', error);
      alert('Error adding location');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (locations.length === 0) {
      alert('Please add at least one location.');
      return;
    }

    alert(`Locations submitted: ${locations.map((location) => location.Location).join(', ')}`);
    closePopup();
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full backdrop-filter backdrop-blur-md">
      <div className="bg-white p-8 rounded-lg shadow-lg z-50 max-w-md mx-auto">
      <div className="absolute top-4 right-4 cursor-pointer">
          <button onClick={closePopup} className="text-gray-500 hover:text-gray-700">
            <RxCrossCircled />
          </button>
        </div>
        <h2 className="text-3xl font-bold text-center mb-4">Locations</h2>
        <hr className="my-4" />
        <ul>
          {locations.map((location, index) => (
            <li key={index}>{location.Location}</li>
          ))}
        </ul>
        <div>
          {showInput && (
            <>
              <form onSubmit={handleSubmit}>
                <input type="text" value={newLocation} onChange={handleLocationChange} placeholder='Enter Location' className="w-full p-1 border border-gray-300 rounded-md mb-3 focus:outline-none focus:border-blue-500" />
                <input type="text" value={newStreetAddress} onChange={handleStreetAddressChange}  placeholder='Street Address' className='border border-gray-300 w-full rounded-md p-1 mb-2'/>
                <input type="text" value={newCity} onChange={handleCityChange}  placeholder='City' className='border border-gray-300 w-full rounded-md p-1 mb-2'/>
                <input type="text" value={newState} onChange={handleStateChange}  placeholder='State' className='border border-gray-300 w-full rounded-md p-1 mb-2'/>
                <input type="text" value={newZipCode} onChange={handleZipCodeChange} placeholder='Zip Code' className='border border-gray-300 w-full rounded-md p-1 mb-2'/>
                <button type="button" onClick={handleAddLocation} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 text-sm">
                  Add Location
                </button>
              </form>
            </>
          )}
          {!showInput && (
            <button onClick={handleAddLocationClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 text-sm">
              Add Location
            </button>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

export default LocationPopup;
