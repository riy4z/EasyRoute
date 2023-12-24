import React, { useEffect, useState } from "react";
import fetchUserRoute from "../components/fetchUserRoute";
import { getRouteId } from "../components/fetchRoute";

function SavedRoutes() {
  const [userRoutes, setUserRoutes] = useState([]);

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

  // const handleDeleteRoute = async (routeId) => {
  //   // Implement the logic to delete the route with the given routeId
  //   // You can make an API call or update the state accordingly
  //   console.log("Deleting route with ID:", routeId);
  // };
 
  const buttonStyle = {
    marginLeft: '10px', // Add margin for spacing
    cursor: 'pointer', // Add a pointer cursor for better UX
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


  return (
    <div>
      <ul>
        {userRoutes.map((route) => (
          <li key={route.route._id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{route.route.RouteName}</span>
              <button className="fa-solid fa-xmark" style={buttonStyle} onClick={() => handleDeleteRoute(route.route._id)}></button>
            </div>
            {/* Display other route details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SavedRoutes;
