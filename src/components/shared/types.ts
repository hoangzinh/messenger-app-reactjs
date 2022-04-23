export type ParticipantType = {
  id: string;
  name: string;
};

export type MessageType = {
  sender: ParticipantType;
  text: string;
};
