// fetchLocations.js
import getCompanyID from './getCompany';
import api from '../config/api';

const fetchLocations = async () => {
  const companyid = getCompanyID();
  try {
    const response = await api.get(`/getLocations`, {
      params: {
        companyid: companyid,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error; // Rethrow the error so that the calling component can handle it
  }
};

export default fetchLocations;
