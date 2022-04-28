import { Skeleton } from 'antd';
import { FunctionComponent, useEffect } from 'react';

import { API_DOMAIN } from '../utils/constants';
import { Account } from '../components/shared/types';
import AccountSelection from '../components/AccountSelection';
import UnexpectedError from '../components/UnexpectedError';
import useApi from '../hooks/useApi';

const AccountSelectionPage: FunctionComponent = () => {
  const { fetcher, data, error, isLoading } = useApi<Array<Account>>({
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
