export default function getRoleHierarchy () {
    // Retrieve the JSON string from sessionStorage
    const roleHierarchyNumber = sessionStorage.getItem('userData');
    
  
    // Check if the string is not null or undefined
    if (roleHierarchyNumber) {
      // Parse the JSON string into an object
      const roleHierarchyData = JSON.parse(roleHierarchyNumber);
  
      // Access the RoleHierarchy property
      const roleHierarchy = roleHierarchyData.RoleHierarchy;
  
      // Optionally, log the roleHierarchy
      // console.log("RoleHierarchy:", roleHierarchy);
  
      // Return the roleHierarchy
      return roleHierarchy;
    } else {
      console.log("userData not found in sessionStorage");
      return null;
    }
  };