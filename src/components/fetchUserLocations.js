// fetchUserLocations.js
import getUserID from "./getUser";

const fetchUserLocations = async () => {
  const userid = getUserID();
  try {
    const response = await fetch(`http://localhost:4000/api/getUserLocations?userId=${userid}`);
    const { userLocations } = await response.json();
    return Array.isArray(userLocations) ? userLocations : [];
  } catch (error) {
    console.error('Error fetching user locations:', error);
    throw error;
  }
};

export default fetchUserLocations;
