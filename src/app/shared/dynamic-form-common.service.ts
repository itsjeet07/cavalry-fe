import { Injectable } from '@angular/core';
import { ChatSubscriptionService } from './services/chat-subscription.service';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormCommonService {

  constructor(private chatSubscriptionService: ChatSubscriptionService) { }

  activateSubscription(data) {
    this.chatSubscriptionService.watch(data).subscribe(
      (res: any) => {
        if (res.statusCode === 201) {
          return res;
        }
        else {
          return res;
        }
      },
      (error) => {
        return '';
      },
    );
    return '';
  }

  userLookupChangedWatchers(temp:Object){

    if(temp["lookup"]){
      let inval = false;
      let id = [];
      temp["lookup"].forEach(element => {
        if(element.lookupTableName == "Users"){
          inval = true;
          id.push(element.lookupId);
        }
      });
      if(inval){
        return id;
      }

      return id;
    }
  }
}
