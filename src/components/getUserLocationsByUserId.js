// getUserLocationsByUserId.js
export async function getUserLocationsByUserId(userId) {
    try {
      const response = await fetch(`http://localhost:4000/api/getUserLocations?userId=${userId}`);
      const { userLocations } = await response.json();
      return Array.isArray(userLocations) ? userLocations : [];
    } catch (error) {
      console.error('Error fetching user locations by user ID:', error);
      throw error;
    }
  }
  