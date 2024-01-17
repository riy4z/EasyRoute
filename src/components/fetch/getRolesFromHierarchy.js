import api from "../../config/api";

export async function getRolesFromHierarchy(roleHierarchy) {
  try {
    const response = await api.get(`/getRolesByHierarchy?rolehierarchy=${roleHierarchy}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching roles by hierarchy:', error);
    throw error;
  }
}