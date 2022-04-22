import React, { useEffect } from 'react';
import AccountSelection from '../components/AccountSelection';
import { Skeleton } from 'antd';
import UnexpectedError from '../components/UnexpectedError';

import useApi from '../hooks/useApi';
import { API_DOMAIN } from '../utils/constants';

const AccountSelectionPage = () => {
  const { fetcher, data, error, isLoading } = useApi({
    endpoint: `${API_DOMAIN}/api/accounts`,
  });

  useEffect(() => {
    fetcher();
  }, []);

  if (isLoading) {
    return <Skeleton active />;
  }

  return <UnexpectedError />;
};

export default AccountSelectionPage;
