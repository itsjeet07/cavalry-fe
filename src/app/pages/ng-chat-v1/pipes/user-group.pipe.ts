import { Pipe, PipeTransform } from '@angular/core';
import { IChatParticipant } from '../core/chat-participant';

@Pipe({
  name: 'userGroup',
  pure: false
})
export class UserGroupPipe implements PipeTransform {

  transform(items: IChatParticipant[], filter:any): any {
    if(filter == 1){
      return items.filter(v=> v.participantType);
    } else {
      return items.filter(v=> !v.participantType);
    }
  }
}
