import {
  Component,
  Input,
  OnInit,
  ViewChildren,
  QueryList,
  HostListener,
  Output,
  EventEmitter,
  ViewEncapsulation
} from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { ChatAdapter } from "./core/chat-adapter";
import { IChatGroupAdapter } from "./core/chat-group-adapter";
import { User } from "./core/user";
import { ParticipantResponse } from "./core/participant-response";
import { Message } from "./core/message";
import { MessageType } from "./core/message-type.enum";
import { Window } from "./core/window";
import { ChatParticipantStatus } from "./core/chat-participant-status.enum";
import { ScrollDirection } from "./core/scroll-direction.enum";
import { Localization, StatusDescription } from "./core/localization";
import { IChatController } from "./core/chat-controller";
import { PagedHistoryChatAdapter } from "./core/paged-history-chat-adapter";
import { IFileUploadAdapter } from "./core/file-upload-adapter";
import { DefaultFileUploadAdapter } from "./core/default-file-upload-adapter";
import { Theme } from "./core/theme.enum";
import { IChatOption } from "./core/chat-option";
import { Group } from "./core/group";
import { ChatParticipantType } from "./core/chat-participant-type.enum";
import { IChatParticipant } from "./core/chat-participant";

import { delay, map } from "rxjs/operators";
import { NgChatWindowComponent } from "./components/ng-chat-window/ng-chat-window.component";
import { MessageService } from "@app/shared/services/message.service";
import { totalmem } from "os";
import { ParticipantMetadata } from "./core/participant-metadata";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";

@Component({
  selector: "ng-chat",
  templateUrl: "ng-chat.component.html",
  styleUrls: [
    "assets/icons.css",
    "assets/loading-spinner.css",
    "assets/ng-chat.component.default.css",
    "assets/themes/ng-chat.theme.default.scss",
    "assets/themes/ng-chat.theme.dark.scss"
  ],
  encapsulation: ViewEncapsulation.None
})
export class NgChat implements OnInit, IChatController {
  totalUnreadMessage: number;
  closeExistingWindow: any;
  alreadyOpenedWindow: any;
  participantIds: any = [];
  mainIndex: any;
  constructor(
    private _httpClient: HttpClient,
    private messageService: MessageService
  ) {
    this.fetchFriendsList();
    this.messageService.pushAtSenderSideEmitter.subscribe(async res=>{
      if(res){
        this.storeTextMessage(res);
      }
    })
  }

  ngAfterViewInit() {
    this.messageService.participantEmitter.subscribe((res: any) => {
      if (res) {
        this.participants = res.participantList;
        this.participants = this.participants.filter(f => f.displayName && !f.displayName.includes("undefined"));
        if (res.newParticipantOnSearchFlag) {
          if (
            this.participants &&
            this.participants.length &&
            this.participantsResponse &&
            this.participantsResponse.length
          ) {
            this.participants.forEach(ele => {
              let index = this.participantsResponse.findIndex(
                v => v.participant.id == ele.id
              );
              if (index == -1) {
                let participantResponseObj = new ParticipantResponse();
                participantResponseObj.metadata = new ParticipantMetadata();
                participantResponseObj.participant = ele;
                participantResponseObj.metadata = this.participantsResponse[0].metadata;
                this.participantsResponse.push(participantResponseObj);
                this.historyMessage[ele.id] = [];
              }
            });
          }
        }
        setTimeout(()=>{
          this.allowClickFlag = true;
        },2000);

      }
    });
    this.messageService.newGroupEmitter.subscribe(response => {
      const newParticipant = this.participants.findIndex(
        y => y.id == response.fromId
      );
      if (newParticipant == -1) {
        let newparticipantObj: IChatParticipant = null;
        if (response.resourceDetails.resourceId != "") {
          newparticipantObj = {
            participantType: ChatParticipantType.Group,
            id: response.resourceDetails.resourceId,
            displayName: response.resourceDetails.resourceName,
            avatar: null,
            status: 3,
            email: "",
            totalUnreadCount: 0,
            resourceTableName: "",
            parentTableId: "",
            subscribers:response.subscribers
          };
        }


        //  this.participants.push(newparticipantObj);
        this.participants.unshift(newparticipantObj);
        this.historyMessage[response.fromId] = [];
        let participantResponseObj = new ParticipantResponse();
        participantResponseObj.metadata = new ParticipantMetadata();
        participantResponseObj.participant = newparticipantObj;
        participantResponseObj.metadata = this.participantsResponse[0].metadata;
        this.participantsResponse.push(participantResponseObj);
      }
      let index = this.participantsResponse.findIndex(
        i => i.participant.id == response.resourceDetails.resourceId
      );
      this.participantsResponse.forEach(ele => {

        if (this.userId == response.sender._id) {
          // ele.participant.totalUnreadCount += 1;
          this.openChatWindow(this.participantsResponse[index].participant, true, true);
        }

        // ele.metadata.totalUnreadMessages += 1;
      });
      // if (this.participantsResponse && this.participantsResponse.length) {
      //   this.totalUnreadMessage = this.participantsResponse[0].metadata.totalUnreadMessages;
      //   let index = this.participantsResponse.findIndex(
      //     i => i.participant.id == response.fromId
      //   );
      //   if (index > -1) {
      //     if(this.participantsResponse[index].participant.participantType!=ChatParticipantType.Group)
      //     this.openChatWindow(this.participantsResponse[index].participant);
      //   }
      // }
    });
    this.messageService.newMessageEmitter.subscribe(async res => {

      if (res.messageType == 'log' && !res.message.includes('Assigned')) {
        //-- We don't show logs on internal chat, unless this is task assigned notification.
        return;
      }

      const newParticipant = this.participants.findIndex(
        y => y.id == res.fromId
      );

      if (newParticipant == -1) {
        let newparticipantObj: IChatParticipant = null;
        if (res.isGroup == false) {
          newparticipantObj = {
            participantType: ChatParticipantType.User,
            id: res.fromId,
            displayName: res.sender.firstName + " " + res.sender.lastName,
            avatar: null,
            status: res.sender.status,
            email: res.sender.email,
            totalUnreadCount: 0
          };
        } else {
          newparticipantObj = {
            participantType: ChatParticipantType.Group,
            id: res.fromId,
            displayName: res.resourceDetails.resourceName,
            avatar: null,
            status: res.sender.status,
            email: res.sender.email,
            totalUnreadCount: 0,
            resourceTableName: res.resourceDetails.tableName,
            parentTableId: res.resourceDetails.tableId
          };
        }

        this.participants.push(newparticipantObj);
        this.historyMessage[res.fromId] = [];
        let participantResponseObj = new ParticipantResponse();
        participantResponseObj.metadata = new ParticipantMetadata();
        participantResponseObj.participant = newparticipantObj;
        participantResponseObj.metadata = this.participantsResponse[0].metadata;
        this.participantsResponse.push(participantResponseObj);
      }
      await this.changeParticipantPosOnMessage(res.fromId);
      if (!this.historyMessage[res.fromId]) {
        this.historyMessage[res.fromId] = [];
      }
      this.historyMessage[res.fromId].push(res);
      if (res.sender._id != this.userId || res.messageType == 'reminder') {
        const openedWindow = this.windows.find(
          x => x.participant.id == res.fromId
        );
        if (openedWindow && !openedWindow.isCollapsed) {
          this.markMessagesAsRead(
            openedWindow.messages,
            openedWindow.participant
          );
          this.scrollChatWindow(openedWindow, ScrollDirection.Bottom);
        } else {

          let count = 0;
          this.participantsResponse.forEach(ele => {
            if (ele.participant.id == res.fromId) {
              ele.participant.totalUnreadCount += 1;
              count = ele.metadata.totalUnreadMessages + 1;
              // ele.metadata.totalUnreadMessages += 1;
            }
          });
          this.participantsResponse.forEach(ele => {
            ele.metadata.totalUnreadMessages = count;
          });
          if (this.participantsResponse && this.participantsResponse.length) {
            this.totalUnreadMessage = this.participantsResponse[0].metadata.totalUnreadMessages;
            let index = this.participantsResponse.findIndex(
              i => i.participant.id == res.fromId
            );
            if (index > -1) {
              if (this.participantsResponse[index].participant.participantType != ChatParticipantType.Group){
                this.centerPositionFlag=true;
                this.openChatWindow(this.participantsResponse[index].participant,true,true,true);
              }
            }
          }
        }
      }
    });

    this.messageService.redirectionFromMentionObj.subscribe(ele => {
      // if (ele && ele.id != this.userId) {
        let isNewParticipantIndex = this.participants.findIndex(
          x => x.id == ele.id
        );
        if (isNewParticipantIndex == -1) {
          this.participants.push(ele);
        }
        if(ele)
        this.openChatWindow(ele, true, true);
      // }
    });


  }

  // Exposes enums for the ng-template
  public ChatParticipantType = ChatParticipantType;
  public ChatParticipantStatus = ChatParticipantStatus;
  public MessageType = MessageType;

  private _isDisabled: boolean = false;

  get isDisabled(): boolean {
    return this._isDisabled;
  }

  set isDisabled(value: boolean) {
    // this._isDisabled = value;
    // if (value) {
    // To address issue https://github.com/rpaschoal/ng-chat/issues/120
    //   window.clearInterval(this.pollingIntervalWindowInstance);
    // } else {
    //   this.activateFriendListFetch();
    // }
  }

  insertAndShift(arr, from, to) {
    let cutOut = arr.splice(from, 1)[0]; // cut the element at index 'from'
    arr.splice(to, 0, cutOut); // insert it at index 'to'
  }

  // @Input()
  // public adapter: ChatAdapter;

  historyMessage = [];

  public groupAdapter: IChatGroupAdapter;

  @Input()
  public userId: any;

  public isCollapsed: boolean = true;

  public maximizeWindowOnNewMessage: boolean = false;

  public pollFriendsList: boolean = false;

  public pollingInterval: number = 5000;

  public historyEnabled: boolean = true;

  public emojisEnabled: boolean = true;

  public linkfyEnabled: boolean = true;

  public audioEnabled: boolean = true;

  public searchEnabled: boolean = true;

  // TODO: This might need a better content strategy
  public audioSource: string =
    "assets/notification1.mp3";

  public persistWindowsState: boolean = true;

  public title: string = "Internal Chat";

  public messagePlaceholder: string = "Type a message or drop image";

  public searchPlaceholder: string = "Search";

  public browserNotificationsEnabled: boolean = true;

  // TODO: This might need a better content strategy
  public browserNotificationIconSource: string =
    "https://raw.githubusercontent.com/rpaschoal/ng-chat/master/src/ng-chat/assets/notification.png";

  public browserNotificationTitle: string = "New message from";

  public historyPageSize: number = 10;

  public localization: Localization;

  public hideFriendsList: boolean = false;

  public hideFriendsListOnUnsupportedViewport: boolean = true;

  @Input()
  public fileUploadUrl: string;

  public theme = Theme.Light;

  public customTheme: string;

  public messageDatePipeFormat: string = "short";

  public showMessageDate: boolean = true;

  public isViewportOnMobileEnabled: boolean = false;

  public addPeopleParticipant: IChatParticipant;

  public addPeopleFlag: boolean = false;

  @Output()
  public onParticipantClicked: EventEmitter<
    IChatParticipant
  > = new EventEmitter<IChatParticipant>();

  @Output()
  public onParticipantChatOpened: EventEmitter<
    IChatParticipant
  > = new EventEmitter<IChatParticipant>();

  @Output()
  public onParticipantChatClosed: EventEmitter<
    IChatParticipant
  > = new EventEmitter<IChatParticipant>();

  @Output()
  public onMessagesSeen: EventEmitter<Message[]> = new EventEmitter<
    Message[]
  >();

  @Output()
  public onPushSendMessage: EventEmitter<Message> = new EventEmitter<Message>();

  public browserNotificationsBootstrapped: boolean = false;

  public hasPagedHistory: boolean = false;

  // Don't want to add this as a setting to simplify usage. Previous placeholder and title settings available to be used, or use full Localization object.
  private statusDescription: StatusDescription = {
    online: "Online",
    busy: "Busy",
    away: "Away",
    offline: "Offline"
  };

  public audioFile: HTMLAudioElement;

  public participants: IChatParticipant[] = [];

  public participantsResponse: ParticipantResponse[] = [];

  public participantsInteractedWith: IChatParticipant[] = [];

  public currentActiveOption: IChatOption | null;

  public pollingIntervalWindowInstance: number;

  private get localStorageKey(): string {
    return `ng-chat-users-${this.userId}`; // Appending the user id so the state is unique per user in a computer.
  }

  // Defines the size of each opened window to calculate how many windows can be opened on the viewport at the same time.
  public windowSizeFactor: number = 320;

  // Total width size of the friends list section
  public friendsListWidth: number = 262;

  // Available area to render the plugin
  private viewPortTotalArea: number;

  // Set to true if there is no space to display at least one chat window and 'hideFriendsListOnUnsupportedViewport' is true
  public unsupportedViewport: boolean = false;

  // File upload adapter
  // public fileUploadAdapter: IFileUploadAdapter;

  windows: Window[] = [];
  dragPosition = [];
  isBootstrapped: boolean = false;
  centerPositionFlag:boolean=false;

  @ViewChildren("chatWindow") chatWindows: QueryList<NgChatWindowComponent>;

  ngOnInit() {
    this.bootstrapChat();
  }

  // START OWN MODIFICATION
  onChangeSoundOption(enableSound: boolean) {
    this.audioEnabled = enableSound;
  }
  // END OWN MODIFICATION

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    // this.viewPortTotalArea = event.target.innerWidth;
    // this.NormalizeWindows();
  }

  // Checks if there are more opened windows than the view port can display
  private NormalizeWindows(): void {
    const maxSupportedOpenedWindows = Math.floor(
      (this.viewPortTotalArea -
        (!this.hideFriendsList ? this.friendsListWidth : 0)) /
      this.windowSizeFactor
    );
    const difference = this.windows.length - maxSupportedOpenedWindows;

    if (difference >= 0) {
      this.windows.splice(this.windows.length - difference);
    }

    this.updateWindowsState(this.windows);

    // Viewport should have space for at least one chat window but should show in mobile if option is enabled.
    this.unsupportedViewport = this.isViewportOnMobileEnabled
      ? false
      : this.hideFriendsListOnUnsupportedViewport &&
      maxSupportedOpenedWindows < 1;
  }

  // Initializes the chat plugin and the messaging adapter
  private bootstrapChat(): void {
    //   let initializationException = null;

    //   if (this.adapter != null && this.userId != null) {
    //     try {
    this.viewPortTotalArea = window.innerWidth;

    this.initializeTheme();
    this.initializeDefaultText();
    this.initializeBrowserNotifications();

    //       // Binding event listeners
    //       this.adapter.messageReceivedHandler = (participant, msg) => this.onMessageReceived(participant, msg);
    //       this.adapter.friendsListChangedHandler = (participantsResponse) => this.onFriendsListChanged(participantsResponse);

    //       this.activateFriendListFetch();

    this.bufferAudioFile();

    //       this.hasPagedHistory = this.adapter instanceof PagedHistoryChatAdapter;

    //       if (this.fileUploadUrl && this.fileUploadUrl !== '') {
    //         this.fileUploadAdapter = new DefaultFileUploadAdapter(this.fileUploadUrl, this.userId, this._httpClient);
    //       }

    this.NormalizeWindows();

    //       this.isBootstrapped = true;
    //     } catch (ex) {
    //       initializationException = ex;
    //     }
    //   }

    //   if (!this.isBootstrapped) {
    //     console.error('ng-chat component couldn\'t be bootstrapped.');

    //     if (this.userId == null) {
    //       console.error('ng-chat can\'t be initialized without an user id. Please make sure you\'ve provided an userId as a parameter of the ng-chat component.');
    //     }
    //     if (this.adapter == null) {
    //       console.error('ng-chat can\'t be bootstrapped without a ChatAdapter. Please make sure you\'ve provided a ChatAdapter implementation as a parameter of the ng-chat component.');
    //     }
    //     if (initializationException) {
    //       console.error(`An exception has occurred while initializing ng-chat. Details: ${initializationException.message}`);
    //       console.error(initializationException);
    //     }
    //   }
  }

  private activateFriendListFetch(): void {
    //   if (this.adapter) {
    //     // Loading current users list
    //     if (this.pollFriendsList) {
    //       // Setting a long poll interval to update the friends list
    //       this.fetchFriendsList(true);
    //       this.pollingIntervalWindowInstance = window.setInterval(() => this.fetchFriendsList(false), this.pollingInterval);
    //     } else {
    //       // Since polling was disabled, a friends list update mechanism will have to be implemented in the ChatAdapter.
    //       this.fetchFriendsList(true);
    //     }
    //   }
  }

  // Initializes browser notifications
  private async initializeBrowserNotifications() {
    if (this.browserNotificationsEnabled && "Notification" in window) {
      if ((await Notification.requestPermission()) === "granted") {
        this.browserNotificationsBootstrapped = true;
      }
    }
  }

  // Initializes default text
  private initializeDefaultText(): void {
    if (!this.localization) {
      this.localization = {
        messagePlaceholder: this.messagePlaceholder,
        searchPlaceholder: this.searchPlaceholder,
        title: this.title,
        statusDescription: this.statusDescription,
        browserNotificationTitle: this.browserNotificationTitle,
        loadMessageHistoryPlaceholder: "Load older messages"
      };
    }
  }

  private initializeTheme(): void {
    if (this.customTheme) {
      this.theme = Theme.Custom;
    } else if (this.theme != Theme.Light && this.theme != Theme.Dark) {
      // TODO: Use es2017 in future with Object.values(Theme).includes(this.theme) to do this check
      throw new Error(
        `Invalid theme configuration for ng-chat. "${this.theme}" is not a valid theme value.`
      );
    }
  }

  // public fetchFriendsList(isBootstrapping: boolean): void {
  // Sends a request to load the friends list
  allowClickFlag = false;
  public fetchFriendsList(): void {
    this.messageService.getChatUserData().subscribe(data => {
      let arrayOfUsers = [];
      let participantCopy = [];
      let headerTotalUnreadMessageCount = 0;
      arrayOfUsers = data["data"];
      arrayOfUsers = arrayOfUsers.filter(v => v._id != null);
      arrayOfUsers.forEach(e => {
        let status = ChatParticipantStatus.Offline;

        if (e.status) {
          status = this.messageService.getStatus(e.status);
        }

        let participantResponseObj = new ParticipantResponse();
        participantResponseObj.metadata = new ParticipantMetadata();
        if (!e.resourceDetails) {
          const participant: IChatParticipant = {
            participantType: ChatParticipantType.User,
            id: e._id,
            displayName: e.firstName + " " + e.lastName,
            avatar: null,
            status: status,
            email: "",
            totalUnreadCount: e.totalUnreadCount,
            userColor: e.userColor,
          };
          if (participant.displayName != "") {
            participantCopy.push(participant);
            participantResponseObj.participant = participant;
            // participantResponseObj.metadata.totalUnreadMessages = participant.totalUnreadCount;
            headerTotalUnreadMessageCount += participant.totalUnreadCount;
            this.participantsResponse.push(participantResponseObj);

            this.getMessageHistory(e._id);
          }
        } else if(e._id != this.userId) {

          const participant: IChatParticipant = {
            participantType: ChatParticipantType.Group,
            id: e._id,
            displayName: e.resourceDetails.resourceName,
            avatar: null,
            status: status,
            email: "",
            totalUnreadCount: e.totalUnreadCount,
            resourceTableName: e.resourceDetails.tableName,
            parentTableId: e.resourceDetails.tableId,
            subscribers:e.subscribers,
            userColor: e.userColor,
          };
          if (participant.displayName != "") {
            participantCopy.push(participant);
            participantResponseObj.participant = participant;
            headerTotalUnreadMessageCount += participant.totalUnreadCount;
            this.participantsResponse.push(participantResponseObj);

            this.getMessageHistory(e._id, true);
          }
        }
      });
      this.messageService.participantEmitter.emit({
        participantList: participantCopy,
        newParticipantOnSearchFlag: false
      });

      this.participantsResponse.forEach(element => {
        element.metadata.totalUnreadMessages = headerTotalUnreadMessageCount;
      });
      this.totalUnreadMessage = headerTotalUnreadMessageCount;
    });
  }

  getMessageHistory(
    destinataryId: any,
    isGroup = false
  ): Observable<Message[]> {
    let mockedHistory: Array<Message> = [];

    if (!this.historyMessage[destinataryId]) {
      this.messageService
        .getMessages(destinataryId, this.userId, isGroup)
        .subscribe((res: any) => {
          if (res.data && res.data && res.data.length) {
            res.data.reverse().forEach(e => {
              if(e.sender){
                let dateSeen = e.dateSeen;

              if (isGroup) {
                dateSeen = new Date();
              }

              if (isGroup && e.subscribers && e.subscribers.length) {
                const subs = e.subscribers.find(
                  x => x.receiver == this.userId && x.visibility == "read"
                );
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
                replyTo:e.replyTo,
                subscribers: e.subscribers,
                id:e._id
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

  fetchMessageHistory(window: Window) {
    window.isLoadingHistory = true;
    // Not ideal but will keep this until we decide if we are shipping pagination with the default adapter

    // if (this.adapter instanceof PagedHistoryChatAdapter) {
    //   window.isLoadingHistory = true;

    //   this.adapter.getMessageHistoryByPage(window.participant.id, this.historyPageSize, ++window.historyPage)
    //     .pipe(
    //       map((result: Message[]) => {
    //         result.forEach((message) => this.assertMessageType(message));

    //         window.messages = result.concat(window.messages);
    //         window.isLoadingHistory = false;

    //         const direction: ScrollDirection = (window.historyPage == 1) ? ScrollDirection.Bottom : ScrollDirection.Top;
    //         window.hasMoreMessages = result.length == this.historyPageSize;

    //         setTimeout(() => this.onFetchMessageHistoryLoaded(result, window, direction, true));
    //       }),
    //     ).subscribe();
    // } else {
    //   if (window.participant.participantType == 1) {
    //     this.adapter.getResourceMessageHistory(window.participant.id)
    //       .pipe(
    //         map((result: Message[]) => {
    //           result.forEach((message) => this.assertMessageType(message));

    //           window.messages = result.concat(window.messages);
    //           window.isLoadingHistory = false;

    //           setTimeout(() => this.onFetchMessageHistoryLoaded(result, window, ScrollDirection.Bottom));
    //         }),
    //       ).subscribe();
    //   } else {
    //     this.adapter.getMessageHistory(window.participant.id)
    //       .pipe(
    //         map((result: Message[]) => {
    //           result.forEach((message) => this.assertMessageType(message));

    //           window.messages = result.concat(window.messages);
    //           window.isLoadingHistory = false;

    //           setTimeout(() => this.onFetchMessageHistoryLoaded(result, window, ScrollDirection.Bottom));
    //         }),
    //       ).subscribe();
    //   }
    // }
  }

  private onFetchMessageHistoryLoaded(
    messages: Message[],
    window: Window,
    direction: ScrollDirection,
    forceMarkMessagesAsSeen: boolean = false
  ): void {
    // this.scrollChatWindow(window, direction);
    // if (window.hasFocus || forceMarkMessagesAsSeen) {
    //   const unseenMessages = messages.filter(m => !m.dateSeen);
    //   this.markMessagesAsRead(unseenMessages);
    // }
  }

  // Updates the friends list via the event handler
  private onFriendsListChanged(
    participantsResponse: ParticipantResponse[]
  ): void {
    // if (participantsResponse) {
    //   this.participantsResponse = participantsResponse;
    //   this.participants = participantsResponse.map((response: ParticipantResponse) => {
    //     return response.participant;
    //   });
    //   // this.participantsInteractedWith = [];
    // }
  }

  // Handles received messages by the adapter
  private onMessageReceived(participant: IChatParticipant, message: Message) {
    // if (participant && message) {
    //   const chatWindow = this.openChatWindow(participant);
    //   this.assertMessageType(message);
    //   if (!chatWindow[1] || !this.historyEnabled) {
    //     chatWindow[0].messages.push(message);
    //     this.scrollChatWindow(chatWindow[0], ScrollDirection.Bottom);
    //     if (chatWindow[0].hasFocus) {
    //       this.markMessagesAsRead([message]);
    //     }
    //   }
    //   if (message.fromId != this.userId) {
    //     this.emitMessageSound(chatWindow[0]);
    //     // Github issue #58
    //     // Do not push browser notifications with message content for privacy purposes if the 'maximizeWindowOnNewMessage' setting is off and this is a new chat window.
    //     if (this.maximizeWindowOnNewMessage || (!chatWindow[1] && !chatWindow[0].isCollapsed)) {
    //       // Some messages are not pushed because they are loaded by fetching the history hence why we supply the message here
    //       this.emitBrowserNotification(chatWindow[0], message);
    //     }
    //   }
    // }
  }

  onParticipantClickedFromWindowList(participant: IChatParticipant): void {
    this.onParticipantClickedFromFriendsList(participant);
  }

  onParticipantClickedFromFriendsList(participant: IChatParticipant): void {
    this.openChatWindow(participant, true, true,false);
    this.centerPositionFlag = false;
    const index = this.participantIds.findIndex((res) => res.id === participant.id);
    if (index == -1) {
      this.participantIds.push({id: participant.id});
    }
    this.alreadyOpenedWindow = { pId: this.participantIds, clickedParticipant: participant};
  }

  private cancelOptionPrompt(): void {
    // if (this.currentActiveOption) {
    //   this.currentActiveOption.isActive = false;
    //   this.currentActiveOption = null;
    // }
  }

  onOptionPromptCanceled(): void {
    this.addPeopleFlag = false;
  }

  onOptionPromptConfirmed(event: any): void {
    // For now this is fine as there is only one option available. Introduce option types and type checking if a new option is added.
    // this.confirmNewGroup(event);
    // // Canceling current state
    // this.cancelOptionPrompt();
  }

  private confirmNewGroup(users: User[]): void {
    // const newGroup = new Group(users);
    // this.openChatWindow(newGroup);
    // if (this.groupAdapter) {
    //   this.groupAdapter.groupCreated(newGroup);
    // }
  }

  // Opens a new chat whindow. Takes care of available viewport
  // Works for opening a chat window for an user or for a group
  // Returns => [Window: Window object reference, boolean: Indicates if this window is a new chat window]
  private openChatWindow(
    participant: IChatParticipant,
    focusOnNewWindow: boolean = false,
    invokedByUserClick: boolean = false,
    populate:boolean = false
  ): [Window, boolean] {

    const openedWindow = this.windows.find(
      x => x.participant.id == participant.id
    );
    const openedIndex = this.windows.findIndex(
      x => x.participant.id == participant.id
    );
    if (openedWindow && invokedByUserClick && !openedWindow.isCollapsed) {
      const unseenMessages = openedWindow.messages.filter(m => !m.dateSeen);
      this.markMessagesAsRead(unseenMessages, participant);
    }

    if (!openedWindow) {
      // Refer to issue #58 on Github
      const collapseWindow = invokedByUserClick
        ? false
        : !this.maximizeWindowOnNewMessage;

      const newChatWindow: Window = new Window(
        participant,
        this.historyEnabled,
        collapseWindow
      );

      // Loads the chat history via an RxJs Observable
      if (this.historyEnabled) {
        this.fetchMessageHistory(newChatWindow);
      }
      // if(!openedWindow.isCollapsed)
      this.dragPosition.unshift(false);
      if (this.centerPositionFlag) {
        this.dragPosition[0] = true;
        this.centerPositionFlag=false;
      }
      this.windows.unshift(newChatWindow);

      // Is there enough space left in the view port ? but should be displayed in mobile if option is enabled
      if (!this.isViewportOnMobileEnabled) {
        if (
          this.windows.length * this.windowSizeFactor >=
          this.viewPortTotalArea -
          (!this.hideFriendsList ? this.friendsListWidth : 0)
        ) {
          this.windows.pop();
          this.dragPosition.pop();
        }
      }

      this.updateWindowsState(this.windows);
      this.windows.forEach(element => {
        if (this.historyMessage[element.participant.id] == undefined) {
          this.historyMessage[element.participant.id] = [];
        }
        element["messages"] = this.historyMessage[element.participant.id];
      });

      if (focusOnNewWindow && !collapseWindow) {
        this.focusOnWindow(newChatWindow);
      }
      let isNewMsg = false;
      if (
        newChatWindow &&
        Object.keys(newChatWindow).length &&
        invokedByUserClick &&
        newChatWindow.messages
      ) {
        const unseenMessages = newChatWindow.messages.filter(m => !m.dateSeen);
        if(unseenMessages.length){
          isNewMsg = unseenMessages[0].dateSeen? false : true;
        }

        this.markMessagesAsRead(unseenMessages, participant);
      }
      if (newChatWindow && (newChatWindow.isCollapsed || isNewMsg)) {
        if(populate)
        this.emitMessageSound(newChatWindow);
      }

      return [newChatWindow, true];
    }
    if (openedWindow && openedWindow.isCollapsed) {
      this.dragPosition[openedIndex] = true;
      this.emitMessageSound(openedWindow);
    }
    if (openedWindow && openedWindow.isCollapsed && invokedByUserClick) {
      // Returns the existing chat window

      openedWindow.isCollapsed = false;
      this.scrollChatWindow(openedWindow, ScrollDirection.Bottom);
      const unseenMessages = openedWindow.messages.filter(m => !m.dateSeen);
      this.markMessagesAsRead(unseenMessages, participant);

      return [openedWindow, false];
    }

  }

  // Focus on the input element of the supplied window
  private focusOnWindow(window: Window, callback: Function = () => { }): void {
    const windowIndex = this.windows.indexOf(window);
    if (windowIndex >= 0) {
      setTimeout(() => {
        if (this.chatWindows) {
          const chatWindowToFocus = this.chatWindows.toArray()[windowIndex];
          if (chatWindowToFocus && chatWindowToFocus.chatWindowInput) {
            chatWindowToFocus.chatWindowInput.nativeElement.focus();
          }
        }

        callback();
      });
    }
  }

  private assertMessageType(message: Message): void {
    // Always fallback to "Text" messages to avoid rendenring issues
    // if (!message.type) {
    //   message.type = MessageType.Text;
    // }
  }

  // Marks all messages provided as read with the current time.
  markMessagesAsRead(messages: Message[], participant: IChatParticipant): void {
    let msgStatusChangeFlag = 0;
    const currentDate = new Date();
    messages.forEach(msg => {
      msg.dateSeen = currentDate;
    });
    if (this.participantsResponse && this.participantsResponse.length) {
      let participantIndex = this.participantsResponse.findIndex(
        v => v.participant.id == participant.id
      );
      if (participantIndex > -1) {
        let participantUnreadCount = this.participantsResponse[participantIndex]
          .participant.totalUnreadCount;
        if (this.participantsResponse[
          participantIndex
        ].participant.totalUnreadCount != 0) {
          msgStatusChangeFlag = 1;
        }
        this.participantsResponse[
          participantIndex
        ].participant.totalUnreadCount = 0;
        let newTotalUnreadMessages = this.participantsResponse[0].metadata.totalUnreadMessages;
        newTotalUnreadMessages -= participantUnreadCount;
        this.participantsResponse.forEach(ele => {
          ele.metadata.totalUnreadMessages = newTotalUnreadMessages;
        });
        this.totalUnreadMessage = this.participantsResponse[0].metadata.totalUnreadMessages;
        let data = {
          sender: participant.id,
          receiver: this.userId,
          participantType: participant.participantType
        };
        if (msgStatusChangeFlag && msgStatusChangeFlag != 0) {
          this.messageService.messageStatusChange(data);
        }
      }
    }
  }

  // Buffers audio file (For component's bootstrapping)
  private bufferAudioFile(): void {
    if (this.audioSource && this.audioSource.length > 0) {
      this.audioFile = new Audio();
      this.audioFile.src = this.audioSource;
      this.audioFile.load();
    }
  }

  // Emits a message notification audio if enabled after every message received
  public emitMessageSound(window: Window): void {
    if (this.audioEnabled && !window.hasFocus && this.audioFile) {
      this.audioFile.play();
    }
  }

  // Emits a browser notification
  private emitBrowserNotification(window: Window, message: Message): void {
    if (this.browserNotificationsBootstrapped && !window.hasFocus && message) {
      const notification = new Notification(
        `${this.localization.browserNotificationTitle} ${window.participant.displayName}`,
        {
          body: message.message,
          icon: this.browserNotificationIconSource
        }
      );
      setTimeout(
        () => {
          notification.close();
        },
        message.message.length <= 50 ? 5000 : 7000
      ); // More time to read longer messages
    }
  }

  // Saves current windows state into local storage if persistence is enabled
  private updateWindowsState(windows: Window[]): void {
    if (this.persistWindowsState) {
      const participantIds = windows.map(w => {
        return w.participant.id;
      });

      localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(participantIds)
      );
    }
  }

  private restoreWindowsState(): void {
    // try {
    //   if (this.persistWindowsState) {
    //     const stringfiedParticipantIds = localStorage.getItem(this.localStorageKey);
    //     if (stringfiedParticipantIds && stringfiedParticipantIds.length > 0) {
    //       const participantIds = <number[]>JSON.parse(stringfiedParticipantIds);
    //       const participantsToRestore = this.participants.filter(u => participantIds.indexOf(u.id) >= 0);
    //       participantsToRestore.forEach((participant) => {
    //         this.openChatWindow(participant);
    //       });
    //     }
    //   }
    // } catch (ex) {
    //   console.error(`An error occurred while restoring ng-chat windows state. Details: ${ex}`);
    // }
  }

  // Gets closest open window if any. Most recent opened has priority (Right)
  private getClosestWindow(window: Window): Window | undefined {
    const index = this.windows.indexOf(window);
    const findIndexPopOut = this.participantIds.findIndex((res) => res.id == window?.participant?.id);
    this.participantIds.splice(findIndexPopOut, 1);

    if (index > 0) {
      return this.windows[index - 1];
    } else if (index == 0 && this.windows.length > 1) {
      return this.windows[index + 1];
    }
  }

  private closeWindow(window: Window): void {
    const index = this.windows.indexOf(window);
    const findIndexPopOut = this.participantIds.findIndex((res) => res.id == window?.participant?.id);
    this.participantIds.splice(findIndexPopOut, 1);

    this.windows.splice(index, 1);
    this.dragPosition.splice(index, 1);
    this.updateWindowsState(this.windows);
  }

  private getChatWindowComponentInstance(
    targetWindow: Window
  ): NgChatWindowComponent | null {
    const windowIndex = this.windows.indexOf(targetWindow);

    if (this.chatWindows) {
      const targetWindow = this.chatWindows.toArray()[windowIndex];

      return targetWindow;
    }

    return null;
  }

  // Scrolls a chat window message flow to the bottom
  public scrollChatWindow(window: Window, direction: ScrollDirection): void {
    const chatWindow = this.getChatWindowComponentInstance(window);
    if (chatWindow) {
      chatWindow.scrollChatWindow(window, direction);
    }
  }

  changeParticipantPosOnMessage(id) {
    let newMessageFromParticipantIndex = this.participants.findIndex(v => v.id == id);
    let newMessageFromParticipantResIndex = this.participantsResponse.findIndex(v => v.participant.id == id);
    if (newMessageFromParticipantIndex > -1) {
      this.insertAndShift(this.participants, newMessageFromParticipantIndex, 0);
      this.insertAndShift(this.participantsResponse, newMessageFromParticipantResIndex, 0);
    }
  }

  onWindowMessagesSeen(messagesSeen: Message[],window): void {
    // this.markMessagesAsRead(messagesSeen,window.participant);
  }

  onWindowChatClosed(payload: {
    closedWindow: Window;
    closedViaEscapeKey: boolean;
  }): void {
    const { closedWindow, closedViaEscapeKey } = payload;

    if (closedViaEscapeKey) {
      const closestWindow = this.getClosestWindow(closedWindow);

      if (closestWindow) {
        this.focusOnWindow(closestWindow, () => {
          this.closeWindow(closedWindow);
        });
      } else {
        this.closeWindow(closedWindow);
      }
    } else {
      this.closeWindow(closedWindow);
    }
  }

  onWindowTabTriggered(payload: {
    triggeringWindow: Window;
    shiftKeyPressed: boolean;
  }): void {
    const { triggeringWindow, shiftKeyPressed } = payload;

    const currentWindowIndex = this.windows.indexOf(triggeringWindow);
    let windowToFocus = this.windows[
      currentWindowIndex + (shiftKeyPressed ? 1 : -1)
    ]; // Goes back on shift + tab

    if (!windowToFocus) {
      // Edge windows, go to start or end
      windowToFocus = this.windows[
        currentWindowIndex > 0 ? 0 : this.chatWindows.length - 1
      ];
    }

    this.focusOnWindow(windowToFocus);
  }

  sendMessage(message): void {

    if (message.message.type == "image") {
      // this.storeImageMessage(message.message);
    } else {
      const data = {
        sender: message.fromId,
        receiver: message.toId,
        text: message.message,
        isGroup: message.isGroup,
        resourceDetails: message.resourceDetails,
        type: "text",
        dateSeen: null,
        replyTo:message.replyTo,
        replyToMessage:message.replyToMessage,
      };
      this.messageService.newMessage(data);

      const internalToChatTabObj1 = {
        sender: message.fromId,
        receiver: message.toId,
        type: this.messageService.getMessageType("text"),
        text: message.message,
        resourceDetails: message.resourceDetails,
        dateSent: new Date(),
        dateSeen: null,
        reply: true
      };
      this.changeParticipantPosOnMessage(message.toId);
      //this.messageService.internalToChatTabObj.next(internalToChatTabObj1);
      //this.storeTextMessage(message);
    }
  }
  storeTextMessage(sendMessage) {
    // const sendMessage = new Message();
    // sendMessage.message = message.text;
    // sendMessage.dateSent = message.createdAt;
    // sendMessage.fromId = message.sender._id;
    // sendMessage.toId = message.receiver;
    // sendMessage.sender = message.sender;
    // sendMessage.type = message.type;
    // sendMessage.isGroup = message.isGroup;
    // sendMessage.id = message._id;
    // console.log("msg",message);
    // sendMessage.subscribers=message.getSubscribers;

    if (this.historyMessage[sendMessage.toId]) {
      this.historyMessage[sendMessage.toId].push(sendMessage);
    }

  }

  onWindowMessageSent(messageSent: Message): void {
    this.sendMessage(messageSent);
  }

  onWindowOptionTriggered(option: IChatOption): void {
    // this.currentActiveOption = option;
  }

  triggerOpenChatWindow(user: User): void {
    if (user) {
      this.openChatWindow(user);
    }
  }

  triggerCloseChatWindow(userId: any): void {
    // const openedWindow = this.windows.find(x => x.participant.id == userId);
    // if (openedWindow) {
    //   this.closeWindow(openedWindow);
    // }
  }

  triggerToggleChatWindowVisibility(userId: any): void {
    // const openedWindow = this.windows.find(x => x.participant.id == userId);
    // if (openedWindow) {
    //   const chatWindow = this.getChatWindowComponentInstance(openedWindow);
    //   if (chatWindow) {
    //     chatWindow.onChatWindowClicked(openedWindow);
    //   }
    // }
  }

  pushSendMessage(message) {
    //   this.onPushSendMessage.emit(message);
  }
  addPeopleClicked(participant) {
    this.addPeopleParticipant = participant.participant;
    this.addPeopleFlag = participant.addPeopleFlag;
  }

  isWindowOpen(value) {
    this.closeExistingWindow = { isWindow: value.isWindow, index: value.index };
    this.mainIndex = value?.index;
    const index = this.participantIds.findIndex((res) => res.id === value.userDetails);
    if (index !== -1) {
      this.participantIds = [...this.participantIds.slice(0, index),
        { ...this.participantIds[index], open: true, index: value.index, isWindow: value.isWindow },
        ...this.participantIds.slice(index + 1)];
    }
  }

  windowOpenClose(userId) {
    const removeItem = this.participantIds.find((res) => res.id === userId);
    return !!removeItem?.open && !!removeItem.isWindow;
  }
}
