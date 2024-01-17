import api from "../../config/api";
import getUserID from "./getUser";

const fetchUserRoute = async () => {
  const userid = getUserID();

  try {
    const response = await api.get(`/getUserRoutes?userId=${userid}`);
    const { data } = response;

    // const userRoutes = Array.isArray(data.userRoutes) ? data.userRoutes : [];
    return data;
  } catch (error) {
    console.error('Error fetching user routes:', error);
    throw error;
  }
};

export default fetchUserRoute;