import api from "../config/api";

export async function getUsersByCompany(companyId) {
  try {
    const response = await api.get('/getUsersByCompany', {
      params: {
        companyId: companyId
      }
    });
    const users = response.data;
    return users;
  } catch (error) {
    console.error('Error fetching users by CompanyID:', error);
    throw error;
  }
}
