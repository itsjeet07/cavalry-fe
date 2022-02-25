import { SocketService } from './socket.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class ChatSubscriptionService {

  clientFormData = [];

  chatSubscribersSub = new BehaviorSubject<[]>([]);

  constructor(
    private http: HttpClient,
    private socketService: SocketService,
    private messageService:MessageService
  ) {
  }

  watch(data) {
    return this.http.post(`${environment.apiUrl}/chat-subscription/create`, data);
  }

  getUsers(searchQuery) {
    return this.http.get(`${environment.apiUrl}/user/getUsersForAutoComplete?q=${searchQuery}`);
  }

  getSubscribers(resourceId) {
    return this.http.get(`${environment.apiUrl}/chat-subscription/resource-subscriptions/${resourceId}`);
  }

  sendMessage(message, tableInfo, shouldSave) {
    const data = {
      resourceId: tableInfo.resourceId ? tableInfo.resourceId : tableInfo.id,
      message: message,
      shouldSave: shouldSave,
    };
    // this.socketService.emit('message_on_room', data);
    this.messageService.messageOnRoom(data);
    // if(!data){
    // const conversionObjText = {
    //   sender: message.sender,
    //   receiver: message.text,
    //   text: message.message,
    //   isGroup: true,
    //   resourceDetails: message.resourceDetails,
    //   type: "text",
    //   dateSeen: null
    // };
    // this.messageService.newMessage(conversionObjText);
  // }

  }

  getSubscriptions() {
    this.http.get<any>(`${environment.apiUrl}/chat-subscription/my-subscriptions`).pipe(map(res => res)).
      subscribe(data => {
        if (data.statusCode == 200 && data.data) {
          this.chatSubscribersSub.next(data);
        }
    });
  }

  cancelSubscription(data) {
    return this.http.post(`${environment.apiUrl}/chat-subscription/cancel`, data);
  }

}
