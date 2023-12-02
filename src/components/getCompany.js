export default function getCompanyID () {
    // Retrieve the JSON string from sessionStorage
    const companyString = sessionStorage.getItem('userData');
  
    // Check if the string is not null or undefined
    if (companyString) {
      // Parse the JSON string into an object
      const companyData = JSON.parse(companyString);
  
      // Access the CompanyID property
      const companyId = companyData.CompanyID;
  
      // Optionally, log the companyId
      console.log("Company ID:", companyId);
  
      // Return the companyId
      return companyId;
    } else {
      console.log("userData not found in sessionStorage");
      return null;
    }
  };