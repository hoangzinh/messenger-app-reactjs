import React, { FunctionComponent, useState } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import useApi from '../hooks/useApi';
import { API_DOMAIN } from '../utils/constants';

type ComposeMessageProps = {
  senderId: String;
  conversationId: String;
};

const ComposeMessage: FunctionComponent<ComposeMessageProps> = ({
  senderId,
  conversationId,
}) => {
  const [message, setMessage] = useState('');
  const { fetcher: sendNewMessageToServer } = useApi({
    endpoint: `${API_DOMAIN}/api/account/${senderId}/conversation/${conversationId}/messages`,
    method: 'POST',
  });

  const handleSubmitMessage = () => {
    if (!message) return null;

    sendNewMessageToServer({ body: { text: message } });
    setMessage('');
  };
  const handleKeyDown = (eve: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (eve.key === 'Enter' && !eve.shiftKey) {
      eve.preventDefault();
      handleSubmitMessage();
    }
  };
  const inputChange = (eve: React.ChangeEvent<HTMLTextAreaElement>) =>
    setMessage(eve.currentTarget.value);

  return (
    <div>
      <Input.Group compact style={{ display: 'flex' }}>
        <Input.TextArea
          value={message}
          placeholder="type your messages"
          autoSize={{ minRows: 1, maxRows: 6 }}
          onChange={inputChange}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSubmitMessage}
        >
          Send
        </Button>
      </Input.Group>
    </div>
  );
};

export default ComposeMessage;
