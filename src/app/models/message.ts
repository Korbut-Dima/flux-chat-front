export interface Message {
  sender: string;
  senderId: number;
  content: string
  createdAt: Date;
  chatRoom: string
  type: any;
}

export enum MessageType {
  USER_TEXT,
  SYSTEM
}
