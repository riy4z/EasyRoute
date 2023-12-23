import React, { useEffect, useState } from "react";
import fetchUserRoute from "../components/fetchUserRoute";
import { getRouteId } from "../components/fetchRoute";

function SavedRoutes() {
  const [userRoutes, setUserRoutes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const UserRoute = await fetchUserRoute();
        setUserRoutes(UserRoute);
      } catch (error) {
        // Handle errors
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>User Routes:</h1>
      <ul>
        {userRoutes.map((route) => (
          <li key={route._id}>
            RouteID: {route.RouteID}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SavedRoutes;
