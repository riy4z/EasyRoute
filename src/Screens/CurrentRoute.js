import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import RoutePopup from './RoutePopup';
import NullAddress1 from '../assets/images/NullAddress1.jpg';
import fetchLocations from '../components/fetchLocations';
import fetchUserLocations from '../components/fetchUserLocations';
import getUserID from "../components/getUser";
import axios from "axios";
import getCompanyID from "../components/getCompany";



const CurrentRoute = ({ setLassoActivate, addresses, onSelectedAddresses, polylines, onUpdateStartLocation, onUpdateEndLocation, lassoComplete, // New prop
onOptimizeClick, onCustomRouteClick}) => {
  const [isLassoActive, setIsLassoActive] = useState(false);
  const [isOptimized,setIsOptimized] = useState(false);
  const [combinedAddresses,setCombinedAddresses] = useState([])
  const [isOptimizeSwitchOn, setIsOptimizeSwitchOn] = useState(true); // Added state for the toggle switch

  console.log(polylines)

  const handleOptimizeDown = () => {
    if (isOptimizeSwitchOn) {
      // Set onOptimizeClick to true when the button is pressed only if the toggle switch is on
      onOptimizeClick(true);
      setIsOptimized(true);
    }
    if (!isOptimizeSwitchOn) {
      // Set onOptimizeClick to true when the button is pressed only if the toggle switch is on
      onCustomRouteClick(true);
      setIsOptimized(true);
    }
  };

  const handleOptimizeUp = () => {
    // Check if polylines is defined and has elements
    if (isOptimizeSwitchOn) {
      // Set onOptimizeClick to false when the button is released only if the toggle switch is on
      onOptimizeClick(false);
      setIsOptimized(true);
    }
    if (!isOptimizeSwitchOn) {
      // Set onOptimizeClick to false when the button is released only if the toggle switch is on
      onCustomRouteClick(false);
      setIsOptimized(true);
    }
  };





  const DraggableAddress = ({ address, index, polylines }) => {
    const [routeDetails, setRouteDetails] = useState({ distance: "", duration: "" });
  
    useEffect(() => {
      if (index < polylines.length && polylines[index]) {
        const { distance, duration } = polylines[index];
        setRouteDetails({ distance, duration });
      }
    }, [index, polylines]);
  
    return (
      <Draggable draggableId={address._id.toString()} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`border${snapshot.isDragging ? ' opacity-50' : ''} transition-opacity duration-200 ease-in-out p-0.5 relative`}
          >
            {address["First Name"]} {address["Last Name"]}
            <div className="text-sm text-gray-600">
              {index < polylines.length && (
                <>
                  <div>Distance: {routeDetails.distance}</div>
                  <div>Duration: {routeDetails.duration}</div>
                </>
              )}
            </div>
            <hr className="my-0 border-t border-gray-300" />
          </div>
        )}
      </Draggable>
    );
  };
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const [userLocations, setUserLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [Locations, setLocations] = useState([]);
  const [routeid , setRouteId]= useState();
  const markers = [];
  const [lassoAddresses, setLassoAddresses] = useState([]);
  const [startLocation, setStartLocation] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: ""
  });
  const [endLocation, setEndLocation] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: ""
  });
  const companyid = getCompanyID();
  const userid = getUserID();
  
  
  useEffect(() => {
    if (lassoComplete) {
      const addresses = lassoComplete.map(item => item.addressData);
      setLassoAddresses(addresses);
      console.log("HI:",addresses)
    } else {
      console.log("lassoComplete is null or undefined");

    }
  }, [lassoComplete]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = getUserID();
        const userLocationsData = await fetchUserLocations(userId);
        setUserLocations(userLocationsData);
        const allLocations = await fetchLocations();
        setLocations(allLocations);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const handleLassoClick = () => {
    setIsLassoActive(!isLassoActive);
    setLassoActivate(!isLassoActive);
  };

  const handleOpenPopup = () => {
    if (!selectedLocation) {
      alert("Please select a location before adding an account.");
      return;
    }

    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handlePopupDone = (newlySelectedAddresses) => {
    const uniqueNewAddresses = newlySelectedAddresses.filter(
      (newAddress) => !selectedAddresses.some((existingAddress) => existingAddress._id === newAddress._id)
    );

    const updatedAddresses = selectedAddresses.filter(
      (existingAddress) => newlySelectedAddresses.some((newAddress) => newAddress._id === existingAddress._id) 
    );

    updatedAddresses.push(...uniqueNewAddresses);

    setSelectedAddresses(updatedAddresses);
    onSelectedAddresses(updatedAddresses);
    handleClosePopup();
  };

  const handleAddressReorder = (result) => {
    if (!result.destination) return;
  
    const newAddresses = [...combinedAddresses];
    const [reorderedItem] = newAddresses.splice(result.source.index, 1);
    newAddresses.splice(result.destination.index, 0, reorderedItem);

    const updatedLassoAddresses = newAddresses.slice(0, lassoAddresses.length);
    const updatedSelectedAddresses = newAddresses.slice(lassoAddresses.length);

    setLassoAddresses(updatedLassoAddresses)
    setSelectedAddresses(updatedSelectedAddresses)
    // Emit the reordered addresses without modifying selectedAddresses
    onSelectedAddresses(newAddresses);
    
  };

  useEffect(() => {
    onSelectedAddresses(selectedAddresses);
  }, [selectedAddresses]);

  const promptForLocationDetails = async (type) => {
    const userInput = await window.prompt(`Enter ${type}:`);

    if (userInput !== null) {
      // User clicked OK in the prompt
      return userInput.trim();
    }

    // User clicked Cancel in the prompt
    return null;
  };
  
 const geocode = async (location) => {
    const { address, city, state, zipCode } = location;
    const addressString = `${address}, ${city}, ${state}, ${zipCode}`;

    try {
      const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address: addressString,
          key: "AIzaSyCHb570UK21VsQtayMgy3X8sOFzUclZHlo",
        },
      });

      const { results } = response.data;
      if (results && results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        return {
          ...location,
          latitude: lat,
          longitude: lng,
        };
      } else {
        console.error("No results found for the address.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
      return null;
    }
  };

  const handleGeocodeStartLocation = async () => {
    const address = await promptForLocationDetails("Address");
    const city = address !== null ? await promptForLocationDetails("City") : null;
    const state = city !== null ? await promptForLocationDetails("State") : null;
    const zipCode = state !== null ? await promptForLocationDetails("Zip Code") : null;

    if (zipCode !== null) {
      const newStartLocation = {
        address: address || "",
        city: city || "",
        state: state || "",
        zipCode: zipCode || "",
        latitude: null,
        longitude: null,
      };

      const geocodedStartLocation = await geocode(newStartLocation);
      setStartLocation(geocodedStartLocation);
      onUpdateStartLocation(geocodedStartLocation);

    }
  };

  const handleGeocodeEndLocation = async () => {
    const address = await promptForLocationDetails("Address");
    const city = address !== null ? await promptForLocationDetails("City") : null;
    const state = city !== null ? await promptForLocationDetails("State") : null;
    const zipCode = state !== null ? await promptForLocationDetails("Zip Code") : null;

    if (zipCode !== null) {
      const newEndLocation = {
        address: address || "",
        city: city || "",
        state: state || "",
        zipCode: zipCode || "",
        latitude: null,
        longitude: null,
      };

      const geocodedEndLocation = await geocode(newEndLocation);
      setEndLocation(geocodedEndLocation);
      onUpdateEndLocation(geocodedEndLocation); // Pass the updated end location to the parent component
 
    }
  };
  
  const handleToggleSwitch = () => {
    setIsOptimizeSwitchOn(!isOptimizeSwitchOn);
  };
  // const combinedAddresses = lassoAddresses.length > 0 ? [...lassoAddresses, ...selectedAddresses] : selectedAddresses;
useEffect(()=>{
  if(isOptimized){
  const slicedPolylines = polylines.slice(1).map(obj => obj.addressdata);
  setCombinedAddresses(slicedPolylines)
}
},[])

  useEffect(() => {
    // Set onSelectedAddresses whenever combinedAddresses is updated, but only if lassoAddresses or selectedAddresses change
    const updatedCombinedAddresses = lassoAddresses.length > 0 ? [...lassoAddresses, ...selectedAddresses] : selectedAddresses;
    setCombinedAddresses(updatedCombinedAddresses)
    onSelectedAddresses(updatedCombinedAddresses);
  }, [lassoAddresses, selectedAddresses]);
  
  const handleSave = () => {
    try {
      // Prompt user for routeName
      let routeName = prompt("Enter a name for the route:");
  
      // Check if the user clicked Cancel
      if (routeName === null) {
        return; // Terminate the function if user clicked Cancel
      }
  
      // Trim the routeName and check if it is empty
      routeName = routeName.trim();
      if (routeName === "") {
        alert("RouteName cannot be empty. Please enter a valid route name.");
        return; // Terminate the function if routeName is empty
      }
  
      // Extract latitudes and longitudes from slicedPolylines
      const waypointCoordinates = polylines.slice(1).map(obj => {
        const { latitude, longitude } = obj.addressdata;
        return { position: { lat: latitude, lng: longitude } };
      });
      const data = {
         // Include the routeName in the data
         Route: [
          // Include start location coordinates
          {
            position: {
              lat: startLocation.latitude,
              lng: startLocation.longitude,
            },
          },
          // Include waypoints coordinates
          ...waypointCoordinates,
          // Include end location coordinates
          {
            position: {
              lat: endLocation.latitude,
              lng: endLocation.longitude,
            },
          },
        ],      
        CompanyID: companyid,
        LocationID: selectedLocation,
        RouteName: routeName
      };
  console.log(data)
      axios.post('http://localhost:4000/api/saveRoute', data)
        .then(response => {
          // Handle the response from the backend if needed
          const RouteID = response.data.route._id
          setRouteId(RouteID);
          axios.post('http://localhost:4000/api/addUserRoute', { userId: userid, routeId: RouteID })
        })
        .catch(error => {
          // Handle errors during the request
          console.error('Error during Axios request:', error);
        });
  
    } catch (error) {
      // Handle errors that occur within the try block
      console.error('Error:', error);
    }
  };



 
  return (
    <DragDropContext onDragEnd={handleAddressReorder}>
      <Droppable droppableId="combinedAddresses">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <div>
              <br />
              <select
                id="locationDropdown"
                onChange={(e) => setSelectedLocation(e.target.value)}
                value={selectedLocation}
                
              >
                <option value="">Select a location</option>
                {userLocations.map((userLocation) => {
                  const location = Locations.find((loc) => loc._id === userLocation.LocationID);
                  return (
                    <option key={userLocation._id} value={userLocation.LocationID}>
                      {location ? location.Location : "Unknown Location"}
                    </option>
                  );
                })}
              </select>
              <div className="flex items-center">
        <label style={{ position: "relative", display: "inline-block", width: "60px", height: "34px" }} className="switch-toggle">
          <input
            type="checkbox"
            id="optimizeSwitch"
            name="optimizeSwitch"
            checked={isOptimizeSwitchOn}
            onChange={handleToggleSwitch}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <div style={{ position: "absolute", cursor: "pointer", top: 2, left: 2, right: 2, bottom: 2, backgroundColor: isOptimizeSwitchOn ? "#4CAF50" : "#BDBDBD", borderRadius: "17px", transition: "background-color 0.3s" }}></div>
          <div style={{ position: "absolute", content: "", height: "22px", width: "22px", left: "6px", bottom: "6px", backgroundColor: "#FFFFFF", borderRadius: "50%", transition: "transform 0.3s", transform: isOptimizeSwitchOn ? "translateX(26px)" : "translateX(0)" }}></div>
        </label>
        <span className="text-sm text-gray-600 ml-2">{isOptimizeSwitchOn ? "Optimized Route" : "Custom Route"}</span>
      </div>


              <button
                onClick={handleLassoClick}
                className={`text-white ${
                  isLassoActive
                    ? "bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300"
                    : "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
                } font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none`}
              >
                {isLassoActive ? "Deactivate Lasso" : "Activate Lasso"}
              </button>

              <button
                onClick={handleOpenPopup}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Add Account to Route
              </button>

              {isPopupOpen && (
                <RoutePopup
                  onClose={handleClosePopup}
                  onDone={handlePopupDone}
                  selectedAddresses={selectedAddresses}
                  addresses={addresses}
                  selectedLocation={selectedLocation}
                  lassoAddresses={lassoAddresses}
                />
              )}

              {/* Start Location Input */}
              <div>
              <label htmlFor="startLocation" className="block text-sm font-medium text-gray-700">
                Start Location
              </label>
                <input 
                placeholder="Start Location" 
                className=" px-1 py-0.5 border rounded-md focus:outline-none" 
                value={`${startLocation.address}, ${startLocation.city}, ${startLocation.state}, ${startLocation.zipCode}`} 
                onClick={handleGeocodeStartLocation}/>
              </div>

              <div className=" mt-2 no-scrollbar overflow-auto max-h-72">

             <ul>
                 {combinedAddresses && combinedAddresses.length > 0 ? (
                    combinedAddresses.map((address, index) => (
                 <DraggableAddress key={address._id} address={address} index={index} polylines={polylines} />
                 ))
               ) : (
                 <img src={NullAddress1} className="" />
                 )}
            </ul>

          </div>
              {/* End Location Input */}
              <div>
              <label htmlFor="endLocation" className=" mt-1 block text-sm font-medium text-gray-700">
                End Location
              </label>
                <input 
                placeholder="End Location" 
                className="px-1 py-0.5 border rounded-md focus:outline-none"
                value={`${endLocation.address}, ${endLocation.city}, ${endLocation.state}, ${endLocation.zipCode}`}  
                onClick={handleGeocodeEndLocation}/>
              </div>
              {polylines.length > 0 && (
                <div className="text-sm text-gray-600 mt-1">
                  <div>End Location Distance: {polylines[polylines.length - 1].distance}</div>
                  <div>End Location Duration: {polylines[polylines.length - 1].duration}</div>
                </div>
              )}
              <button
                onMouseDown={handleOptimizeDown}
                onMouseUp={handleOptimizeUp}
                onMouseLeave={handleOptimizeUp}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Optimize
              </button>
              <button
                onClick={handleSave}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Save
              </button>
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default CurrentRoute;