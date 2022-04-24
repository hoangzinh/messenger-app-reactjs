import { Avatar, Skeleton, Typography } from 'antd';
import { get } from 'lodash';
import { useParams } from 'react-router-dom';
import React, { FunctionComponent, useEffect } from 'react';

import { API_DOMAIN } from '../utils/constants';
import { MessageType, ParticipantType } from './shared/types';
import useApi from '../hooks/useApi';

const { Title, Text } = Typography;

type ConversationItemType = {
  participants: Array<ParticipantType>;
  lastMessage: MessageType | undefined;
  onClick: () => void;
};

const ConversationItem: FunctionComponent<ConversationItemType> = ({
  participants,
  lastMessage,
  onClick,
}) => {
  const { id: currentAccountId } = useParams();
  const otherParticipants = participants.filter(
    (member) => member.id !== currentAccountId
  );
  const conversationName = otherParticipants.map(({ name }) => name).join(', ');
  const lastMessageText = lastMessage?.text || '';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        padding: 16,
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <div>
        <Avatar
          src={`https://joeschmoe.io/api/v1/random?name=${otherParticipants[0].name}`}
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

type ConversationListType = {
  setActiveConversation: (id: string) => void;
};

const ConversationList: FunctionComponent<ConversationListType> = ({
  setActiveConversation,
}) => {
  const { id: currentAccountId } = useParams();
  const { fetcher, data, isLoading } = useApi({
    endpoint: `${API_DOMAIN}/api/account/${currentAccountId}/conversations`,
  });

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  const conversations = get(data, 'rows', []);

  return (
    <div style={{ width: 360, padding: 16 }}>
      <Skeleton loading={isLoading} active avatar>
        {conversations.map(({ id, participants, lastMessage }) => (
          <ConversationItem
            key={id}
            participants={participants}
            lastMessage={lastMessage}
            onClick={() => setActiveConversation(id)}
          />
        ))}
      </Skeleton>
    </div>
  );
};

export default ConversationList;