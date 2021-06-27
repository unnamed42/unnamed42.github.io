import { useEffect, useState } from "preact/hooks";

type FetchResult<T> =
  { loading: false, data: T, error?: undefined } |
  { loading: false, data?: undefined, error: Error } |
  { loading: true, data?: undefined, error?: undefined };

interface FetchOptions {
  method?: "GET" | "POST";
  body?: BodyInit;
}

export const useFetch = <T = unknown>(url: string, options?: FetchOptions): FetchResult<T> => {
  const [result, setResult] = useState<FetchResult<T>>({
    loading: true,
  });
  useEffect(() => {
    fetch(url, options).then(response => response.json())
      .then(json => setResult({ data: json as T, loading: false }))
      .catch((e: Error) => setResult({ error: e, loading: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return result;
};
