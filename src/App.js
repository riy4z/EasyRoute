// App.js
import React, { useState } from "react";
import GMap from "./components/GMap";
import Sidebar from "./Screens/Sidebar";

const App = () => {
  const [addresses, setAddresses] = useState([]);
  const [lassoactivate, setLassoActivate] = useState(false);
  const [selectAddress,setSelectAddress] =useState([]);
  const [polylines, setPolylines] = useState([]);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);



  const handleSetAddresses = (newAddresses) => {
    setAddresses(newAddresses);
  };

  const handleLassoActivate = (lassostate) => {
    setLassoActivate(lassostate);
  }

  const handleSelectedAddresses = (selectedAddresses) => {
    setSelectAddress(selectedAddresses)
  };

  const handlePolylinesUpdate = (updatedPolylines) => {
    // Do whatever you need with the updated polylines data
    setPolylines(updatedPolylines);
  };

  const handleLassoComplete = (markersDetails) => {
    // Do something with the markersDetails data (e.g., update state or perform an action)
    console.log("Markers inside lasso:", markersDetails);
};

  return (
    <div>
      <Sidebar setAddresses={handleSetAddresses} setLassoActivate={handleLassoActivate} onSelectedAddresses={handleSelectedAddresses} polylines={polylines}  onUpdateStartLocation={setStartLocation}
        onUpdateEndLocation={setEndLocation}/>
      <GMap addresses={addresses} LassoActive={lassoactivate} selectAddress={selectAddress} onPolylinesUpdate={handlePolylinesUpdate} startLocation={startLocation} // Pass the start location to GMap
        endLocation={endLocation} onLassoComplete={handleLassoComplete}  />
    </div>
  );
};

export default App;
