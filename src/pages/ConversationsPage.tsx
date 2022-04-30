import { Divider } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import Conversation from '../components/Conversation';
import ConversationList from '../components/ConversationList';
import UnexpectedError from '../components/UnexpectedError';

import { ConversationType } from '../components/shared/types';

const ConversationsPage = () => {
  const [activeConversation, setActiveConversation] =
    useState<ConversationType | null>(null);
  const { id: accountId } = useParams();

  if (!accountId) {
    return <UnexpectedError />;
  }

  return (
    <div style={{ display: 'flex', height: '100%', alignItems: 'stretch' }}>
      <ConversationList setActiveConversation={setActiveConversation} />
      <Divider type="vertical" style={{ height: '100%', margin: 0 }} />
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {activeConversation ? (
          <Conversation
            key={activeConversation.id}
            id={activeConversation.id}
            accountId={accountId}
            participants={activeConversation.participants}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ConversationsPage;
