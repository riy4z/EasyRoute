// App.js
import React, { useState } from "react";
import GMap from "./components/map/GMap";
import Sidebar from "./components/sidebar/Sidebar";

const App = () => {
  const [addresses, setAddresses] = useState([]);
  const [lassoactivate, setLassoActivate] = useState(false);
  const [selectAddress,setSelectAddress] =useState([]);
  const [polylines, setPolylines] = useState([]);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [lassoComplete, setLassoComplete] = useState(null);
  const [optimizeClick, setOptimizeClick] = useState(false);
  const [customRouteClick, setCustomRouteClick] = useState(false);
  const [clearClick, setClearClick] = useState(false);
  const [savedPolylines,setSavedPolylines]=useState([]);


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
  const handlePolylinesSaved = (updatedPolylines) => {
    // Do whatever you need with the updated polylines data
    setSavedPolylines(updatedPolylines);
  };

  const handleLassoComplete = (markersDetails) => {
    // Do something with the markersDetails data (e.g., update state or perform an action)
    setLassoComplete(markersDetails);
};

const handleOptimizeClick = (value) => {
  setOptimizeClick(value);
};
const handleCustomRouteClick = (value) => {
  setCustomRouteClick(value);
};
const handleClearClick = (value) => {
  setClearClick(value);
};

  return (
    <div>
      <Sidebar setAddresses={handleSetAddresses} setLassoActivate={handleLassoActivate} onSelectedAddresses={handleSelectedAddresses} polylines={polylines} handlePolylinesUpdate={handlePolylinesSaved} onUpdateStartLocation={setStartLocation}
        onUpdateEndLocation={setEndLocation} lassoComplete={lassoComplete} onOptimizeClick={handleOptimizeClick} onCustomRouteClick={handleCustomRouteClick} onClearClick={handleClearClick}/>
      <GMap addresses={addresses} LassoActive={lassoactivate} selectAddress={selectAddress} onPolylinesUpdate={handlePolylinesUpdate} startLocation={startLocation} // Pass the start location to GMap
        endLocation={endLocation} onLassoComplete={handleLassoComplete} optimizeClick={optimizeClick} customRouteClick={customRouteClick} savedPolylines={savedPolylines} clearClick={clearClick} />
    </div>
  );
};

export default App;
