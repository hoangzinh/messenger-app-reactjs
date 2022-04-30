import { Skeleton, Typography, PageHeader } from 'antd';
import { get } from 'lodash';
import { FunctionComponent, createRef, useCallback, useEffect } from 'react';

import { API_DOMAIN, POLLING_TIME_MS } from '../utils/constants';
import { MessageType, ParticipantType } from './shared/types';
import ComposeMessage from './ComposeMessage';
import Message from './Message';
import useApiWithPolling from '../hooks/useApiWithPolling';
import useScroll from '../hooks/useScroll';

const { Text } = Typography;

type ConversationType = {
  id: string;
  accountId: string;
  participants: Array<ParticipantType>;
};

type ConversationDataType = {
  rows: Array<MessageType>;
};

const Conversation: FunctionComponent<ConversationType> = ({
  id,
  accountId,
  participants,
}) => {
  const messagesEndRef = createRef<HTMLDivElement>();

  const { fetcher, data, isLoading, firstLoad } =
    useApiWithPolling<ConversationDataType>(
      {
        endpoint: `${API_DOMAIN}/api/account/${accountId}/conversation/${id}/messages?pageSize=10`,
      },
      POLLING_TIME_MS
    );

  const { loadMoreRef, containerRef } = useScroll(() =>
    console.log('Fetch more')
  );

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  const onSentMessage = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesEndRef]);

  const messages = data?.rows || [];
  const canLoadMore = get(data, 'cursor_prev') && !isLoading;

  return (
    <>
      <PageHeader
        style={{
          border: '1px solid rgb(235, 237, 240)',
          backgroundColor: '#e6f7ff',
        }}
        title={`Conversation between ${participants
          .map((p) => p.name)
          .join(' and ')}`}
      />
      <Skeleton loading={isLoading && firstLoad} active>
        <div
          ref={containerRef}
          style={{
            display: 'flex',
            flexDirection: 'column-reverse',
            padding: '0 16px',
            flexGrow: 1,
            overflow: 'auto',
          }}
        >
          <div ref={messagesEndRef} />
          {messages.map(({ id, sender, text }) => (
            <Message key={id} id={id} sender={sender} text={text} />
          ))}
          {canLoadMore ? (
            <div ref={loadMoreRef} style={{ textAlign: 'center' }}>
              <Text>Loading old message ...</Text>
            </div>
          ) : null}
        </div>
        <ComposeMessage
          senderId={accountId}
          conversationId={id}
          onSentMessage={onSentMessage}
        />
      </Skeleton>
    </>
  );
};

export default Conversation;
