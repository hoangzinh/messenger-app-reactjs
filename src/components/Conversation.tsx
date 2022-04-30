import { Skeleton, Typography, PageHeader } from 'antd';
import { pick, flatMap, isEmpty, last, get, unionBy } from 'lodash';
import React, {
  FunctionComponent,
  createRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';

import { API_DOMAIN, POLLING_TIME_MS } from '../utils/constants';
import { MessageType, ParticipantType } from './shared/types';
import ComposeMessage from './ComposeMessage';
import Message from './Message';
import useApi from '../hooks/useApi';
import useScroll from '../hooks/useScroll';

const { Text } = Typography;

type ConversationType = {
  id: string;
  accountId: string;
  participants: Array<ParticipantType>;
};

type ConversationDataType = {
  rows: Array<MessageType>;
  cursor_prev: string;
  cursor_next: string;
  sort: string;
};

const pageSize = 10;

const Conversation: FunctionComponent<ConversationType> = ({
  id,
  accountId,
  participants,
}) => {
  const messagesEndRef = createRef<HTMLDivElement>();
  const [firstLoad, setFirstLoad] = useState(false);

  const { fetcher, data, isLoading, paginatedData } =
    useApi<ConversationDataType>({
      endpoint: `${API_DOMAIN}/api/account/${accountId}/conversation/${id}/messages`,
      onComplete: () => setFirstLoad(false),
    });

  const {
    fetcher: pollNewData,
    isLoading: isPolling,
    paginatedData: pollingPaginatingData,
  } = useApi<ConversationDataType>({
    endpoint: `${API_DOMAIN}/api/account/${accountId}/conversation/${id}/messages`,
  });

  const { cursor_prev, cursor_next, sort } = pick(data, [
    'cursor_prev',
    'cursor_next',
    'sort',
  ]);

  const { loadMoreRef, containerRef } = useScroll(() => {
    if (!isEmpty(get(last(paginatedData), 'rows')) && !isLoading) {
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

  useEffect(() => {
    fetcher({ withPagination: true, params: { pageSize } });
  }, []);

  useEffect(() => {
    if (firstLoad === false && !isPolling && !isLoading) {
      const timer = setInterval(
        () => pollNewData({ withPagination: true, params: { pageSize } }),
        POLLING_TIME_MS
      );

      return () => {
        clearInterval(timer);
      };
    }
  }, [pollNewData, firstLoad, isPolling, isLoading]);

  const onSentMessage = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesEndRef]);

  const messages = useMemo(() => {
    const sorted = paginatedData.map((item) =>
      item.sort === 'OLDEST_FIRST'
        ? { ...item, rows: [...item.rows].reverse() }
        : item
    );
    const paginatingData = flatMap(sorted, 'rows');
    const pollingData = flatMap([...pollingPaginatingData].reverse(), 'rows');

    return unionBy(pollingData, paginatingData, 'id');
  }, [paginatedData, pollingPaginatingData]);

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
          {!isEmpty(get(last(paginatedData), 'rows')) ? (
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
