import React, { Key } from 'react';
import { Skeleton, Switch, Card, Avatar } from 'antd';

const { Meta } = Card;

type Account = {
  id: Key;
  name: String;
};

type AccountSelectionProps = {
  accounts: Array<Account>;
};

const AccountSelection = ({ accounts = [] }: AccountSelectionProps) => (
  <ul>
    {accounts.map(({ id, name }) => (
      <Card style={{ marginTop: 16 }} key={id} hoverable>
        <Meta
          avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
          title={name}
        />
      </Card>
    ))}
  </ul>
);

export default AccountSelection;
