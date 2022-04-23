import React from 'react';

import Conversation from '../components/Conversation';
import ConversationList from '../components/ConversationList';

const ConversationsPage = () => {
  return (
    <div style={{ display: 'flex' }}>
      <ConversationList />
      <Conversation />
    </div>
  );
};

export default ConversationsPage;
