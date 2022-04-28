import { Card, Avatar } from 'antd';
import { isEmpty } from 'lodash/fp';
import { useNavigate } from 'react-router-dom';
import { FunctionComponent, Key } from 'react';

import { Account } from './shared/types';

const { Meta } = Card;

type AccountSelectionProps = {
  accounts: Array<Account> | null;
};

const EmptyAccount = () => <div>No account...</div>;

const AccountSelection: FunctionComponent<AccountSelectionProps> = ({
  accounts,
}) => {
  const navigate = useNavigate();
  const goToConversation = (id: Key) => () =>
    navigate(`/account/${id}/conversations`);

  if (accounts === null || isEmpty(accounts)) {
    return <EmptyAccount />;
  }

  return (
    <div>
      {accounts.map(({ id, name }) => (
        <Card
          style={{ marginTop: 16 }}
          key={id}
          hoverable
          onClick={goToConversation(id)}
        >
          <Meta
            avatar={
              <Avatar src={`https://joeschmoe.io/api/v1/random?name=${name}`} />
            }
            title={name}
          />
        </Card>
      ))}
    </div>
  );
};

export default AccountSelection;
