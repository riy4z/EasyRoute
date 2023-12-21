export async function getRolesFromHierarchy(roleHierarchy) {
    try {
      const response = await fetch(`http://localhost:4000/api/getRolesByHierarchy?rolehierarchy=${roleHierarchy}`);
      const roles = await response.json();
      return roles;
    } catch (error) {
      console.error('Error fetching roles by hierarchy:', error);
      throw error;
    }
  }
  