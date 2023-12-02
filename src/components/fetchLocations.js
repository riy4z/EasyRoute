// fetchLocations.js
import getCompanyID from './getCompany';

const fetchLocations = async () => {
  const companyid = getCompanyID();
  try {
    const response = await fetch(`http://localhost:4000/api/getLocations?companyid=${companyid}`);
    const locationsFromServer = await response.json();
    return locationsFromServer;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error; // Rethrow the error so that the calling component can handle it
  }
};

export default fetchLocations;
