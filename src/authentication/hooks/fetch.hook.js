import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from '../helper/helper';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN || 'http://localhost:4000/';

/** custom hook */
export default function useFetch(query) {
  const [getData, setData] = useState({ isLoading: false, apiData: undefined, status: null, serverError: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData((prev) => ({ ...prev, isLoading: true }));

        const username = !query ? (await getUsername()).username : '';

        const { data, status } = !query ? await axios.get(`/api/user/${username}`) : await axios.get(`/api/${query}`);

        setData((prev) => ({ ...prev, apiData: data, status: status, isLoading: false }));
      } catch (error) {
        console.error('An error occurred during data fetch:', error);
        setData((prev) => ({ ...prev, isLoading: false, serverError: error }));
      }
    };

    fetchData();
  }, [query]);

  return [getData, setData];
}
