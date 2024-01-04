import api from "../config/api";

export async function getCompanyById(companyId) {
  try {
    const response = await api.get(`/getCompanyById?companyId=${companyId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching company by ID:', error);
    throw error;
  }
}