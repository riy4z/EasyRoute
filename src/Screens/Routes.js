// Import necessary libraries and components
import React, { useEffect, useState } from 'react';
import * as MapFunctions from '../components/mapFunctions';

function Routes({ setAddresses }) {
  const [addresses, setAddressess] = useState([]);

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

  return (
    <div>
      <h1 className="text-5xl font-medium text-customColor1 text-left ">Route</h1>
      <p style={{ color: 'black' }}>Explore Routes! Come on let's explore</p>
      {/* Your component content here */}
    </div>
  );
}

export default Routes;
