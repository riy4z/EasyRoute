import React, { useEffect, useState } from "react";
import fetchUserRoute from "../components/fetchUserRoute";
import { getRouteId } from "../components/fetchRoute";
import api from "../config/api";

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


 
  const buttonStyle = {
    marginLeft: '10px', // Add margin for spacing
    cursor: 'pointer', // Add a pointer cursor for better UX
  };

  
  const handleDeleteRoute = async (routeId) => {
    try {
      const response = await api.delete(`/deleteRoute/${routeId}`, {
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers needed, such as authorization headers
        },
      });
      console.log('Delete Response:', response);
      if (response.status === 200) {
        setUserRoutes((prevRoutes) => prevRoutes.filter((route) => route.route._id !== routeId));
      } else {
        console.error('Failed to delete route:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };


  const handleUpdateRoute = async (routeId, RouteName) => {
    try {
      const response = await api.patch(`/updateRoute/${routeId}`, {
        RouteName,
      }, {
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers needed, such as authorization headers
        },
      });

      if (response.status === 200) {
        const updatedRoute = response.data;

        setUserRoutes((prevRoutes) =>
          prevRoutes.map((route) =>
            route.route._id === routeId ? { ...route, route: updatedRoute.route } : route
          )
        );

        console.log('Route updated successfully:', updatedRoute);
      } else {
        throw new Error(`Update failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating route name:', error.message);
    }
  };
  

  return (
    <div>
      <ul>
        {userRoutes.map((route) => (
          <li key={route.route._id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{route.route.RouteName}</span>
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
