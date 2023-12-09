// App.js
import React, { useState } from "react";
import GMap from "./components/GMap";
import Sidebar from "./Screens/Sidebar";

const App = () => {
  const [addresses, setAddresses] = useState([]);
  const [lassoactivate, setLassoActivate] = useState(false);

  const handleSetAddresses = (newAddresses) => {
    setAddresses(newAddresses);
  };

  const handleLassoActivate = (lassostate) => {
    setLassoActivate(lassostate);
  }

  return (
    <div>
      <Sidebar setAddresses={handleSetAddresses} setLassoActivate={handleLassoActivate}/>
      <GMap addresses={addresses} LassoActive={lassoactivate}/>
    </div>
  );
};

export default App;
