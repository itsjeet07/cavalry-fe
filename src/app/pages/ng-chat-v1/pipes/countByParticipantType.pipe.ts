import { Pipe, PipeTransform } from '@angular/core';
import { IChatParticipant } from '../core/chat-participant';

@Pipe({
  name: 'countByParticipantType',
  pure: false
})
export class countByParticipantTypePipe implements PipeTransform {

  transform(items: IChatParticipant[],filter): any {
    if(filter)
    {
      const groupsArray:IChatParticipant[]=items.filter(v=> v.participantType);
      let groupMessageTotalCount=0;
      for(let i=0;i<groupsArray.length;i++)
      {
        groupMessageTotalCount += groupsArray[i].totalUnreadCount;
      }
     return (groupMessageTotalCount) ? groupMessageTotalCount : '';
    }
    else {
      const groupsArray:IChatParticipant[]=items.filter(v=> !v.participantType);
      let groupMessageTotalCount=0;
      for(let i=0;i<groupsArray.length;i++)
      {
        groupMessageTotalCount += groupsArray[i].totalUnreadCount;
      }
     return (groupMessageTotalCount) ? groupMessageTotalCount : '';    }
  }
}
