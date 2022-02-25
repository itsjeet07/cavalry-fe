import { Window } from './window';
import { IChatParticipant } from './chat-participant';

export interface IChatOption
{
    isActive: boolean;
    displayLabel: string;
    chattingTo: Window;
    action?: (chattingTo: Window) => void;
    validateContext: (participant: IChatParticipant) => boolean;
}
