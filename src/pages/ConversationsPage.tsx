import { Divider } from 'antd';
import React, { useState } from 'react';

import Conversation from '../components/Conversation';
import ConversationList from '../components/ConversationList';

const ConversationsPage = () => {
  const [activeConversation, setActiveConversation] = useState<string>();

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <ConversationList setActiveConversation={setActiveConversation} />
      <Divider type="vertical" style={{ height: '100%' }} />
      <div style={{ flex: 1 }}>
        {activeConversation ? (
          <Conversation key={activeConversation} id={activeConversation} />
        ) : null}
      </div>
    </div>
  );
};

export default ConversationsPage;
