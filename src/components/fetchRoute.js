export async function getRouteId(routeId) {
  try {
      const response = await fetch(`http://localhost:4000/api/getRoutes/${routeId}`);
      const route = await response.json();
      return route;
  } catch (error) {
      console.error('Error fetching route by ID:', error);
      throw error;
  }
}
