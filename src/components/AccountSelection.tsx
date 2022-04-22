import React, { Key } from 'react';
import { Card, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

type Account = {
  id: Key;
  name: String;
};

type AccountSelectionProps = {
  accounts: Array<Account>;
};

const AccountSelection = ({ accounts = [] }: AccountSelectionProps) => {
  const navigate = useNavigate();
  const goToConversation = (id: Key) => () =>
    navigate(`/account/${id}/conversations`);

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
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
            title={name}
          />
        </Card>
      ))}
    </div>
  );
};

export default AccountSelection;
