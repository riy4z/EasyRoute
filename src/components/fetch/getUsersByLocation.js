import api from "../../config/api";

export async function getUsersByLocation(locationId) {
  try {
    const response = await api.get('/getUsersByLocation', {
      params: {
        locationId: locationId
      }
    });
    const users = response.data;
    return users;
  } catch (error) {
    console.error('Error fetching users by LocationID:', error);
    throw error;
  }
}
