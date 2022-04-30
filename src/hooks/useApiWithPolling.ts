import { useEffect, useState, useCallback } from 'react';
import useApi, { ApiConfigs } from './useApi';

const useApiWithPolling = <T>(
  apiConfigs: ApiConfigs<T>,
  polling_time_ms: number
) => {
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const { onComplete } = apiConfigs;

  const useApiResult = useApi<T>({
    ...apiConfigs,
    onComplete: useCallback(
      (data: T) => {
        setFirstLoad(false);
        onComplete && onComplete(data);
      },
      [onComplete]
    ),
  });

  const { fetcher, isLoading } = useApiResult;

  useEffect(() => {
    if (firstLoad) {
      return;
    }

    let timer: NodeJS.Timeout | null = null;

    const callFetcher = () => {
      fetcher();
      timer = setTimeout(callFetcher, polling_time_ms);
    };

    if (!isLoading) {
      callFetcher();
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [fetcher, firstLoad, polling_time_ms, isLoading]);

  return { ...useApiResult, firstLoad };
};

export default useApiWithPolling;
