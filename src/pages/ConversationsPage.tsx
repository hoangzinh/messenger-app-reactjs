import { Divider } from 'antd';
import { useState } from 'react';

import Conversation from '../components/Conversation';
import ConversationList from '../components/ConversationList';

const ConversationsPage = () => {
  const [activeConversation, setActiveConversation] = useState<string>();

  return (
    <div style={{ display: 'flex', height: '100%', alignItems: 'stretch' }}>
      <ConversationList setActiveConversation={setActiveConversation} />
      <Divider type="vertical" style={{ height: '100%', margin: 0 }} />
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {activeConversation ? (
          <Conversation key={activeConversation} id={activeConversation} />
        ) : null}
      </div>
    </div>
  );
};

export default ConversationsPage;
