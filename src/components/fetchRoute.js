import api from "../config/api";

export async function getRouteId(routeId) {
  try {
    const response = await api.get(`/getRoutes/${routeId}`);
    const route = response.data;
    return route;
  } catch (error) {
    console.error('Error fetching route by ID:', error);
    throw error;
  }
}
