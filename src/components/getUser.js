export default function getUserID () {
    // Retrieve the JSON string from sessionStorage
    const userId = sessionStorage.getItem('userData');

  
    // Check if the string is not null or undefined
    if (userId) {
      // Parse the JSON string into an object
      const userData = JSON.parse(userId);
  
      // Access the CompanyID property
      const userID = userData._id;
  
      // Optionally, log the userID
      // console.log("User ID:", userID);
  
      // Return the userID
      return userID;
    } else {
      console.log("userData not found in sessionStorage");
      return null;
    }
  };

