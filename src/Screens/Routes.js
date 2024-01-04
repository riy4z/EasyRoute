// Routes.js
import React, { useEffect, useState } from 'react';
import CurrentRoute from './CurrentRoute';
import SavedRoutes from './SavedRoutes';
import * as MapFunctions from '../components/mapFunctions';

function Routes({ setAddresses, setLassoActivate, onSelectedAddresses, polylines, onUpdateStartLocation, onUpdateEndLocation}) {
  const [addresses, setAddressess] = useState([]);
  // const [selectedAddresses, setSelectedAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState('current'); // 'current' or 'saved'

  useEffect(() => {
    // Fetch addresses from the database only if addresses is empty
    if (addresses.length === 0) {
      MapFunctions.getAddressesFromDatabase((newAddresses) => {
        setAddressess(newAddresses);
        // Automatically pass the addresses to the parent component
        setAddresses(newAddresses);
      });
    }
  }, [addresses, setAddresses]);



  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


  const handleSelectedAddresses = (selectedAddresses) => {
    // Do something with the selected addresses in the parent component if needed
    console.log('Selected Addresses in parent:', selectedAddresses);
    // setSelectedAddresses(selectedAddresses);
    onSelectedAddresses(selectedAddresses);
  };

  

  return (
    <div>
      <h1 className="text-5xl font-medium text-customColor1 text-left">Route</h1>
      <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400 mt-4">
        <li className={`w-full ${activeTab === 'current' ? 'bg-customColor rounded-s-lg text-white' : 'hover:text-gray-700 hover:bg-gray-50 text-customColor'}`}>
          <a onClick={() => handleTabClick('current')} className="inline-block w-full p-4 border-r border-gray-200 dark:border-gray-700 rounded-s-lg focus:outline-none cursor-pointer " >Current Route</a>
        </li>
        <li className={`w-full ${activeTab === 'saved' ? 'bg-customColor rounded-e-lg text-white' : 'hover:text-gray-700 hover:bg-gray-50 text-customColor'}`}>
          <a onClick={() => handleTabClick('saved')} className="inline-block w-full p-4 border-r border-gray-200  rounded-e-lg   focus:outline-none cursor-pointer ">Saved Routes</a>
        </li>
      </ul>
      {activeTab === 'current' ? (
        <CurrentRoute 
        setLassoActivate={setLassoActivate} 
        addresses={addresses} 
        onSelectedAddresses={handleSelectedAddresses} 
        polylines={polylines}
        onUpdateStartLocation={onUpdateStartLocation}
        onUpdateEndLocation={onUpdateEndLocation} />
      ) : (
        <SavedRoutes />
      )}
    </div>
  );
}

export default Routes;
