import { unionBy, keys, get } from 'lodash';
import { useCallback, useReducer } from 'react';

type Method = 'GET' | 'PUT' | 'POST' | 'DELETE';

type Endpoint =
  | {
      endpoint?: RequestInfo;
      endpointGenerator: (params?: any) => RequestInfo;
    }
  | {
      endpoint: RequestInfo;
      endpointGenerator?: (params?: any) => RequestInfo;
    };

type ApiConfigs<T> = Endpoint & {
  method?: Method;
  onComplete?: (data: T) => void;
  onFailed?: (error: Object) => void;
};

type fetcherOptions = {
  params?: Record<string, unknown>;
  withPagination?: boolean;
  endpointParams?: Object;
};

type ApiState<T> = {
  currentApi: {
    data: T | null;
    loading: boolean;
    error: Error | null;
  };
  paginatedApi: { data: Array<T> };
  withPagination: boolean;
};

type ApiAction<T> =
  | {
      type: 'fetch_start';
      payload: { withPagination?: boolean };
    }
  | { type: 'fetch_complete'; payload: T }
  | { type: 'fetch_failed'; payload: Error };

const generateEndpointParams = (params: Record<string, unknown> | undefined) =>
  keys(params).reduce((result, key, index) => {
    return index === 0
      ? `${result}?${key}=${get(params, key, '')}`
      : `${result}&${key}=${get(params, key, '')}`;
  }, '');
const useApi = <T>({
  endpoint,
  endpointGenerator,
  method = 'GET',
  onComplete,
  onFailed,
}: ApiConfigs<T>) => {
  const initialState: ApiState<T> = {
    currentApi: { data: null, loading: false, error: null },
    paginatedApi: { data: [] },
    withPagination: false,
  };

  const reducer = (state: ApiState<T>, action: ApiAction<T>): ApiState<T> => {
    switch (action.type) {
      case 'fetch_start': {
        return {
          ...state,
          currentApi: { ...state.currentApi, loading: true },
          withPagination: action.payload.withPagination || false,
        };
      }
      case 'fetch_complete': {
        return {
          ...state,
          currentApi: { data: action.payload, loading: false, error: null },
          paginatedApi: state.withPagination
            ? {
                data: unionBy(
                  state.paginatedApi.data,
                  [action.payload],
                  'cursor_prev'
                ),
              }
            : state.paginatedApi,
        };
      }
      case 'fetch_failed': {
        return {
          ...state,
          currentApi: {
            ...state.currentApi,
            loading: false,
            error: action.payload,
          },
        };
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const fetcher = useCallback(
    ({ params, withPagination = false }: fetcherOptions = {}) => {
      dispatch({ type: 'fetch_start', payload: { withPagination } });
      const requestUrl = endpointGenerator
        ? endpointGenerator(params || {})
        : endpoint;

      const composedEndpoint =
        method === 'GET'
          ? `${requestUrl}${generateEndpointParams(params)}`
          : endpoint;

      dispatch({ type: 'fetch_start', payload: { withPagination } });
      // @ts-expect-error
      fetch(composedEndpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: method !== 'GET' ? JSON.stringify(params) : undefined,
      })
        .then((data) => data.json())
        .then((data) => {
          dispatch({
            type: 'fetch_complete',
            payload: data,
          });
          onComplete && onComplete(data);
        })
        .catch((error) => {
          dispatch({ type: 'fetch_failed', payload: error });
          onFailed && onFailed(error);
        });
    },
    [method, endpoint, onComplete, onFailed, endpointGenerator]
  );

  const { data, loading: isLoading, error } = state.currentApi;
  const { data: paginatedData } = state.paginatedApi;

  return { fetcher, data, error, isLoading, paginatedData };
};

export default useApi;
