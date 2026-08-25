import { useState, useEffect } from "react";
import { useApi } from "../api/client";

export const useFetchData = (endpoint, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { apiFetch } = useApi();

  useEffect(() => {
    let isMounted = true;
    async function fetch() {
      try {
        setLoading(true);
        const response = await apiFetch(endpoint, options);
        if (isMounted) {
          setData(response);
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          console.log(error);
          setError(error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    if (endpoint) {
      fetch();
    }

    return () => {
      isMounted = false;
    };
  }, [endpoint, apiFetch]);

  return { loading, error, data };
};
