export async function getCompanyById(companyId) {
    try {
      const response = await fetch(`http://localhost:4000/api/getCompanyById?companyId=${companyId}`);
      const company = await response.json();
      return company;
    } catch (error) {
      console.error('Error fetching company by ID:', error);
      throw error;
    }
  }