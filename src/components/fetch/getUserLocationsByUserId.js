import api from "../../config/api";

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

export async function deleteUserLocation  (userId, locationId)  {
  try {
    // Make an API call to delete the user's location
    const response = await api.delete('/deleteUserLocation', {
      data: {
        userId: userId,
        locationId: locationId
      }
    });
    
    
    // Check if the deletion was successful
    if (response.status === 200) {
      console.log('Location deleted successfully');
    } else {
      console.error('Failed to delete location');
      // You can throw an error or handle the failure in some other way
    }
  } catch (error) {
    console.error('Error deleting location:', error);
    // Handle the error as needed
    throw error;
  }
};

export async function addUserLocation  (userId, locationId, role)  {
  try {
    // Make an API call to add the location to the user
    const response = await api.post(`/addUserLocation`, { userId, locationId, role });

    // Check if the addition was successful
    if (response.status === 201) {
      console.log('Location added successfully');
    } else {
      console.error('Failed to add location');
      // You can throw an error or handle the failure in some other way
    }
  } catch (error) {
    console.error('Error adding location:', error);
    // Handle the error as needed
    throw error;
  }
};