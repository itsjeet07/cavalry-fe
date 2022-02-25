import { ChatParticipantStatus } from "./chat-participant-status.enum";
import { ChatParticipantType } from "./chat-participant-type.enum";

export interface IChatParticipant {
  readonly participantType: ChatParticipantType;
  readonly id: any;
  status: ChatParticipantStatus;
  readonly avatar: string | null;
  readonly displayName: string;
  readonly email?: string | "";
  totalUnreadCount?: number;
  totalMessage?: number;
  parentTableId?: any;
  resourceTableName?: any;
  subscribers?:any;
  userColor?: string;
}
