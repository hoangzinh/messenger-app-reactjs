import React, { useEffect } from 'react';
import AccountSelection from '../components/AccountSelection';
import { Skeleton } from 'antd';
import UnexpectedError from '../components/UnexpectedError';

import { isEmpty } from 'lodash';
import useApi from '../hooks/useApi';
import { API_DOMAIN } from '../utils/constants';

const EmptyAccount = () => <div>No account...</div>;

const AccountSelectionPage = () => {
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
      <div style={{ width: '300px', margin: 'auto' }}>
        <h2 style={{ textAlign: 'center' }}>Select an Account</h2>
        <Skeleton loading={isLoading} active avatar>
          {isEmpty(data) ? (
            <EmptyAccount />
          ) : (
            <AccountSelection accounts={data || []} />
          )}
        </Skeleton>
      </div>
    </div>
  );
};

export default AccountSelectionPage;
