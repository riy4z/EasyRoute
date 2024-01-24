// Routes.js
import React, { useEffect, useState } from 'react';
import CurrentRoute from './CurrentRoute';
import SavedRoutes from './SavedRoutes';
import * as MapFunctions from '../../components/map/mapFunctions';

function Routes({ setAddresses,handlePolylinesUpdate, setLassoActivate, onSelectedAddresses, polylines, onUpdateStartLocation, onUpdateEndLocation, lassoComplete, onOptimizeClick, onCustomRouteClick, onClearClick,onSavedRouteClick,selectedLocation}) {
  const [addresses, setAddressess] = useState([]);
  const [savedRouteClick, setSavedRouteClick] = useState(false);
  // const [selectedAddresses, setSelectedAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState('current'); // 'current' or 'saved'

useEffect(() => {
  // Fetch addresses from the database if selectedLocation changes
  MapFunctions.getAddressesFromDatabaseByLocation((newAddresses) => {
    setAddressess(newAddresses);
    // Automatically pass the addresses to the parent component
    setAddresses(newAddresses);
  }, selectedLocation);
}, [selectedLocation]);


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


  const handleSelectedAddresses = (selectedAddresses) => {
    // Do something with the selected addresses in the parent component if needed
    // setSelectedAddresses(selectedAddresses);
    onSelectedAddresses(selectedAddresses);
  };

  const handleSavedRouteClick = (value) => {
    setSavedRouteClick(value);
  };


  return (
    <div>
      <h1 className="text-5xl font-medium text-customColor1 text-left mb-2">Route</h1>
      <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
        <li className={`w-full ${activeTab === 'current' ? 'bg-customColor rounded-s-lg text-white' : 'hover:text-gray-700 hover:bg-gray-50 text-customColor'}`}>
          <span onClick={() => handleTabClick('current')} className="inline-block w-full p-4 border-r border-gray-200 dark:border-gray-700 rounded-s-lg focus:outline-none cursor-pointer " >Current Route</span>
        </li>
        <li className={`w-full ${activeTab === 'saved' ? 'bg-customColor rounded-e-lg text-white' : 'hover:text-gray-700 hover:bg-gray-50 text-customColor'}`}>
          <span onClick={() => handleTabClick('saved')} className="inline-block w-full p-4 border-r border-gray-200  rounded-e-lg   focus:outline-none cursor-pointer ">Saved Routes</span>
        </li>
      </ul>
      {activeTab === 'current' ? (
        <CurrentRoute 
        setLassoActivate={setLassoActivate} 
        addresses={addresses} 
        onSelectedAddresses={handleSelectedAddresses} 
        polylines={polylines}
        onUpdateStartLocation={onUpdateStartLocation}
        onUpdateEndLocation={onUpdateEndLocation}
        lassoComplete={lassoComplete}
        onOptimizeClick={onOptimizeClick}
        onCustomRouteClick={onCustomRouteClick}
        handlePolylinesUpdate={handlePolylinesUpdate}
        savedRouteClick={savedRouteClick}
        onClearClick={onClearClick}
        selectedLocation={selectedLocation}
         />
      ) : (
        <SavedRoutes 
        handlePolylinesUpdate={handlePolylinesUpdate}
        onSavedRouteClick={handleSavedRouteClick}
        />
      )}
    </div>
  );
}

export default Routes;
