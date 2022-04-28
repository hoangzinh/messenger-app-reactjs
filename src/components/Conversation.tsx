import { Skeleton, Typography } from 'antd';
import { get } from 'lodash';
import { useParams } from 'react-router-dom';
import { FunctionComponent, useEffect } from 'react';

import { API_DOMAIN } from '../utils/constants';
import { MessageType } from './shared/types';
import ComposeMessage from './ComposeMessage';
import Message from './Message';
import useApi from '../hooks/useApi';
import useScroll from '../hooks/useScroll';

const { Text } = Typography;

type ConversationType = {
  id: string;
};

type ConversationDataType = {
  rows: Array<MessageType>;
};

const Conversation: FunctionComponent<ConversationType> = ({ id }) => {
  const { id: accountId } = useParams();

  const { fetcher, data, isLoading } = useApi<ConversationDataType>({
    endpoint: `${API_DOMAIN}/api/account/${accountId}/conversation/${id}/messages?pageSize=10`,
  });

  const canLoadMore = get(data, 'cursor_prev') && !isLoading;

  const { loadMoreRef, containerRef } = useScroll(() =>
    console.log('Fetch more')
  );

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  const messages = data?.rows || [];

  return (
    <Skeleton loading={isLoading} active>
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
        {messages.map(({ id, sender, text }) => (
          <Message key={id} id={id} sender={sender} text={text} />
        ))}
        {canLoadMore ? (
          <div ref={loadMoreRef} style={{ textAlign: 'center' }}>
            <Text>Loading old message ...</Text>
          </div>
        ) : null}
      </div>
      {accountId && <ComposeMessage senderId={accountId} conversationId={id} />}
    </Skeleton>
  );
};

export default Conversation;
