import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import RoutePopup from './RoutePopup';
import NullAddress1 from '../assets/images/NullAddress1.jpg';
import fetchLocations from '../components/fetchLocations';
import fetchUserLocations from '../components/fetchUserLocations';
import getUserID from "../components/getUser";
import axios from "axios";
import getCompanyID from "../components/getCompany";

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
          className={`border${snapshot.isDragging ? ' opacity-50' : ''} transition-opacity duration-200 ease-in-out p-1 relative`}
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


const CurrentRoute = ({ setLassoActivate, addresses, onSelectedAddresses, polylines, onUpdateStartLocation, onUpdateEndLocation}) => {
  const [isLassoActive, setIsLassoActive] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const [userLocations, setUserLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [Locations, setLocations] = useState([]);
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

  console.log(polylines)

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

    const newAddresses = [...selectedAddresses];
    const [reorderedItem] = newAddresses.splice(result.source.index, 1);
    newAddresses.splice(result.destination.index, 0, reorderedItem);
    setSelectedAddresses(newAddresses);
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
      // setStartLocation(newStartLocation);
      // onUpdateStartLocation(newStartLocation) // Pass the updated start location to the parent component
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
      // setEndLocation(newEndLocation);
      // onUpdateEndLocation(newEndLocation)
    }
  };
 console.log(startLocation)
 console.log(endLocation)
  return (
    <DragDropContext onDragEnd={handleAddressReorder}>
      <Droppable droppableId="selectedAddresses">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <div>
              <br />
              <select
                id="locationDropdown"
                onChange={(e) => setSelectedLocation(e.target.value)}
                value={selectedLocation}
                className="mt-2"
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
                />
              )}

              {/* Start Location Input */}
              <div>
              <label htmlFor="startLocation" className="block text-sm font-medium text-gray-700">
                Start Location
              </label>
                <input 
                placeholder="Start Location" 
                className="mt-2 px-1 py-1 border rounded-md focus:outline-none" 
                value={`${startLocation.address}, ${startLocation.city}, ${startLocation.state}, ${startLocation.zipCode}`} 
                onClick={handleGeocodeStartLocation}/>
              </div>

              <div className=" mt-2 no-scrollbar overflow-auto max-h-96">
                {selectedAddresses && selectedAddresses.length > 0 ? (
                  <ul>
                    {selectedAddresses.map((address, index) => (
                      <DraggableAddress key={address._id} address={address} index={index} polylines={polylines} />
                    ))}
                  </ul>
                ) : (
                  <img src={NullAddress1} className="" />
                )}
              </div>
              {/* End Location Input */}
              <div>
              <label htmlFor="endLocation" className=" mt-2 block text-sm font-medium text-gray-700">
                End Location
              </label>
                <input 
                placeholder="End Location" 
                className="mt-2 px-1 py-1 border rounded-md focus:outline-none"
                value={`${endLocation.address}, ${endLocation.city}, ${endLocation.state}, ${endLocation.zipCode}`}  
                onClick={handleGeocodeEndLocation}/>
              </div>
              {polylines.length > 0 && (
                <div className="text-sm text-gray-600 mt-2">
                  <div>End Location Distance: {polylines[polylines.length - 1].distance}</div>
                  <div>End Location Duration: {polylines[polylines.length - 1].duration}</div>
                </div>
              )}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default CurrentRoute;