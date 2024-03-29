import React, { useEffect, useState } from "react";
import fetchUserRoute from "../../components/fetch/fetchUserRoute";
import { getRoute } from "../../components/fetch/fetchRoute";
import api from "../../config/api";

function SavedRoutes(props) {
  const [userRoutes, setUserRoutes] = useState([]);
  const {handlePolylinesUpdate,onSavedRouteClick, selectedLocation}=props;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const routes = await getRoute(selectedLocation); // Fetch all routes for selected location
  
        setUserRoutes(routes.route);
      } catch (error) {
        // Handle errors
        console.error('Error:', error);
      }
    };
  
    fetchData();
  }, [selectedLocation]);
  
  const handleonclick = (route) => {
  
    // Update the polylines state using the prop function
    handlePolylinesUpdate(route.Route);
    onSavedRouteClick(true)
  };
  
  
  const handleShowAll = () => {
    if (document.getElementById("showAllCheckbox").checked) {
      const updatedAllRoutes = userRoutes.map(route => route.Route);
      // Update the polylines state using the prop function
      handlePolylinesUpdate(updatedAllRoutes);
    } else {
      // If the checkbox is unchecked, clear the updatedAllRoutes
      handlePolylinesUpdate([]);
    }
  };
  
  
 
  const handleDeleteRoute = async (routeId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this route?');

      if (!confirmDelete) {
        return; // User canceled the deletion
      }
      // Assuming you have an API endpoint like `/api/routes/:routeId` for deleting routes
      const response = await api.delete(`/deleteRoute/${routeId}`, {
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers needed, such as authorization headers
        },
      });
  
      console.log('Delete Response:', response);
  
      if (response.status === 200) {
        // Route successfully deleted, update the state or refetch the data
        setUserRoutes((prevRoutes) => prevRoutes.filter((route) => route._id !== routeId));
      } else {
        // Handle the case where the deletion was not successful
        console.error('Failed to delete route:', response.statusText);
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error deleting route:', error.message);
    }
  };

  const handleUpdateRoute = async (routeId, RouteName) => {
    try {
      const response = await api.patch(`/updateRoute/${routeId}`, {
        RouteName
      }, {
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers needed, such as authorization headers
        },
      });
  
      if (response.status !== 200) {
        throw new Error(`Update failed with status ${response.status}`);
      }
  
      const updatedRoute = response.data;

      setUserRoutes(prevRoutes =>
        prevRoutes.map(route =>
          route._id === routeId ? { ...route, RouteName: RouteName } : route
        )
      );
  
      console.log('Route updated successfully:', updatedRoute);
    } catch (error) {
      console.error('Error updating route name:', error.message);
    }
  };
  
console.log(userRoutes  )
  return (
    <div className=" p-1  leading-loose">
      <div className="ml-1">
      <input
  id="showAllCheckbox"
  type="checkbox"
  onChange={() => {
    // Handle checkbox change if needed
    handleShowAll();
  }}
/>
<span htmlFor="showAllCheckbox" className="ml-1 text-sm font-medium"> Show all saved routes</span>
      </div>
      <div className="mt-2">
      <ul>
        {userRoutes.map((route) => (
          <li key={route._id} className='border-b border-gray-200  overflow-y-auto p-1 text-lg font-normal hover:bg-gray-100 block'> 
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: "pointer" }}>
              <span onClick={()=>handleonclick(route)}>{route.RouteName}</span>
              <div>
                <button
                  className="fa-solid fa-pencil  px-4"
                  onClick={() => {
                    const newRouteName = prompt('Enter new route name:', route.RouteName);
                    if (newRouteName !== null) {
                      handleUpdateRoute(route._id, newRouteName);
                    }
                  }}
                ></button>
                  <button className="fa-solid fa-xmark" onClick={() => handleDeleteRoute(route._id)}></button>
              </div>
            </div>

          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}

export default SavedRoutes;
