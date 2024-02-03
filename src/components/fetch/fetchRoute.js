import api from "../../config/api";

export async function getRoute( locationId) {
  try {
    const response = await api.get(`/getRoutes/${locationId}`);
    const route = response.data;
    return route;
  } catch (error) {
    console.error('Error fetching route by ID:', error);
    throw error;
  }
}
