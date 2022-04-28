export type Account = {
  id: string;
  name: string;
};
export type ParticipantType = {
  id: string;
  name: string;
};

export type MessageType = {
  id: string;
  sender: ParticipantType;
  text: string;
};

export type ConversationType = {
  id: string;
  participants: Array<ParticipantType>;
  lastMessage: MessageType;
};
