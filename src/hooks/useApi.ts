import { useState } from 'react';

type Method = 'GET' | 'PUT' | 'POST' | 'DELETE';

type ApiConfigs = {
  endpoint: RequestInfo;
  method?: Method;
  body?: Object;
  onComplete?: (data: Object) => void;
  onFailed?: (error: Object) => void;
};

const useApi = ({
  endpoint,
  method = 'GET',
  body,
  onComplete,
  onFailed,
}: ApiConfigs) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetcher = () =>
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
      });

  const isLoading: boolean = !error && !data;

  return { fetcher, data, error, isLoading };
};

export default useApi;
