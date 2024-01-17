import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from '../helper/helper';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN || 'http://localhost:4000/';

/** custom hook */
export default function useFetch(query) {
  const storageKey = `userData`;
  const [getData, setData] = useState({
    isLoading: false,
    apiData: undefined,
    status: null,
    serverError: null,

});

useEffect(() => {
  const fetchData = async () => {
    try {
      setData((prev) => ({ ...prev, isLoading: true }));

      
      const storedData = sessionStorage.getItem(storageKey);

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setData((prev) => ({ ...prev, apiData: parsedData, isLoading: false }));
        return;
      }

      const username = !query ? (await getUsername()).username : '';

      const { data, status } = !query
        ? await axios.get(`/api/user/${username}`)
        : await axios.get(`/api/${query}`);

      
      sessionStorage.setItem(storageKey, JSON.stringify(data));

      setData((prev) => ({ ...prev, apiData: data, status, isLoading: false }));
    } catch (error) {
      console.error('An error occurred during data fetch:', error);
      setData((prev) => ({ ...prev, isLoading: false, serverError: error }));
    }
  };

  fetchData();
}, [query, storageKey]);

const clearSessionStorage = () => {

  sessionStorage.removeItem(storageKey);
};

return [getData, setData, clearSessionStorage];
}