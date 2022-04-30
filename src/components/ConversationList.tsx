import { Avatar, Skeleton, Typography } from 'antd';
import { get } from 'lodash';
import { useParams } from 'react-router-dom';
import { FunctionComponent, useEffect, useState } from 'react';

import { API_DOMAIN, POLLING_TIME_MS } from '../utils/constants';
import { ConversationType, MessageType, ParticipantType } from './shared/types';
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
          src={`https://i.pravatar.cc/100?u=${otherParticipants[0].name}`}
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
  setActiveConversation: (params: ConversationType) => void;
};

type ConversationListData = {
  rows: Array<ConversationType>;
};

const ConversationList: FunctionComponent<ConversationListType> = ({
  setActiveConversation,
}) => {
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const { id: currentAccountId } = useParams();
  const { fetcher, data, isLoading } = useApi<ConversationListData>({
    endpoint: `${API_DOMAIN}/api/account/${currentAccountId}/conversations`,
    onComplete: () => setFirstLoad(false),
  });

  useEffect(() => {
    if (!isLoading) {
      const timer = setInterval(() => fetcher(), POLLING_TIME_MS);

      return () => {
        clearInterval(timer);
      };
    }
  }, [fetcher, isLoading]);

  const conversations = get(data, 'rows', []);

  return (
    <div style={{ width: 360, padding: 16 }}>
      <Skeleton loading={isLoading && firstLoad} active avatar>
        {conversations.map((conversation) => {
          const { id, participants, lastMessage } = conversation;
          return (
            <ConversationItem
              key={id}
              participants={participants}
              lastMessage={lastMessage}
              onClick={() => setActiveConversation(conversation)}
            />
          );
        })}
      </Skeleton>
    </div>
  );
};

export default ConversationList;
