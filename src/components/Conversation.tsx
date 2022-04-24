import { Skeleton } from 'antd';
import { get } from 'lodash';
import { useParams } from 'react-router-dom';
import React, { FunctionComponent, useEffect } from 'react';

import { API_DOMAIN } from '../utils/constants';
import Message from './Message';
import ComposeMessage from './ComposeMessage';

import useApi from '../hooks/useApi';

type ConversationType = {
  id: string;
};

const Conversation: FunctionComponent<ConversationType> = ({ id }) => {
  const { id: accountId } = useParams();

  const { fetcher, data, isLoading } = useApi({
    endpoint: `${API_DOMAIN}/api/account/${accountId}/conversation/${id}/messages`,
  });

  useEffect(() => {
    fetcher();
  }, [fetcher]);

  const messages = get(data, 'rows', []);

  return (
    <Skeleton loading={isLoading} active>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          padding: '0 16px',
          flexGrow: 1,
        }}
      >
        {messages.map(({ id, sender, text }) => (
          <Message key={id} sender={sender} text={text} />
        ))}
      </div>
      {accountId && <ComposeMessage senderId={accountId} conversationId={id} />}
    </Skeleton>
  );
};

export default Conversation;
