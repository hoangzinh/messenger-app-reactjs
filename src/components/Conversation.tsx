import { Typography } from 'antd';
import { pick, flatMap, isEmpty, last, map } from 'lodash';
import { useParams } from 'react-router-dom';
import React, { FunctionComponent, useEffect, useMemo } from 'react';

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
  cursor_prev: string;
  cursor_next: string;
  sort: string;
};

const pageSize = 10;

const Conversation: FunctionComponent<ConversationType> = ({ id }) => {
  const { id: accountId } = useParams();

  const { fetcher, data, isLoading, paginatedData } =
    useApi<ConversationDataType>({
      endpoint: `${API_DOMAIN}/api/account/${accountId}/conversation/${id}/messages`,
    });

  const { cursor_prev, cursor_next, sort } = pick(data, [
    'cursor_prev',
    'cursor_next',
    'sort',
  ]);

  const { loadMoreRef, containerRef } = useScroll(() => {
    if (!isEmpty(last(paginatedData)) && !isLoading) {
      if (sort === 'OLDEST_FIRST') {
        fetcher({
          params: { cursor: cursor_next, pageSize },
          withPagination: true,
        });
      } else {
        fetcher({
          params: { cursor: cursor_prev, pageSize },
          withPagination: true,
        });
      }
    }
  });

  const messages = useMemo(() => {
    const sortedData = map(paginatedData, ({ rows, sort }) => ({
      ...paginatedData,
      rows: sort === 'OLDEST_FIRST' ? rows.reverse() : rows,
    }));
    return flatMap(sortedData, 'rows');
  }, [paginatedData]);

  useEffect(() => {
    fetcher({ withPagination: true, params: { pageSize } });
  }, [fetcher]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <div
        ref={containerRef}
        id="message"
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          padding: '0 16px',
          flex: 1,
          overflow: 'auto',
        }}
      >
        {messages.map(({ id, sender, text }) => (
          <Message key={id} id={id} sender={sender} text={text} />
        ))}
        {!isEmpty(last(paginatedData)) ? (
          <div ref={loadMoreRef} style={{ textAlign: 'center' }}>
            <Text>Loading old message ...</Text>
          </div>
        ) : null}
      </div>
      {accountId ? (
        <ComposeMessage senderId={accountId} conversationId={id} />
      ) : null}
    </div>
  );
};

export default Conversation;
