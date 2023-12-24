import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import RoutePopup from './RoutePopup';
import NullAddress1 from '../assets/images/NullAddress1.jpg';
import fetchLocations from '../components/fetchLocations';
import fetchUserLocations from '../components/fetchUserLocations';
import getUserID from "../components/getUser";
import * as MapFunctions from "../components/mapFunctions";
import getCompanyID from '../components/getCompany';
import axios from 'axios';


const DraggableAddress = ({ children, index, selectedAddresses, setSelectedAddresses, onReorder }) => {
  const [routeDetails, setRouteDetails] = useState({ distance: "", duration: "" });
 

  useEffect(() => {
    const calculateRouteDetails = async () => {
      if (index < selectedAddresses.length - 1) {
        const origin = selectedAddresses[index];

        const destination = selectedAddresses[index + 1];
        // Exclude additional properties like _id
        const originMarker = { position: { lat: origin.latitude, lng: origin.longitude } };
        const destinationMarker = { position: { lat: destination.latitude, lng: destination.longitude } };
  
        const markers = [originMarker, destinationMarker];
  
        const details = await MapFunctions.getRoutesDetailsBetweenMarkers(markers);
  
        setRouteDetails(details[0]);
      }
    };
  
    calculateRouteDetails();
  }, [selectedAddresses, index]);

  const [{ isDragging }, drag] = useDrag({
    type: 'ADDRESS',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'ADDRESS',
    hover: (draggedItem) => {
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const newAddresses = [...selectedAddresses];
      [newAddresses[dragIndex], newAddresses[hoverIndex]] = [newAddresses[hoverIndex], newAddresses[dragIndex]];

      setSelectedAddresses(newAddresses);
      onReorder(dragIndex, hoverIndex);
    },
  });

  return (
    <div className={`border${isDragging ? ' opacity-50' : ''} transition-opacity duration-200 ease-in-out p-2 relative`}>
      <div ref={(node) => drag(drop(node))} className="cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <i className="fa-solid fa-grip-lines ml-52"></i>
      </div>
      {children}
      <div className="mt-2 text-sm text-gray-600">
        {index < selectedAddresses.length - 1 && (
          <>
            <div>Distance: {routeDetails.distance}</div>
            <div>Duration: {routeDetails.duration}</div>
          </>
        )}
      </div>
      <hr className="my-0 border-t border-gray-300" />
    </div>
  );
};

const CurrentRoute = ({ setLassoActivate, addresses, onSelectedAddresses }) => {
  const [isLassoActive, setIsLassoActive] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const [userLocations, setUserLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [Locations, setLocations] = useState([]);
  const companyid = getCompanyID();
  const userid=getUserID();
  const [routeid , setRouteId]= useState();
  const markers = [];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = getUserID(); // Replace with your logic to get the user ID

        // Fetch user-specific locations
        const userLocationsData = await fetchUserLocations(userId);
        setUserLocations(userLocationsData);

        // Fetch all locations
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
      // Show a message or take any action to prompt the user to select a location
      alert("Please select a location before adding an account.");
      return;
    }
  
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handlePopupDone = (newlySelectedAddresses) => {
    // Filter out duplicates based on a unique identifier (e.g., _id)
    const uniqueNewAddresses = newlySelectedAddresses.filter(
      (newAddress) => !selectedAddresses.some((existingAddress) => existingAddress._id === newAddress._id)
    );

    // Remove addresses that are unchecked in the popup
    const updatedAddresses = selectedAddresses.filter(
      (existingAddress) => newlySelectedAddresses.some((newAddress) => newAddress._id === existingAddress._id)
    );

    // Add newly selected addresses to the reordered list
    updatedAddresses.push(...uniqueNewAddresses);

    setSelectedAddresses(updatedAddresses);
    onSelectedAddresses(updatedAddresses);
    handleClosePopup();
  };

  const handleAddressReorder = (dragIndex, hoverIndex) => {
    const newAddresses = [...selectedAddresses];
    const [draggedItem] = newAddresses.splice(dragIndex, 1);
    newAddresses.splice(hoverIndex, 0, draggedItem);
    setSelectedAddresses(newAddresses);
  };


  useEffect(() => {
    onSelectedAddresses(selectedAddresses);
  }, [selectedAddresses]);

  const handleSave = () => {
    try{
      const data = {
        Route: markers.map(marker => marker.position),
        CompanyID: companyid,
        RouteNumber: 1,
      };
      axios.post('http://localhost:4000/api/saveRoute', data)
      .then(response => {
        // Handle the response from the backend if needed
        setRouteId(response.data.route._id);
        axios.post('http://localhost:4000/api/addUserRoute', {userId:userid, routeId:routeid})
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
    <DndProvider backend={HTML5Backend}>
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
                {location ? location.Location : 'Unknown Location'}
              </option>
            );
          })}
        </select>

        <button
          onClick={handleLassoClick}
          className={`text-white ${
            isLassoActive ? "bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300" : "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
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

        {isPopupOpen && <RoutePopup onClose={handleClosePopup} onDone={handlePopupDone} selectedAddresses={selectedAddresses} addresses={addresses} selectedLocation={selectedLocation} />}

        <div className=" mt-10 no-scrollbar overflow-auto max-h-96">
          {selectedAddresses && selectedAddresses.length > 0 ? (
            <ul>
              {selectedAddresses.map((address, index) => (
                <DraggableAddress
                  key={address._id}
                  index={index}
                  selectedAddresses={selectedAddresses}
                  setSelectedAddresses={setSelectedAddresses}
                  onReorder={handleAddressReorder}
                  
                >
                  {address["First Name"]} {address["Last Name"]}
                </DraggableAddress>
              ))}
            </ul>
          ) : (
            <img src={NullAddress1} className="mt-10" />
          )}
             <div>
<button  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Save</button>
</div>
        </div>

        {selectedAddresses && selectedAddresses.length > 0 && (
          <button  onClick={handleSave} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none">
            Optimize
          </button>
       
        )}
      </div>
    </DndProvider>
  );
};

export default CurrentRoute;
