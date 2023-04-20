import { useState, useEffect } from 'react';

interface UseFetchProps<T> {
  url: string;
  ref: React.MutableRefObject<boolean>;
}

interface UseFetchReturn<T> {
  loading: boolean;
  data: T | null;
  error: string | null;
}

interface UseFetchReturn<T> {
  loading: boolean;
  data: T | null;
  error: string | null;
}

export const useFetch = <T>({
  url,
  ref,
}: UseFetchProps<T>): UseFetchReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    ref.current = true;
    if (ref.current) {
      (async () => {
        try {
          const res = await fetch(url);
          const resJson = await res.json();
          setData(resJson);
          setError(null);
        } catch (err) {
          setError(`Problem fetching ${url}`);
        } finally {
          setLoading(false);
        }
      })();
    }
    return () => {
      ref.current = false;
    };
  }, [url, ref]);

  return { loading, data, error };
};
