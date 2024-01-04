import axios from "axios";


// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Replace this with your actual base URL
});

export default api;