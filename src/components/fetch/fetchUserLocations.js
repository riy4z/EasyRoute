// fetchUserLocations.js
import getUserID from "./getUser";
import api from "../../config/api";

const fetchUserLocations = async () => {
  const userid = getUserID();
  try {
    const response = await api.get(`/getUserLocations`, {
      params: {
        userId: userid,
      },
    });

    const { userLocations } = response.data;
    return Array.isArray(userLocations) ? userLocations : [];
  } catch (error) {
    console.error('Error fetching user locations:', error);
    throw error;
  }
};

export default fetchUserLocations;
