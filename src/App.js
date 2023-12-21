// App.js
import React, { useState } from "react";
import GMap from "./components/GMap";
import Sidebar from "./Screens/Sidebar";

const App = () => {
  const [addresses, setAddresses] = useState([]);
  const [lassoactivate, setLassoActivate] = useState(false);
  const [selectAddress,setSelectAddress] =useState([]);

  const handleSetAddresses = (newAddresses) => {
    setAddresses(newAddresses);
  };

  const handleLassoActivate = (lassostate) => {
    setLassoActivate(lassostate);
  }

  const handleSelectedAddresses = (selectedAddresses) => {
    setSelectAddress(selectedAddresses)
    console.log('Selected Addresses in App:', selectedAddresses);
  };

  return (
    <div>
      <Sidebar setAddresses={handleSetAddresses} setLassoActivate={handleLassoActivate} onSelectedAddresses={handleSelectedAddresses}/>
      <GMap addresses={addresses} LassoActive={lassoactivate} selectAddress={selectAddress} />
    </div>
  );
};

export default App;
