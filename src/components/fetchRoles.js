import api from "../config/api";
import getCompanyID from "./getCompany";

const fetchRoles = async () => {
  const companyid = getCompanyID();
  try {
    const response = await api.get(`/getRoles?companyid=${companyid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export default fetchRoles;
