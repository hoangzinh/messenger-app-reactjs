import { useCallback, useState } from 'react';

type Method = 'GET' | 'PUT' | 'POST' | 'DELETE';

type ApiConfigs = {
  endpoint: RequestInfo;
  method?: Method;
  onComplete?: (data: Object) => void;
  onFailed?: (error: Object) => void;
};

type fetcherOptions = {
  body?: Object;
};

const useApi = ({
  endpoint,
  method = 'GET',
  onComplete,
  onFailed,
}: ApiConfigs) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetcher = useCallback(
    ({ body }: fetcherOptions = {}) =>
      fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then((data) => data.json())
        .then((data) => {
          setData(data);
          onComplete && onComplete(data);
        })
        .catch((error) => {
          setError(error);
          onFailed && onFailed(error);
        }),
    [method, endpoint, onComplete, onFailed]
  );

  const isLoading: boolean = !error && !data;

  return { fetcher, data, error, isLoading };
};

export default useApi;
