import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Link, useMatch } from 'react-router-dom';
import { Menu, Avatar } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

import useApi from '../hooks/useApi';
import { API_DOMAIN } from '../utils/constants';
import { Account } from './shared/types';

const TopNavigation: FunctionComponent = () => {
  const match = useMatch('/account/:accountId/*');
  const accountId = match?.params?.accountId;

  const [name, setName] = useState<string | null>(null);
  const { fetcher } = useApi<Account>({
    endpointGenerator: useCallback(
      ({ accountId }: { accountId: string }) =>
        `${API_DOMAIN}/api/account/${accountId}`,
      []
    ),
    onComplete: useCallback((data: Account) => setName(data.name), []),
  });

  useEffect(() => {
    if (accountId) {
      fetcher({ endpointParams: { accountId: accountId } });
    } else {
      setName(null);
    }
  }, [accountId, fetcher]);

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={['home']}
      style={{ justifyContent: 'flex-end' }}
    >
      {name && (
        <Menu.Item key="account">
          <Avatar
            src={`https://i.pravatar.cc/100?u=${name}`}
            size={50}
            style={{ marginRight: '5px' }}
          />
          {name}
        </Menu.Item>
      )}
      <Menu.Item key="home" icon={<SettingOutlined />}>
        <Link to="/">Switch Accounts</Link>
      </Menu.Item>
    </Menu>
  );
};

export default TopNavigation;
