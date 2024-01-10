import React, { useEffect, useState } from "react";
import fetchUserRoute from "../components/fetchUserRoute";
import { getRouteId } from "../components/fetchRoute";

function SavedRoutes(props) {
  const [userRoutes, setUserRoutes] = useState([]);
  const {handlePolylinesUpdate}=props;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRoutesData = await fetchUserRoute();

        // Fetch detailed information for each route
        const detailedRoutes = await Promise.all(
          userRoutesData.map((route) => getRouteId(route.RouteID))
        );

        setUserRoutes(detailedRoutes);
        console.log(detailedRoutes)
      } catch (error) {
        // Handle errors
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  
  const handleonclick = (route) => {
    console.log(route);
  
    // Update the polylines state using the prop function
    handlePolylinesUpdate(route.Route);
  };
  
 
  const handleDeleteRoute = async (routeId) => {
    try {
      // Assuming you have an API endpoint like `/api/routes/:routeId` for deleting routes
      const response = await fetch(`http://localhost:4000/api/deleteRoute/${routeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers needed, such as authorization headers
        },
      });
      console.log('Delete Response:', response);
      if (response.ok) {
        // Route successfully deleted, update the state or refetch the data
        setUserRoutes((prevRoutes) => prevRoutes.filter((route) => route.route._id !== routeId));
      } else {
        // Handle the case where the deletion was not successful
        console.error('Failed to delete route:', response.statusText);
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error deleting route:', error);
    }
  };

  const handleUpdateRoute = async (routeId, RouteName) => {
    try {
      const response = await fetch(`http://localhost:4000/api/updateRoute/${routeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers needed, such as authorization headers
        },
        body: JSON.stringify({ RouteName }),
      });
  
      if (!response.ok) {
        throw new Error(`Update failed with status ${response.status}`);
      }
  
      const updatedRoute = await response.json();
  
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
                type="checkbox"
                onChange={(e) => {
                  // Handle checkbox change if needed
                  console.log('Checkbox changed:', e.target.checked);
                }}
              />
              <label>Show all the Saved Routes</label>
      </div>
      <ul>
        {userRoutes.map((route) => (
          <li key={route.route._id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
