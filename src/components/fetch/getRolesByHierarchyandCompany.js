import api from "../../config/api";

export async function getRolesbyHierarchyandCompany(roleHierarchy,companyID){
    try {
      const response = await api.get(`/getRolesByHierarchyandCompany?rolehierarchy=${roleHierarchy}&companyID=${companyID}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching roles by hierarchy and company:', error);
      throw error;
    }
  }