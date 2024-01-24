import React, { useEffect, useState } from "react";
import fetchUserRoute from "../../components/fetch/fetchUserRoute";
import { getRouteId } from "../../components/fetch/fetchRoute";
import api from "../../config/api";

function SavedRoutes(props) {
  const [userRoutes, setUserRoutes] = useState([]);
  const {handlePolylinesUpdate,onSavedRouteClick}=props;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRoutesData = await fetchUserRoute();

        // Fetch detailed information for each route
        const detailedRoutes = await Promise.all(
          userRoutesData.map((route) => getRouteId(route.RouteID))
        );

        setUserRoutes(detailedRoutes);
      } catch (error) {
        // Handle errors
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);
  
  const handleonclick = (route) => {
  
    // Update the polylines state using the prop function
    handlePolylinesUpdate(route.Route);
    onSavedRouteClick(true)
  };
  
  
  const handleShowAll = () => {
    if (document.getElementById("showAllCheckbox").checked) {
      const updatedAllRoutes = userRoutes.map(route => route.route.Route);
      // Update the polylines state using the prop function
      handlePolylinesUpdate(updatedAllRoutes);
    } else {
      // If the checkbox is unchecked, clear the updatedAllRoutes
      handlePolylinesUpdate([]);
    }
  };
  
  
 
  const handleDeleteRoute = async (routeId) => {
    try {
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
        setUserRoutes((prevRoutes) => prevRoutes.filter((route) => route.route._id !== routeId));
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
  
      setUserRoutes((prevRoutes) =>
        prevRoutes.map((route) =>
          route.route._id === routeId ? { ...route, route: updatedRoute.route } : route
        )
      );
  
      console.log('Route updated successfully:', updatedRoute);
    } catch (error) {
      console.error('Error updating route name:', error.message);
    }
  };
  

  return (
    <div>
      <div>
      <input
  id="showAllCheckbox"
  type="checkbox"
  onChange={() => {
    // Handle checkbox change if needed
    handleShowAll();
  }}
/>
<span htmlFor="showAllCheckbox" className="text-xl"> Show all the saved routes</span>
      </div>
      <ul>
        {userRoutes.map((route) => (
          <li key={route.route._id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: "pointer" }}>
              <span onClick={()=>handleonclick(route.route)}>{route.route.RouteName}</span>
              <div>
                <button className="fa-solid fa-xmark" onClick={() => handleDeleteRoute(route.route._id)}></button>
                <button
                  className="fa-solid fa-pencil"
                  onClick={() => {
                    const newRouteName = prompt('Enter new route name:', route.route.RouteName);
                    if (newRouteName !== null) {
                      handleUpdateRoute(route.route._id, newRouteName);
                    }
                  }}
                ></button>
              </div>
            </div>

          </li>
        ))}
      </ul>
    </div>
  );
}

export default SavedRoutes;
