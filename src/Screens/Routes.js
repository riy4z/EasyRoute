// Routes.js
import React, { useEffect, useState } from 'react';
import * as MapFunctions from '../components/mapFunctions';

function Routes({ setAddresses, setLassoActivate }) {
  const [addresses, setAddressess] = useState([]);
  const [isLassoActive, setIsLassoActive] = useState(false);

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

  const handleLassoClick = () => {
    setIsLassoActive(!isLassoActive);

    // Pass the updated LassoActive state to the parent component
    setLassoActivate(!isLassoActive);
  };

  return (
    <div>
      <h1 className="text-5xl font-medium text-customColor1 text-left ">Route</h1>
      <p style={{ color: 'black' }}>Explore Routes! Come on let's explore</p>
      <button onClick={handleLassoClick} className="bg-blue-500 rounded-md text-white px-2">
        {isLassoActive ? "Deactivate Lasso" : "Activate Lasso"}
      </button>
    </div>
  );
}

export default Routes;
