import api from "../config/api";

export async function getUserLocationsByUserId(userId) {
  try {
    // Use Axios to make the request
    const response = await api.get(`/getUserLocations?userId=${userId}`);
    
    // Destructure the data property from the response
    const { userLocations } = response.data;

    // Check if userLocations is an array, if not, return an empty array
    return Array.isArray(userLocations) ? userLocations : [];
  } catch (error) {
    // Handle errors
    console.error('Error fetching user locations by user ID:', error);
    throw error;
  }
}