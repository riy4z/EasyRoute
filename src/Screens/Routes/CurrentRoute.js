import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import RoutePopup from './RoutePopup';
import NullAddress1 from '../../assets/images/NullAddress1.jpg';
import fetchLocations from '../../components/fetch/fetchLocations';
import fetchUserLocations from '../../components/fetch/fetchUserLocations';
import getUserID from "../../components/fetch/getUser";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import axios from "axios";
import getCompanyID from "../../components/fetch/getCompany";
import * as MapFunctions from "../../components/map/mapFunctions";
import config from "../../config/config";
import api from "../../config/api";


const CurrentRoute = ({ setLassoActivate, addresses, onSelectedAddresses, polylines, onUpdateStartLocation, onUpdateEndLocation, lassoComplete, // New prop
onOptimizeClick, onCustomRouteClick, onClearClick, savedRouteClick, selectedLocation}) => {
  const [isLassoActive, setIsLassoActive] = useState(false);
  const [isOptimized,setIsOptimized] = useState(false);
  const [combinedAddresses,setCombinedAddresses] = useState([]);
  const [isOptimizeSwitchOn, setIsOptimizeSwitchOn] = useState(true);
  const [firstLatLng, setFirstLatLng] = useState({});
  const [lastLatLng, setLastLatLng] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const [lassoAddresses, setLassoAddresses] = useState([]);
  const [startLocation, setStartLocation] = useState({});
  const [endLocation, setEndLocation] = useState({});
  const companyid = getCompanyID();
  const userid = getUserID();
  const DraggableAddress = ({ address, index, polylines }) => {
    const [routeDetails, setRouteDetails] = useState({ distance: "", duration: "" });
  
    useEffect(() => {
      if (index < polylines.length && polylines[index]) {
        const { distance, duration } = polylines[index];
        setRouteDetails({ distance, duration });
      }
    }, [index, polylines]);
  
    return (
      <Draggable draggableId={address._id ? address._id.toString() : `address-${index}`} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`border${snapshot.isDragging ? ' opacity-50' : ''} transition-opacity duration-200 ease-in-out px-0.5 py-1 relative text-sm font-medium rounded-md mt-1`}
          >
            <div className="pl-2">
            {address["First Name"]} {address["Last Name"]}</div>
              <hr className="ml-2 border-t border-gray-200 w-11/12" />
            <div className="text-xs pl-2 text-gray-600 font-normal">
              {index < polylines.length && (
                <>
 {routeDetails.distance} - {routeDetails.duration}
                </>
              )}
            </div>
          </div>
        )}
      </Draggable>
    );
  };
  
  
  //UseEffect to extract lat , lng from first and last item
  useEffect(() => {
  
  if (polylines.length > 0 && savedRouteClick) {
   
    const firstItemLat = polylines[0].latLngs.Ig[0].Ig[0].lat;
    const firstItemLng = polylines[0].latLngs.Ig[0].Ig[0].lng;
    setFirstLatLng({ lat: firstItemLat, lng: firstItemLng || {} });

    
    const lastItem = polylines[polylines.length - 1].latLngs.Ig[0].Ig;
    if (Array.isArray(lastItem) && lastItem.length > 0) {
      const lastItemIndex = lastItem.length - 1;
      const lastItemLat = lastItem[lastItemIndex].lat;
      const lastItemLng = lastItem[lastItemIndex].lng;
      setLastLatLng({ lat: lastItemLat, lng: lastItemLng || {} });
    }
  }
}, [polylines, savedRouteClick]);

//Reverse Geocoding
useEffect(() => {

  if (firstLatLng.lat && firstLatLng.lng) {
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${firstLatLng.lat},${firstLatLng.lng}&key=${config.googleMapsApiKey}`)
      .then(response => {
        const data = response.data;

        if (data.results && data.results.length > 0) {
          const formattedAddress = data.results[0].formatted_address;

          // Update the start location with formatted address and coordinates
          const geocodedStartLocation = {
            address: formattedAddress,
            latitude: firstLatLng.lat,
            longitude: firstLatLng.lng,
          };
          setStartLocation(geocodedStartLocation);

          // Call the onUpdateStartLocation function to update the parent component
          // onUpdateStartLocation(geocodedStartLocation);
        }
      })
      .catch(error => {
        console.error('Error fetching address:', error);
      });
  }

  // Reverse geocode the lastLatLng
  if (lastLatLng.lat && lastLatLng.lng) {
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lastLatLng.lat},${lastLatLng.lng}&key=${config.googleMapsApiKey}`)
      .then(response => {
        const data = response.data;

        if (data.results && data.results.length > 0) {
          const formattedAddress = data.results[0].formatted_address;

          // Update the end location with formatted address and coordinates
          const geocodedEndLocation = {
            address: formattedAddress,
            latitude: lastLatLng.lat,
            longitude: lastLatLng.lng,
          };
          setEndLocation(geocodedEndLocation);

          // Call the onUpdateEndLocation function to update the parent component
          // onUpdateEndLocation(geocodedEndLocation);
        }
      })
      .catch(error => {
        console.error('Error fetching address:', error);
      });
  }
}, [firstLatLng, lastLatLng, polylines, savedRouteClick]);


  const handleOptimizeDown = () => {
    if (!startLocation.address || !endLocation.address) {
      alert("Enter your start and end location for directions");
      return;
    }
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


  useEffect(() => {
    if (isOptimized && polylines) {
      const fetchAddressData = async () => {
        try {
          const slicedPolylines = await Promise.all(
            polylines.slice(1).map(async (obj) => {
              const addressData = await MapFunctions.getAddressDatabyMarker(obj.markerId);
  
              return {
                ...obj,
                City: addressData.City,
                CompanyID: addressData.CompanyID,
                "First Name": addressData["First Name"],
                "Last Name": addressData["Last Name"],
                LocationID: addressData.LocationID,
                State: addressData.State,
                "Street Address": addressData["Street Address"],
                "ZIP Code": addressData["ZIP Code"],
                isHidden: addressData.isHidden,
                latitude: addressData.latitude,
                longitude: addressData.longitude,
                __v: addressData.__v,
                _id: addressData._id,
              };
            })
          );
          setCombinedAddresses(slicedPolylines);
        } catch (error) {
          console.error('Error fetching address data:', error);
        }
      };
      
      fetchAddressData();
    }
  }, [isOptimized, polylines]);


  useEffect(() => {
    if (polylines && savedRouteClick) {
      const fetchAddressData = async () => {
        try {
          const slicedPolylines = await Promise.all(
            polylines.slice(1).map(async (obj) => {
              const addressData = await MapFunctions.getAddressDatabyMarker(obj.markerId);
  
              return {
                ...obj,
                City: addressData.City,
                CompanyID: addressData.CompanyID,
                "First Name": addressData["First Name"],
                "Last Name": addressData["Last Name"],
                LocationID: addressData.LocationID,
                State: addressData.State,
                "Street Address": addressData["Street Address"],
                "ZIP Code": addressData["ZIP Code"],
                isHidden: addressData.isHidden,
                latitude: addressData.latitude,
                longitude: addressData.longitude,
                __v: addressData.__v,
                _id: addressData._id,
              };
            })
          );
          setCombinedAddresses(slicedPolylines);
        } catch (error) {
          console.error('Error fetching address data:', error);
        }
      };
      
      fetchAddressData();
    }
  }, [polylines, savedRouteClick, setCombinedAddresses]);
  

// Fetch LassoAddresses by Marker
useEffect(() => {
  try {
    if (lassoComplete) {
      Promise.all(
        lassoComplete.map(async (item) => {
          return {
            ...await MapFunctions.getAddressDatabyMarker(item.markerId),
            markerId: item.markerId,
          };
        })
      ).then((addresses) => {
        setLassoAddresses(addresses);
        onSelectedAddresses(addresses);
      });
    } else {
      console.log("lassoComplete is null or undefined");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}, [lassoComplete]);




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
    // onSelectedAddresses(newAddresses);
    
  };

const handleGeocodeStartLocation = async (value) => {
  try {
    const results = value ? await geocodeByAddress(value) : [];
    const latLng = results.length > 0 ? await getLatLng(results[0]) : {};

    const geocodedStartLocation = {
      address: value || "",
      latitude: latLng.lat || undefined,
      longitude: latLng.lng || undefined,
    };

    setStartLocation(geocodedStartLocation);
    onUpdateStartLocation(geocodedStartLocation);
  } catch (error) {
    console.error('Error geocoding start location:', error);
  }
};
 const handleGeocodeEndLocation = async (value) => {
  try {
    const results = value ? await geocodeByAddress(value) : [];
    const latLng = results.length > 0 ? await getLatLng(results[0]) : {};

    const geocodedEndLocation = {
      address: value || "",
      latitude: latLng.lat || undefined,
      longitude: latLng.lng || undefined,
    };

    setEndLocation(geocodedEndLocation);
    onUpdateEndLocation(geocodedEndLocation);
  } catch (error) {
    console.error('Error geocoding end location:', error);
  }
};
  const handleToggleSwitch = () => {
    setIsOptimizeSwitchOn(!isOptimizeSwitchOn);
  };
    
  useEffect(() => {
    // Set onSelectedAddresses whenever combinedAddresses is updated, but only if lassoAddresses or selectedAddresses change
    const updatedCombinedAddresses = lassoAddresses.length > 0 ? [...lassoAddresses, ...selectedAddresses] : selectedAddresses;
    onSelectedAddresses(updatedCombinedAddresses);
    setCombinedAddresses(updatedCombinedAddresses)
  }, [lassoAddresses, selectedAddresses]);

const handleClearDown = () => {
  setLassoAddresses([]);
  setSelectedAddresses([]);
  setCombinedAddresses([]);
  onSelectedAddresses([]);
  onUpdateEndLocation([]);
  onUpdateStartLocation([]);
  handleGeocodeStartLocation("");  // Set the start location address to an empty string
  handleGeocodeEndLocation("");
  setIsLassoActive(false);
  setLassoActivate(false);   // Set the end location address to an empty string
  setStartLocation({});           // Reset the start location object
  setEndLocation({});
  setFirstLatLng({});
  setLastLatLng({});
  setIsOptimized(false);
  setIsOptimizeSwitchOn(true);              // Reset the end location object
  onClearClick(true);
};

const handleClearUp = () =>{
  onClearClick(false);
}



  
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
  
      // Extract coordinates from polyline data
      const route = polylines.map(obj => ({
        latLngs: obj.latLngs,
        strokeColor: obj.strokeColor,
        strokeOpacity: obj.strokeOpacity,
        strokeWeight: obj.strokeWeight,
        visible: obj.visible,
        distance: obj.distance,
        duration: obj.duration,
        markerId: obj.markerId,
      }));
  
      const data = {
        Route: route,
        CompanyID: companyid,
        LocationID: selectedLocation,
        RouteName: routeName,
      };
  
      api.post('/saveRoute', data)
        .then(response => {
          // Handle the response from the backend if needed
          const RouteID = response.data.route._id;
          api.post('/addUserRoute', { userId: userid, routeId: RouteID })
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

              <div className="flex items-center mt-4">
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
        <span className="text-sm font-medium text-gray-600 ml-2">{isOptimizeSwitchOn ? "Optimized Route" : "Custom Route"}</span>
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
                <label htmlFor="startLocation" className="block ml-1 text-sm font-medium text-gray-700">
                  Start Location
                </label>
                <PlacesAutocomplete
                  value={startLocation.address || ""}
                  onChange={(value) => setStartLocation((prev) => ({ ...prev, address: value }))}
                  onSelect={(value) => handleGeocodeStartLocation(value)}
                >
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="relative">
                      <input
                        {...getInputProps({
                          placeholder: 'Enter Start Location',
                          className: 'w-full px-1 py-2 border text-sm text-left font-medium rounded-md focus:outline-none',
                        })}
                      />
                      <div
                        className="absolute top-14 left-0 z-50 w-full max-h-72 overflow-y-auto bg-white rounded-md shadow-md"
                      >
                        {loading && <div className="text-lg">Loading...</div>}
                        {suggestions.length > 0 && (
                          <ul
                          className="p-0 m-0 list-none"
                          >
                            {suggestions.map((suggestion, index) => (
                              <li
                                key={index}
                                {...getSuggestionItemProps(suggestion, {
                                  className : "p-0.5 border-b text-sm border-gray-300 cursor-pointer",
                                })}
                              >
                                <div
                                  style={{
                                    backgroundColor: suggestion.active ? '#ddd' : 'transparent', // Highlight color on hover
                                  }}
                                >
                                  {suggestion.description}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              </div>


              <div className=" mt-2 no-scrollbar overflow-auto max-h-72">

             <ul>
             <span  className="block mt-0 ml-1 text-sm font-medium text-gray-700">
                  Accounts
                </span>
                 {combinedAddresses && combinedAddresses.length > 0 ? (
                    combinedAddresses.map((address, index) => (
                 <
                  DraggableAddress key={address._id} address={address} index={index} polylines={polylines} className="bg-blue-500 p-4 rounded-lg shadow-md mb-4"/>
                 ))
               ) : (
                <li className="list-none">
                {combinedAddresses.length === 0 ?  (
                  <img src={NullAddress1} alt="No addresses" />
                ) : null}
              </li>
                 )}
            </ul>

          </div>
              {/* End Location Input */}
              <div>
                <label htmlFor="endLocation" className="mt-1 ml-1 block text-sm font-medium text-gray-700">
                  End Location
                </label>
                <PlacesAutocomplete   
                  value={endLocation.address || ""}
                  onChange={(value) => setEndLocation((prev) => ({ ...prev, address: value }))}
                  onSelect={(value) => handleGeocodeEndLocation(value)}
                >
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="relative">
                      <input
                        {...getInputProps({
                          placeholder: 'End Location',
                          className: 'w-full px-1 py-2 border font-medium text-sm text-left rounded-md focus:outline-none',
                        })}
                      />
                      <div
                        className="absolute bottom-14 left-0 z-50 w-full max-h-72 overflow-y-auto bg-white rounded-md shadow-md"
                      >
                        {loading && <div className="text-lg">Loading...</div>}
                        {suggestions.length > 0 && (
                          <ul
                          className="p-0 m-0 list-none"
                          >
                            {suggestions.map((suggestion, index) => (
                              <li
                                key={index}
                                {...getSuggestionItemProps(suggestion, {
                                  className : "p-0.5 border-b text-sm border-gray-300 cursor-pointer",
                                })}
                              >
                                <div
                                  style={{
                                    backgroundColor: suggestion.active ? '#ddd' : 'transparent', // Highlight color on hover
                                  }}
                                >
                                  {suggestion.description}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              </div>


              {polylines.length > 0 && (
                <div className="text-xs pl-2 text-gray-600 ">
                  {polylines[polylines.length - 1].distance} - {polylines[polylines.length - 1].duration}
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
              <button
                onMouseDown={handleClearDown}
                onMouseUp={handleClearUp}
                onMouseLeave={handleClearUp}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Clear
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