import { User } from './../ng-chat-v1/core/user';
import { MessageService } from '@app/shared/services/message.service';
import { SocketService } from '@app/shared/services/socket.service';
import { TableService } from '@app/shared/services/table.service';
import { Observable, of, Subscription } from 'rxjs';
import { delay, throttleTime } from 'rxjs/operators';
import { ChatAdapter } from '../ng-chat-v1/core/chat-adapter';
import { IChatGroupAdapter } from '../ng-chat-v1/core/chat-group-adapter';
import { IChatParticipant } from '../ng-chat-v1/core/chat-participant';
import { ChatParticipantStatus } from '../ng-chat-v1/core/chat-participant-status.enum';
import { ChatParticipantType } from '../ng-chat-v1/core/chat-participant-type.enum';
import { Group } from '../ng-chat-v1/core/group';
import { Message } from '../ng-chat-v1/core/message';
import { ParticipantResponse } from '../ng-chat-v1/core/participant-response';
import { RaceSubscriber } from 'rxjs/internal/observable/race';
import { Router } from '@angular/router';

export class DemoAdapter extends ChatAdapter implements IChatGroupAdapter {

  public static chatList: IChatParticipant[] = [];
  userId = '';
  historyMessage = [];
  private mySub;
  setHistory = false;

  constructor(private tableService: TableService,
    private messageService: MessageService,
    private socketService: SocketService,
    private route: Router) {
    super(); // call to default constructor added implicitly
    this.getUsers();
    if (localStorage.getItem('userData')) {
      this.userId = JSON.parse(localStorage.getItem('userData'))._id;
    }
  }

  markAsReadForResource() {
    // this.messageService.chatSeenForResource.subscribe(res => {
    //   DemoAdapter.chatList.forEach(function (item, i) {
    //     if (item.id == res) {
    //       item.totalUnreadCount = 0;
    //     }
    //   });
    //   this.listFriends().subscribe(response => {
    //     this.onFriendsListChanged(response);
    //   });
    // });
  }

  // ngOnDestroy(): void {
  //     DemoAdapter.chatList = [];
  // }

  getUsers() {
    this.messageService.getChatUserData().pipe(throttleTime(5000)).subscribe((res: any) => {
      if (res.statusCode === 200) {
        let totalmsg = 0;
        res.data.forEach(element => {
          if (element.totalUnreadCount) {
            if(element.totalUnreadCount > 20){
              element.totalUnreadCount = 20;
            }
            totalmsg += element.totalUnreadCount;
          }
        });
        this.messageService.totalUnreadMessage.next(totalmsg);
        this.setUserList(res.data);
      }
    });
  }

  changeStatus(id, status) {
    const chatStatus = this.messageService.getStatus(status);
    const user = DemoAdapter.chatList.find(x => x.id == id);
    if (user) {
      user.status = chatStatus;
      this.listFriends().subscribe(response => {
        this.onFriendsListChanged(response);
      });
    }
  }


  setUserList(data) {
    DemoAdapter.chatList = [];
    data.forEach(e => {
      let status = ChatParticipantStatus.Offline;

      if (e.status) {
        status = this.messageService.getStatus(e.status);
      }

      if (e._id != this.userId && !e.resourceDetails) {
        const participant: IChatParticipant = {
          participantType: ChatParticipantType.User,
          id: e._id,
          displayName: e.firstName + ' ' + e.lastName,
          avatar: null,
          status: status,
          email: '',
          totalUnreadCount: e.totalUnreadCount,
        };
        DemoAdapter.chatList.push(participant);
        this.getMessageHistory(e._id);
      } else if(e._id != this.userId) {
        const participant: IChatParticipant = {
          participantType: ChatParticipantType.Group,
          id: e._id,
          displayName: e.resourceDetails.resourceName,
          avatar: null,
          status: status,
          email: '',
          totalUnreadCount: e.totalUnreadCount,
          resourceTableName: e.resourceDetails.tableName,
          parentTableId: e.resourceDetails.tableId,
        };
        DemoAdapter.chatList.push(participant);
        this.getMessageHistory(e._id, true);
      }
    });
    DemoAdapter.chatList = [...new Set(DemoAdapter.chatList)];
    this.listFriends().subscribe(response => {
      this.onFriendsListChanged(response);
    });
  }

  listFriends(): Observable<ParticipantResponse[]> {
    return of(DemoAdapter.chatList.map(user => {
      const participantResponse = new ParticipantResponse();
      participantResponse.participant = user;
      // participantResponse.participant.totalMessage = 45;
      participantResponse.metadata = {
        totalUnreadMessages: user.totalUnreadCount,
      };
      return participantResponse;
    }));
  }

  getResourceMessageHistory(resourceId: any): Observable<Message[]> {
    let mockedHistory: Array<Message> = [];
    if (!this.historyMessage[resourceId]) {
      this.messageService.getResourceChatHistory(resourceId).
        subscribe(
          (res: any) => {

            if (res.data && res.data && res.data.length) {

              res.data.reverse().forEach(e => {
                const msg: Message = {
                  fromId: e.sender._id,
                  toId: e.receiver,
                  type: this.messageService.getMessageType(e.type),
                  message: e.text,
                  dateSent: e.createdAt,
                  dateSeen: e.dateSeen,
                  isGroup: true,
                  sender: e.sender,
                  totalMessages: res.data.total,
                };
                mockedHistory.push(msg);
              });
              this.historyMessage[resourceId] = mockedHistory;
            }
          });
    } else {
      mockedHistory = this.historyMessage[resourceId];
    }

    if (!this.historyMessage[resourceId]) {
      return of(mockedHistory).pipe(delay(4000));
    } else {
      return of(mockedHistory);
    }
  }

  getMessageHistory(destinataryId: any, isGroup = false): Observable<Message[]> {
    let mockedHistory: Array<Message> = [];
    // const data = {
    //     sender: destinataryId,
    //     receiver: this.userId
    // }
    // this.socketService.emit("message_status_change", data);
    // this.messageService.createMessages(destinataryId, this.userId, 'test msg').subscribe(
    //     res => console.log(res)
    // )
    if (!this.historyMessage[destinataryId]) {
      this.messageService.getMessages(destinataryId, this.userId, isGroup).
        subscribe(
          (res: any) => {

            if (res.data && res.data && res.data.length) {

              res.data.reverse().forEach(e => {
                if(e.sender){
                  let dateSeen = e.dateSeen;

                if (isGroup) { dateSeen = new Date(); }

                if (isGroup && e.subscribers && e.subscribers.length) {
                  const subs = e.subscribers.find(x => x.receiver == this.userId && x.visibility == 'read');
                  if (subs) {
                    dateSeen = new Date();
                  } else {
                    dateSeen = e.dateSeen;
                  }
                }

                const data: Message = {
                  fromId: e.sender._id,
                  toId: e.receiver,
                  type: this.messageService.getMessageType(e.type),
                  message: e.text,
                  dateSent: e.createdAt,
                  dateSeen: dateSeen,
                  totalMessages: res.data.total,
                  sender: e.sender,
                };
                mockedHistory.push(data);
                }
              });
              this.historyMessage[destinataryId] = mockedHistory;
            }
          });
    } else {
      mockedHistory = this.historyMessage[destinataryId];
    }

    if (!this.historyMessage[destinataryId]) {
      return of(mockedHistory).pipe(delay(4000));
    } else {
      return of(mockedHistory);
    }
  }

  public addToHistory(message: Message) {
    this.historyMessage[message.toId].push(message);
  }

  public getMessageHistoryByPage(destinataryId: any, size: number, page: number): Observable<Message[]> {
    const startPosition: number = (page - 1) * size;
    const endPosition: number = page * size;
    const mockedHistory: Array<Message> = this.historyMessage.slice(startPosition, endPosition);
    return of(mockedHistory.reverse()).pipe(delay(5000));
  }

  receiveMessage(message, total: number, resourceMessage = false) {

    // const senderId = resourceMessage ? message.receiver : message.sender._id;

    const senderId = message.sender._id;

    let messageTime = 6000;
    const replyMessage = new Message();
    replyMessage.message = message.text;
    replyMessage.dateSent = new Date();
    replyMessage.fromId = message.sender._id;
    replyMessage.toId = message.receiver;
    replyMessage.type = this.messageService.getMessageType(message.type);
    replyMessage.id = message._id ? message._id : '';
    replyMessage.sender = message.sender;

    // const openedWindow = this.windows.find(x => x.participant.id == participant.id);
    console.log("DEMO ADAPTER :"+DemoAdapter.chatList);

    let user = DemoAdapter.chatList.find(x => x.id == replyMessage.fromId);
    if (!user) {
      if (!resourceMessage) {
        this.setParticipant(message.sender);
      } else {
        this.setResourceParticipant(message.resourceDetails);
      }
      user = DemoAdapter.chatList.find(x => x.id == replyMessage.fromId);
      messageTime = 1200;
    }
    this.messageService.setUnreadStatus(true);
    if (!message.isGroup && message.sender._id != this.userId) {
      let count = 0;
      if (count == 0) {
        count++;
        this.messageService.totalUnreadMessage.next(total + 1);
      }
    }

    if (this.historyMessage[senderId]) {
      if (message._id) {
        if (!this.historyMessage[senderId].filter(x => x.id == message._id).length) {
          this.historyMessage[senderId].push(replyMessage);
          this.onMessageReceived(user, replyMessage);
        }
      }
    } else {
      this.getMessageHistory(senderId, resourceMessage);
      this.onMessageReceived(user, replyMessage);
    }

    this.setParticipantOrder(replyMessage.fromId);
  }

  receiveResourceMessage(message, total) {

    const href = this.route.url;
    let onGroupChat = false;
    const urlArray = href.split('/');
    if (urlArray[7] == 'Chats') {
      if (message.resourceDetails.resourceId == urlArray[6] && message.resourceDetails.tableId == urlArray[4]) {
        onGroupChat = true;
      }
    }

    if (message.messageType == 'log') {
      onGroupChat = true;
    }

    const senderId = message.receiver;
    let messageTime = 6000;
    const replyMessage = new Message();
    replyMessage.message = message.text;
    replyMessage.dateSent = new Date();
    replyMessage.fromId = senderId;
    replyMessage.toId = message.receiver;
    replyMessage.isGroup = true;
    replyMessage.sender = message.sender;
    replyMessage.type = this.messageService.getMessageType(message.type);
    replyMessage.messageType = message.messageType;
    replyMessage.id = message._id ? message._id : '';
    console.log("DEMO ADAPTER1 :"+DemoAdapter.chatList);

    // const openedWindow = this.windows.find(x => x.participant.id == participant.id);
    let user = DemoAdapter.chatList.find(x => x.id == replyMessage.fromId);
    console.log("DEMO ADAPTER1 :"+user);
    if (!user) {
      this.setResourceParticipant(message.resourceDetails);
      user = DemoAdapter.chatList.find(x => x.id == replyMessage.fromId);
      messageTime = 1200;
    }
    this.messageService.setUnreadStatus(true);
    let count = 0;
    if (count == 0 && !onGroupChat) {
      count++;
      this.messageService.totalUnreadMessage.next(total + 1);
    }

    if (this.historyMessage[senderId]) {
      if (message._id) {
        if (!this.historyMessage[senderId].filter(x => x.id == message._id).length) {
          this.historyMessage[senderId].push(replyMessage);
          if (!onGroupChat) {
            this.onMessageReceived(user, replyMessage);
          }
        }
      }
    } else {
      if (!onGroupChat) {
        this.getResourceMessageHistory(message.receiver);
        this.onMessageReceived(user, replyMessage);
      }
    }

    // if (onGroupChat) {
    //   DemoAdapter.chatList.forEach(function (item, i) {
    //     if (item.id == message.resourceDetails.resourceId) {
    //       item.totalUnreadCount = 0;
    //     }
    //   });
    //   this.listFriends().subscribe(response => {
    //     this.onFriendsListChanged(response);
    //   });
    // }
    this.setParticipantOrder(replyMessage.fromId);
  }

  setParticipantOrder(userId) {
    console.log('Inside order => ', DemoAdapter.chatList)
    DemoAdapter.chatList.forEach(function (item, i) {
      if (item.id === userId) {
        DemoAdapter.chatList.splice(i, 1);
        DemoAdapter.chatList.unshift(item);
      }
    });
    this.listFriends().subscribe(response => {
      this.onFriendsListChanged(response);
    });
  }

  setResourceParticipant(resource) {
    const resUser = {
      participantType: ChatParticipantType.Group,
      id: resource.resourceId,
      displayName: resource.resourceName,
      avatar: null,
      status: ChatParticipantStatus.Online,
      email: '',
      totalUnreadCount: 1,
      totalMessage: 25,
      resourceTableName: resource.tableName,
      parentTableId: resource.tableId,
    };
    DemoAdapter.chatList.push(resUser);
    this.historyMessage[resource.id] = [];
    this.listFriends().subscribe(response => {
      this.onFriendsListChanged(response);
    });
    return resUser;
  }

  setParticipant(user) {
    const participantUser = {
      participantType: ChatParticipantType.User,
      id: user._id,
      displayName: user.firstName + ' ' + user.lastName,
      avatar: null,
      status: ChatParticipantStatus.Online,
      email: user.email,
      totalUnreadCount: 1,
      totalMessage: 25,
    };
    DemoAdapter.chatList.push(participantUser);
    this.historyMessage[user._id] = [];
    this.listFriends().subscribe(response => {
      this.onFriendsListChanged(response);
    });
    return User;
  }

  sendMessage(message): void {


    if (message.message.type == 'image') {
      this.storeImageMessage(message.message);
    } else {
      const data = {
        sender: message.fromId,
        receiver: message.toId,
        text: message.message,
        isGroup: message.isGroup,
        resourceDetails: message.resourceDetails,
        type: 'text',
        dateSeen: null,
      };
      console.log('adp');
      this.socketService.emit('new_message', data);
      this.storeTextMessage(message);
    }
  }

  storeTextMessage(message) {
    const sendMessage = new Message();
    sendMessage.message = message.message;
    sendMessage.dateSent = new Date();
    sendMessage.fromId = message.fromId;
    sendMessage.toId = message.toId;
    sendMessage.sender = message.sender;
    sendMessage.type = message.type;
    sendMessage.isGroup = message.isGroup;

    if (this.historyMessage[message.toId]) {
      this.historyMessage[message.toId].push(sendMessage);
    }
  }

  storeImageMessage(message) {
    const sendMessage = new Message();
    sendMessage.message = message.text;
    sendMessage.dateSent = new Date();
    sendMessage.fromId = message.sender;
    sendMessage.toId = message.receiver;
    sendMessage.type = this.messageService.getMessageType(message.type);

    if (this.historyMessage[message.receiver]) {
      const user = DemoAdapter.chatList.find(x => x.id == sendMessage.toId);
      const sender = DemoAdapter.chatList.find(x => x.id == sendMessage.fromId);
      this.onMessageReceived(sender, sendMessage);
      this.onMessageReceived(user, sendMessage);
      this.historyMessage[message.receiver].push(sendMessage);
    }
  }

  groupCreated(group: Group): void {
    DemoAdapter.chatList.push(group);

    DemoAdapter.chatList = DemoAdapter.chatList.sort((first, second) =>
      second.displayName > first.displayName ? -1 : 1,
    );

    // Trigger update of friends list
    this.listFriends().subscribe(response => {
      this.onFriendsListChanged(response);
    });
  }
}
