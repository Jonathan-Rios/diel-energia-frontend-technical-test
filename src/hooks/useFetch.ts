import { api } from "@/lib/axios";
import { useEffect, useState } from "react";

export const useFetch = <T>(url: string) => {
  const [response, setResponse] = useState<T>();
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(url);
      setResponse(res.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const reloadData = () => {
    fetchData();
  };

  return { response, error, loading, reloadData };
};
