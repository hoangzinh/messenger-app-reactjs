import { FunctionComponent, useState } from 'react';
import { Divider } from 'antd';
import { useParams } from 'react-router-dom';

import Conversation from '../components/Conversation';
import ConversationList from '../components/ConversationList';
import UnexpectedError from '../components/UnexpectedError';

import { ConversationType } from '../components/shared/types';
import useMatchMedia from '../hooks/useMatchMedia';
import { MEDIA_QUERY_SMALL_SCREEN } from '../utils/constants';

type ConversationPageProps = {
  accountId: string;
};

const ConversationsPageLargeScreen: FunctionComponent<
  ConversationPageProps
> = ({ accountId }) => {
  const [activeConversation, setActiveConversation] =
    useState<ConversationType | null>(null);

  const clearActiveConversation = () => setActiveConversation(null);

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
            clearActiveConversation={clearActiveConversation}
          />
        ) : null}
      </div>
    </div>
  );
};

const ConversationsPageSmallScreen: FunctionComponent<
  ConversationPageProps
> = ({ accountId }) => {
  const [activeConversation, setActiveConversation] =
    useState<ConversationType | null>(null);

  const clearActiveConversation = () => setActiveConversation(null);

  if (activeConversation) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Conversation
          key={activeConversation.id}
          id={activeConversation.id}
          accountId={accountId}
          participants={activeConversation.participants}
          clearActiveConversation={clearActiveConversation}
        />
      </div>
    );
  }

  return <ConversationList setActiveConversation={setActiveConversation} />;
};

const ConversationsPage = () => {
  const { id: accountId } = useParams();
  const [isSmallScreenDevice] = useMatchMedia(MEDIA_QUERY_SMALL_SCREEN);

  if (!accountId) {
    return <UnexpectedError />;
  }

  return isSmallScreenDevice ? (
    <ConversationsPageSmallScreen accountId={accountId} />
  ) : (
    <ConversationsPageLargeScreen accountId={accountId} />
  );
};

export default ConversationsPage;
