import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { IChatParticipant } from "@app/pages/ng-chat-v1/core/chat-participant";
import { Message } from "@app/pages/ng-chat-v1/core/message";
import { ChatParticipantStatus } from "@app/pages/ng-chat-v1/core/chat-participant-status.enum";
import { MessageType } from "@app/pages/ng-chat-v1/core/message-type.enum";
import { Window } from "@app/pages/ng-chat-v1/core/window";
import { environment } from "@env/environment";
import { BehaviorSubject } from "rxjs";
import { SocketService } from "./socket.service";

// import { messages } from './messages';
// import { botReplies, gifsLinks, imageLinks } from './bot-replies';

@Injectable({
  providedIn: "root",
})
export class MessageService {
  totalUnreadMessage: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  showUnreadStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  chatSeenForResource: BehaviorSubject<string> = new BehaviorSubject<string>(
    ""
  );
  internalToChatTabObj: BehaviorSubject<any> = new BehaviorSubject<any>("");
  // imageToInternalChatObj:BehaviorSubject<any> = new BehaviorSubject<any>('');
  redirectionFromMentionObj: BehaviorSubject<any> = new BehaviorSubject<any>(
    ""
  );
  imagePastedInChatTab = new BehaviorSubject<boolean>(false);

  totalUnread: number;
  userId;

  imageToInternalChatObj: EventEmitter<any> = new EventEmitter<any>();
  participantEmitter: EventEmitter<any> = new EventEmitter<any>();
  newMessageEmitter: EventEmitter<Message> = new EventEmitter<Message>();
  newGroupEmitter: EventEmitter<any> = new EventEmitter<any>();
  removeMessageEmitter: EventEmitter<any> = new EventEmitter<any>();
  pushInInternalChat: EventEmitter<any> = new EventEmitter<any>();
  pushAtSenderSideEmitter: EventEmitter<any> = new EventEmitter<any>();
  public chatList: IChatParticipant[] = [];
  constructor(
    private http: HttpClient,
    private socketService: SocketService,
    private route: Router
  ) {
    this.participantEmitter.subscribe((res) => {
      if (res) {
        this.chatList = res.participantList;
      }
    });

    if (localStorage.getItem("userData")) {
      this.userId = JSON.parse(localStorage.getItem("userData"))._id;
    }
    // this.imageToInternalChatObj.subscribe((ele) => {
    //   if (ele.file != "") {
    //     // ele.sender = this.currentUser;
    //     // this.messageList.push(ele);
    //     this.uploadFiles(ele.file, ele.resource);
    //   }
    // });
  }
  uploadFiles(file, resource) {
    if (localStorage.getItem("userData")) {
      this.userId = JSON.parse(localStorage.getItem("userData"))._id;
    }
    const data = {
      receiver: resource.resourceId,
      type: "image",
      sender: this.userId,
      file: file,
      isGroup: true,
      resourceDetails: resource,
    };

    const fileFormat = [
      {
        url: file.src,
        type: file.type,
        icon: "file-text-outline",
      },
    ];

    // this.fileUploading = true;
    this.uploadChatImages(data).subscribe((res: any) => {
      if (res.message) {
        fileFormat[0].url = res.message.text;
        const msg = {
          sender: this.userId,
          receiver: resource.resourceId,
          type: "image",
          resourceDetails: resource,
          dateSent: new Date(),
          dateSeen: null,
          reply: true,
          files: fileFormat,
          id: res.message._id ? res.message._id : (res.message.id ? res.message.id : '')
        };

        const emitMessage = {
          sender: this.userId,
          receiver: resource.resourceId,
          type: "image",
          resourceDetails: resource,
          dateSent: new Date(),
          dateSeen: null,
          reply: true,
          text: res.message.text,
          id: res.message._id ? res.message._id : (res.message.id ? res.message.id : '')
        };
        const shouldSave = "no";
        const data = {
          resourceId: resource.resourceId,
          message: emitMessage,
          shouldSave: shouldSave,
        };
        // this.socketService.emit('message_on_room', data);
        this.messageOnRoom(data);
      }
    });
  }
  deleteMessage(id) {
    return this.http.delete(`${environment.apiUrl}/message/${id}`);
  }

  emitRemovedMessage(id) {
    this.removeMessageEmitter.emit(id);
  }
  gettotalUnread() {
    return this.totalUnread;
  }

  setUnreadStatus(value: boolean) {
    this.showUnreadStatus.next(value);
  }

  setTotalUnread(increment: boolean) {
    increment ? this.totalUnread + 1 : this.totalUnread - 1;
  }

  getMessageType(type): MessageType {
    let messageType = MessageType.Text;
    if (type) {
      switch (type.toLowerCase()) {
        case "1":
          messageType = MessageType.Text;
          break;
        case "text":
          messageType = MessageType.Text;
          break;
        case "file":
          messageType = MessageType.File;
          break;
        case "image":
          messageType = MessageType.Image;
          break;
        default:
          break;
      }
    }
    return messageType;
  }

  getResourceMessageType(type) {
    if (type == 3 || type == "image") {
      return "file";
    } else {
      return "text";
    }
  }

  getUnreadMessage() {
    this.getChatUserData().subscribe((res: any) => {
      if (res.statusCode === 200) {
        let totalmsg = 0;
        res.data.forEach((element) => {
          if (element.totalUnreadCount) {
            totalmsg += element.totalUnreadCount;
          }
        });
        this.totalUnreadMessage.next(totalmsg);
      }
    });
  }

  getChatUserData() {
    return this.http.get(
      `${environment.apiUrl}/user/allWithUnreadMessageCount`
    );
  }

  searchUserByEmail(email: string) {
    return this.http.get(
      `${environment.apiUrl}/user/searchByEmail?email=${email}`
    );
  }

  getMessages(receiverId: string, currentUserId: string, isGroup = false) {
    let apiUrl = `${environment.apiUrl}/message/all?sender=${currentUserId}&receiver=${receiverId}`;
    if (isGroup) {
      apiUrl += "&isGroup=yes";
    }
    return this.http.get(apiUrl);
  }

  getResourceChatHistory(resourceId) {
    const apiUrl = `${environment.apiUrl}/message/getChatHistory/${resourceId}`;
    return this.http.get(apiUrl);
  }

  uploadChatImages(imageData) {
    const fileName = new Date().getTime();
    const formData: FormData = new FormData();
    formData.append("receiver", imageData.receiver);
    formData.append("type", imageData.type);
    formData.append("sender", imageData.sender);
    formData.append(
      "resourceDetails",
      JSON.stringify(imageData.resourceDetails)
    );
    formData.append("file", imageData.file, fileName + imageData.file.name);
    if (imageData.isGroup) {
      formData.append("isGroup", imageData.isGroup);
    }
    return this.http.post(`${environment.apiUrl}/message/upload`, formData);
  }

  uploadResourceChatImages(imageData) {
    const fileName = new Date().getTime();
    const formData: FormData = new FormData();
    formData.append("receiver", imageData.receiver);
    formData.append("type", imageData.type);
    formData.append("sender", imageData.sender);
    formData.append("file", imageData.file.url, fileName + imageData.file.name);

    return this.http.post(`${environment.apiUrl}/message/upload`, formData);
  }

  loadMoreMessages(data: Window, isGroup = false) {
    if (localStorage.getItem("userData")) {
      this.userId = JSON.parse(localStorage.getItem("userData"))._id;
    }
    let apiUrl = `${environment.apiUrl}/message/all?sender=${this.userId}&receiver=${data.participant.id}&skip=${data.skipMessage}`;
    if (isGroup) {
      apiUrl += "&isGroup=yes";
    }
    return this.http.get(apiUrl);
  }

  loadMoreResourceMessages(resourceId, skip) {
    const apiUrl = `${environment.apiUrl}/message/getChatHistory/${resourceId}`;

    return this.http.get(`${apiUrl}?skip=${skip}`);
  }

  createMessages(
    receiverId: string,
    currentUserId: string,
    messages: string = null
  ) {
    const data = {
      sender: currentUserId,
      receiver: receiverId,
      text: messages,
    };
    return this.http.post(`${environment.apiUrl}/message`, data);
  }

  createGroup(data) {
    return this.http.post(`${environment.apiUrl}/message-group/create`, data);
  }
  getSubscribers(data) {
    return this.http.get(
      `${environment.apiUrl}/message-group/get-subscribers?groupId=${data}`
    );
    //return this.http.get(`${environment.apiUrl}/chat-subscription/resource-subscriptions/${data}`);
  }
  getStatus(status): ChatParticipantStatus {
    let chatStatus = ChatParticipantStatus.Offline;
    switch (status) {
      case "Away":
        chatStatus = ChatParticipantStatus.Away;
        break;
      case "Online":
        chatStatus = ChatParticipantStatus.Online;
        break;
      case "Offline":
        chatStatus = ChatParticipantStatus.Offline;
        break;
      default:
        break;
    }
    return chatStatus;
  }
  userStatusChangeonListen(id, status) {
    const chatStatus = this.getStatus(status);
    const user = this.chatList.find((x) => x.id == id);
    if (user) {
      user.status = chatStatus;
    }
  }
  userStatusChange(data) {
    this.socketService.emit("user_status_change", data);
  }
  messageOnRoom(data) {
    this.socketService.emit("message_on_room", data);
  }
  Join(resourceId) {
    this.socketService.emit("join", resourceId);
  }
  messageStatusChange(data) {
    this.socketService.emit("message_status_change", data);
  }
  newMessage(data) {
    this.socketService.emit("new_message", data);
  }

  setNewMessageIdAtSenderSide(message) {
    let messageTime = 6000;
    const replyMessage = new Message();
    replyMessage.message = message.text;
    replyMessage.dateSent = new Date();
    replyMessage.fromId = message.sender._id;
    replyMessage.toId = message.receiver;
    replyMessage.type = this.getMessageType(message.type);
    replyMessage.id = message._id ? message._id : (message.id ? message.id : '');
    replyMessage.sender = message.sender;
    replyMessage.resourceDetails = message.resourceDetails;
    replyMessage.replyTo = message.replyTo;
    this.pushAtSenderSideEmitter.emit(replyMessage);
  }

  setChatList(particpiants) {
    this.chatList = particpiants;
  }

  receiveMessage(message, total: number, resourceMessage = false) {
    // const senderId = resourceMessage ? message.receiver : message.sender._id;
    if (localStorage.getItem("userData")) {
      this.userId = JSON.parse(localStorage.getItem("userData"))._id;
    }
    const senderId = message.sender._id;

    let messageTime = 6000;
    const replyMessage = new Message();
    replyMessage.message = message.text;
    replyMessage.dateSent = new Date();
    replyMessage.fromId = message.sender._id;
    replyMessage.toId = message.receiver;
    replyMessage.type = this.getMessageType(message.type);
    replyMessage.id = message._id ? message._id : "";
    replyMessage.sender = message.sender;
    replyMessage.replyTo = message.replyTo;

    if (!replyMessage.isGroup) {
      if (message.receiver !== message.sender._id && message.receiver != this.userId) {
        return;
      }
    }

    let user = this.chatList.find((x) => x.id == replyMessage.fromId);
    if (!user) {
      if (!resourceMessage) {
        // this.setParticipant(message.sender);
      } else {
        // this.setResourceParticipant(message.resourceDetails);
      }
      user = this.chatList.find((x) => x.id == replyMessage.fromId);
      messageTime = 1200;
    }
    this.setUnreadStatus(true);

    this.newMessageEmitter.emit(replyMessage);

    // if (this.historyMessage[senderId]) {
    //   if (message._id) {
    //     if (!this.historyMessage[senderId].filter(x => x.id == message._id).length) {
    //       this.historyMessage[senderId].push(replyMessage);
    //       this.onMessageReceived(user, replyMessage);
    //     }
    //   }
    // } else {
    //   this.getMessageHistory(senderId, resourceMessage);
    //   this.onMessageReceived(user, replyMessage);
    // }

    // this.setParticipantOrder(replyMessage.fromId);
  }

  receiveResourceMessage(message, total) {
    const href = this.route.url;
    let onGroupChat = false;
    const urlArray = href.split("/");
    if (urlArray[7] == "Chats") {
      if (
        message.resourceDetails.resourceId == urlArray[6] &&
        message.resourceDetails.tableId == urlArray[4]
      ) {
        onGroupChat = true;
      }
    }

    if (message.messageType == "log") {
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
    replyMessage.type = this.getMessageType(message.type);
    replyMessage.messageType = message.messageType;
    replyMessage.id = message._id ? message._id : "";
    replyMessage.resourceDetails = message.resourceDetails;

    let user = this.chatList.find((x) => x.id == replyMessage.fromId);
    if (!user) {
      user = this.chatList.find((x) => x.id == replyMessage.fromId);
      messageTime = 1200;
    }
    this.setUnreadStatus(true);

    this.newMessageEmitter.emit(replyMessage);

    // if (this.historyMessage[senderId]) {
    //   if (message._id) {
    //     if (!this.historyMessage[senderId].filter(x => x.id == message._id).length) {
    //       this.historyMessage[senderId].push(replyMessage);
    //       if (!onGroupChat) {
    //         this.onMessageReceived(user, replyMessage);
    //       }
    //     }
    //   }
    // } else {
    //   if (!onGroupChat) {
    //     this.getResourceMessageHistory(message.receiver);
    //     this.onMessageReceived(user, replyMessage);
    //   }
    //}

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
    // this.setParticipantOrder(replyMessage.fromId);
  }

  groupExists(subscribers) {
    return this.http.post(
      `${environment.apiUrl}/message-group/checkIfGroupExists`,
      subscribers
    );
  }
}
