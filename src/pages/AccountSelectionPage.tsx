import React, { FunctionComponent, useEffect } from 'react';
import AccountSelection from '../components/AccountSelection';
import { Skeleton } from 'antd';
import UnexpectedError from '../components/UnexpectedError';

import useApi from '../hooks/useApi';
import { API_DOMAIN } from '../utils/constants';

const AccountSelectionPage: FunctionComponent = () => {
  const { fetcher, data, error, isLoading } = useApi({
    endpoint: `${API_DOMAIN}/api/accounts`,
  });

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  if (error) {
    return <UnexpectedError />;
  }

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Select an Account</h2>
      <div style={{ width: '100%', maxWidth: '350px', margin: 'auto' }}>
        <Skeleton loading={isLoading} active avatar>
          <AccountSelection accounts={data} />
        </Skeleton>
      </div>
    </div>
  );
};

export default AccountSelectionPage;
