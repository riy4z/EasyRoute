import getCompanyID from "./getCompany";


const fetchRoles = async () => {
  const companyid = getCompanyID();
  try {
    const response = await fetch(`http://localhost:4000/api/getRoles?companyid=${companyid}`);
    const rolesFromServer = await response.json();
    return rolesFromServer;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export default fetchRoles;