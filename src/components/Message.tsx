import { Avatar, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { FunctionComponent } from 'react';

import { MessageType } from './shared/types';

const { Text } = Typography;

const Message: FunctionComponent<MessageType> = ({ sender, text }) => {
  const { id: currentAccountId } = useParams();
  const isCurrentAccount = currentAccountId === sender.id.toString();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isCurrentAccount ? 'row-reverse' : 'row',
        padding: '16px 0',
      }}
    >
      <Avatar
        size={50}
        src={`https://joeschmoe.io/api/v1/random?name=${sender.name}`}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {!isCurrentAccount ? (
          <Text
            style={{ paddingLeft: 28, fontWeight: 'semi-bold', fontSize: 12 }}
          >
            {sender.name}
          </Text>
        ) : null}
        <div
          style={{
            borderRadius: 24,
            backgroundColor: isCurrentAccount ? '#91d5ff' : '#fafafa',
            padding: '4px 12px',
            margin: '0 16px',
          }}
        >
          <Text style={{ lineHeight: '36px' }}>{text}</Text>
        </div>
      </div>
    </div>
  );
};

export default Message;
