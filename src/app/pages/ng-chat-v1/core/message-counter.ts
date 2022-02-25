import { Window } from './window';
import { of } from 'rxjs';

export class MessageCounter {
  public static formatUnreadMessagesTotal(totalUnreadMessages: number): string {
    if (totalUnreadMessages > 0) {

      if (totalUnreadMessages > 19)
        return '20+';
      else
        return String(totalUnreadMessages);
    }

    // Empty fallback.
    return '';
  }

  /**
   * Returns a formatted string containing the total unread messages of a chat window.
   * @param window The window instance to count the unread total messages.
   * @param currentUserId The current chat instance user id. In this context it would be the sender.
   */
  public static unreadMessagesTotal(window: Window, currentUserId: any): string {
    // let totalUnreadMessages = 0;
    // if (window) {
    //   // if (window.messages[0].toId == '5fa2ef01d647d5644ad331c0') {

    //   //   const hello = window.messages;
    //   // }
    //   let total;
    //   // if (typeof (window.messages[0].fromId) === 'object') {
    //   //   total = window.messages.filter(x => x.fromId._id != currentUserId && !x.dateSeen && x);
    //   // } else {
    //   // }

    //   total = window.messages.filter(x => x.fromId != currentUserId && !x.dateSeen && x);

    //   // const finalTotal = total.filter(x => x.fromId != currentUserId);
    //   totalUnreadMessages = total.length;
    // }

    let totalUnreadMessages = 0;
    if (window && window.messages) {
      const total = window.messages.filter(x => x.fromId != currentUserId && !x.dateSeen);
      // const finalTotal = total.filter(x => x.fromId != currentUserId);
      totalUnreadMessages = total.length;
    }

    return MessageCounter.formatUnreadMessagesTotal(totalUnreadMessages);
  }
}
