export async function getUsersByCompany(companyId) {
    try {
      const response = await fetch(`http://localhost:4000/api/getUsersByCompany?companyId=${companyId}`);
      const users = await response.json();
      return users;
    } catch (error) {
      console.error('Error fetching users by CompanyID:', error);
      throw error;
    }
  }
  