import { Avatar, Typography } from 'antd';
import { get } from 'lodash';
import { useParams } from 'react-router-dom';
import React, { FunctionComponent, useEffect } from 'react';

import { API_DOMAIN } from '../utils/constants';
import useApi from '../hooks/useApi';

const { Title, Text } = Typography;

type ParticipantType = {
  id: string;
  name: string;
};

type MessageType = {
  id: string;
  sender: ParticipantType;
  ts: number;
  text: string;
};

type ConversationItemType = {
  participants: Array<ParticipantType>;
  lastMessage: MessageType | undefined;
};

const ConversationItem: FunctionComponent<ConversationItemType> = ({
  participants,
  lastMessage,
}) => {
  const conversationName = participants.map(({ name }) => name).join(', ');
  const lastMessageText = lastMessage?.text || '';

  return (
    <div style={{ display: 'flex', flexDirection: 'row', padding: 8 }}>
      <div>
        <Avatar
          src={`https://joeschmoe.io/api/v1/random?name=${participants[0].name}`}
          size={50}
        />
      </div>
      <div style={{ paddingLeft: 8 }}>
        <Title level={5}>{conversationName}</Title>
        <Text type="secondary">{lastMessageText}</Text>
      </div>
    </div>
  );
};

const ConversationList: FunctionComponent = () => {
  const { id } = useParams();
  const { fetcher, data, isLoading, error } = useApi({
    endpoint: `${API_DOMAIN}/api/account/${id}/conversations`,
  });

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  const conversations = get(data, 'rows', []);

  if (isLoading || error) return <span>Loading...</span>;

  return (
    <div>
      {conversations.map(({ id, participants, lastMessage }) => (
        <ConversationItem
          key={id}
          participants={participants}
          lastMessage={lastMessage}
        />
      ))}
    </div>
  );
};

export default ConversationList;
