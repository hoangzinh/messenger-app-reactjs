import { unionBy } from 'lodash';
import { useCallback, useReducer } from 'react';

type Method = 'GET' | 'PUT' | 'POST' | 'DELETE';

type ApiConfigs = {
  endpoint: RequestInfo;
  method?: Method;
  onComplete?: (data: Object) => void;
  onFailed?: (error: Object) => void;
};

type fetcherOptions = {
  body?: Object;
  withPagination?: boolean;
};

type ApiState<T> = {
  currentApi: {
    data: T | null;
    loading: boolean;
    error: Error | null;
  };
  paginatedApi: { data: Array<unknown> };
  withPagination: boolean;
};

type ApiAction<T> =
  | {
      type: 'fetch_start';
      payload: { withPagination?: boolean };
    }
  | { type: 'fetch_complete'; payload: T }
  | { type: 'fetch_failed'; payload: Error };

const useApi = <T>({
  endpoint,
  method = 'GET',
  onComplete,
  onFailed,
}: ApiConfigs) => {
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
    ({ body, withPagination = false }: fetcherOptions = {}) => {
      dispatch({ type: 'fetch_start', payload: { withPagination } });
      fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
    [method, endpoint, onComplete, onFailed]
  );

  const { data, loading: isLoading, error } = state.currentApi;
  const { data: paginatedData } = state.paginatedApi;

  return { fetcher, data, error, isLoading, paginatedData };
};

export default useApi;
