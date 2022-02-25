import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';


import { Localization } from "../../core/localization";
import { IChatOption } from "../../core/chat-option";
import { ChatParticipantStatus } from "../../core/chat-participant-status.enum";
import { IChatParticipant } from "../../core/chat-participant";
import { User } from "../../core/user";
import { Window } from "../../core/window";
import { ParticipantResponse } from "../../core/participant-response";
import { MessageCounter } from "../../core/message-counter";
import { chatParticipantStatusDescriptor } from "../../core/chat-participant-status-descriptor";
import { TableService } from "@app/shared/services/table.service";
import { MessageService } from "@app/shared/services/message.service";
import { ChatParticipantType } from "../../core/chat-participant-type.enum";
import { SocketService } from "../../../../shared/services/socket.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AddPeopleComponent } from "../add-people/add-people.component";
import { NbDialogService, NbToastrService, NbIconConfig, NbIconLibraries } from "@nebular/theme";
import * as _ from "lodash";
@Component({
  selector: "ng-chat-friends-list",
  templateUrl: "./ng-chat-friends-list.component.html",
  styleUrls: ["./ng-chat-friends-list.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class NgChatFriendsListComponent implements OnChanges, AfterViewChecked {
  users: string[] = [];
  usersWithIds = [];
  groupName = "";
  allUsers = false;
  userIconConfig: NbIconConfig = { icon: "smartphone-outline", pack: "eva" };
  allUsersIconConfig: NbIconConfig = {icon: "all-users", pack:"chat-users"};
  allUserList: IChatParticipant[] = [];
  currentUser:IChatParticipant;
  constructor(
    protected iconLibraries: NbIconLibraries,
    private tableService: TableService,
    private socketService: SocketService,
    private toasterService: NbToastrService,
    private messageService: MessageService,
    private dialogService: NbDialogService
  ) {
    
    this.allowClickFlag = false;
    this.iconLibraries.registerSvgPack('chat-users', {
      'all-users': '<svg xmlns="../../../../../assets/images/address" width="50%" height="50%" viewBox="0 0 24 24"> ... </svg>'});
    this.tableService.$users.subscribe(res => {
      if (res.length) {
        this.allUserList = res.map((v: any) => {
          return {
            id: v._id,
            status: this.messageService.getStatus(v.status),
            participantType: ChatParticipantType.User,
            displayName: v.firstName + " " + v.lastName,
            avatar: null,
            email: v.email,
            userColor: v.userColor
          };
        });
        res.forEach((usr: any) => {
          this.users.push(usr.firstName + " " + usr.lastName);
          this.usersWithIds = res;
        });
      }
    });
  }

  @Input() totalUnreadMessage;

  @Input()
  public participants: IChatParticipant[];

  @Input()
  public participantsResponse: ParticipantResponse[];

  @Input()
  public participantsInteractedWith: IChatParticipant[] = [];

  @Input()
  public windows: Window[];

  @Input()
  public allowClickFlag:boolean = false;

  @Input()
  public userId: any;

  @Input()
  public localization: Localization;

  @Input()
  public shouldDisplay: boolean;

  @Input()
  public isCollapsed: boolean;

  @Input()
  public searchEnabled: boolean;

  userGroupFlag: number = 0;

  @Input()
  public currentActiveOption: IChatOption | null;

  @Output()
  public onParticipantClicked: EventEmitter<
    IChatParticipant
  > = new EventEmitter();

  @Output()
  public onOptionPromptCanceled: EventEmitter<any> = new EventEmitter();

  @Output()
  public onOptionPromptConfirmed: EventEmitter<any> = new EventEmitter();

  public selectedUsersFromFriendsList: User[] = [];

  public searchInput: string = "";

  public selectedUsers: User[] = [];
  @Input()
  enableSound;

  @Input()
  addPeopleFromParticipant: IChatParticipant;

  @Input()
  addPeopleFromFlag: boolean;

  @Output() onChangeSoundOption: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();

  toShowOption = false;
  muteSound;
  showUnreadStatus = false;
  setActiveAllTab = false;
  setPrivateTabActive = true;
  setGroupTabActive = false;
  // Exposes enums and functions for the ng-template
  public ChatParticipantStatus = ChatParticipantStatus;
  public chatParticipantStatusDescriptor = chatParticipantStatusDescriptor;

  ngOnChanges(changes: SimpleChanges) {
    
    this.allowClickFlag = this.allowClickFlag;
    if (localStorage.getItem('userData')) {
      const userData = JSON.parse(localStorage.getItem('userData'));
      let obj = {
            id: this.userId,
            status: this.messageService.getStatus(userData.status),
            participantType: ChatParticipantType.User,
            displayName: userData.firstName + " " + userData.lastName,
            userColor: userData.userColor,
            avatar: null,
            email: userData.email
      };
      this.currentUser = {...obj};
    }
    if (this.addPeopleFromFlag) {
      this.setActiveAllTab = true;
      this.setPrivateTabActive = false;
      this.setGroupTabActive = false;
      this.userGroupFlag = 2;
      this.selectedUsers.push(this.currentUser);
      this.selectedUsers.push(this.addPeopleFromParticipant);
    }
    // if (this.currentActiveOption) {
    //   const currentOptionTriggeredBy = this.currentActiveOption && this.currentActiveOption.chattingTo.participant.id;
    //   const isActivatedUserInSelectedList = (this.selectedUsersFromFriendsList.filter(item => item.id == currentOptionTriggeredBy)).length > 0;

    //   if (!isActivatedUserInSelectedList) {
    //     this.selectedUsersFromFriendsList = this.selectedUsersFromFriendsList.concat(this.currentActiveOption.chattingTo.participant as User);
    //   }
    // }
  }

  ngAfterViewChecked() {
    this.muteSound = !this.enableSound;
    
  }

  changeSound() {
    this.onChangeSoundOption.emit(!this.muteSound);
  }

  showOptions(toShow: boolean) {
    this.toShowOption = toShow ? true : false;
  }

  get allFilteredUserList(): IChatParticipant[] {
    if (this.searchInput.length > 0) {
      // Searches in the friend list by the inputted search string
      if (this.allUserList) {
        return this.allUserList.filter(
          x =>
            x.displayName
              .toUpperCase()
              .includes(this.searchInput.toUpperCase()) ||
            (x.email &&
              x.email.toLowerCase().includes(this.searchInput.toLowerCase()))
        );
      }
    }
    // console.log('allUserList',this.allUserList)
    return this.allUserList;
  }

  get filteredParticipants(): IChatParticipant[] {
    if (this.searchInput.length > 0) {
      // Searches in the friend list by the inputted search string
      if (this.participants) {
        return this.participants.filter(
          x =>
            x.displayName
              .toUpperCase()
              .includes(this.searchInput.toUpperCase()) ||
            x.email.toLowerCase().includes(this.searchInput.toLowerCase())
        );
      }
    }
    return this.participants;
  }

  onUserSearch() {
    if (this.filteredParticipants && !this.filteredParticipants.length) {
      const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      // if (regularExpression.test(String(this.searchInput).toLowerCase())) {

      this.usersWithIds.forEach(element => {
        if (
          (element &&
            (element.email && element.email.includes(this.searchInput))) ||
          (element.lastName && element.lastName.includes(this.searchInput)) ||
          (element.firstName && element.firstName.includes(this.searchInput))
        ) {
          if (
            !this.participants.filter(x => x.id == element._id).length &&
            element._id != this.userId
          ) {
            let participantCopy = this.participants;
            const user: IChatParticipant = {
              id: element._id,
              status: this.messageService.getStatus(element.status),
              participantType: ChatParticipantType.User,
              displayName: element.firstName + " " + element.lastName,
              userColor: element.userColor,
              avatar: null,
              email: element.email
              // totalUnreadCount:element.totalUnreadCount
            };
            participantCopy.push(user);

            this.messageService.participantEmitter.emit({
              participantList: participantCopy,
              newParticipantOnSearchFlag: true
            });
          }
        }
      });
      return this.participants.filter(x =>
        x.email.toLowerCase().includes(this.searchInput.toLowerCase())
      );

      // }
    }
  }

  isUserSelectedFromFriendsList(user: User): boolean {
    return;
  }

  markAsReadForResource() {
    // this.messageService.chatSeenForResource.subscribe(res => {
    //   if (res) {
    //     const participant = this.participants.find(x => x.id == res);
    //     let unreadMessage;
    //     if (participant) {
    //       unreadMessage = this.unreadMessagesTotalByParticipant(participant);
    //     }
    //     if (unreadMessage) {
    //       let counter = 0;

    //       this.messageService.totalUnreadMessage.subscribe((data) => {
    //         if (counter == 0 && data > unreadMessage) {
    //           counter++;
    //           this.messageService.totalUnreadMessage.next(data - unreadMessage);
    //         }
    //       });
    //       let openedWindow = this.windows.find(x => x.participant.id == participant.id);
    //       if (openedWindow) {
    //         openedWindow.messages.forEach(res => {
    //           res.dateSeen = new Date();
    //         })
    //       } else {
    //         this.participantsResponse.find(x => x.participant.id == res).metadata.totalUnreadMessages = 0;
    //       }
    //       const data = {
    //         sender: res,
    //         receiver: this.userId,
    //         participantType: 1
    //       };
    //     // this.socketService.emit("message_status_change", data);
    // this.messageService.messageStatusChange(data);

    //     }
    //   }
    // });
    return;
  }

  unreadMessagesTotalByParticipant(participant: IChatParticipant): string {
    this.totalUnreadMessage = this.participantsResponse[0].metadata.totalUnreadMessages;
    return String(participant.totalUnreadCount);

    // let openedWindow = this.windows.find(x => x.participant.id == participant.id);

    // if (openedWindow) {
    //   return MessageCounter.unreadMessagesTotal(openedWindow, this.userId);
    // }
    // else {
    //   let totalUnreadMessages = this.participantsResponse
    //     .filter(x => x.participant.id == participant.id && !this.participantsInteractedWith.find(u => u.id == participant.id) && x.metadata && x.metadata.totalUnreadMessages > 0)
    //     .map((participantResponse) => {
    //       return participantResponse.metadata.totalUnreadMessages
    //     })[0];

    //   return MessageCounter.formatUnreadMessagesTotal(totalUnreadMessages);
    // }
  }

  cleanUpUserSelection = () => (this.selectedUsersFromFriendsList = []);

  // Toggle friends list visibility
  onChatTitleClicked(): void {
    // this.showUnreadStatus = false;
    this.isCollapsed = !this.isCollapsed;
  }

  setUnreadStatus(): void {}

  onFriendsListCheckboxChange(selectedUser: User, isChecked: boolean): void {
    // if (isChecked) {
    //   this.selectedUsersFromFriendsList.push(selectedUser);
    // } else {
    //   this.selectedUsersFromFriendsList.splice(this.selectedUsersFromFriendsList.indexOf(selectedUser), 1);
    // }
  }

  onUserClick(clickedUser: User): void {
    this.onParticipantClicked.emit(clickedUser);
  }

  onFriendsListActionCancelClicked(): void {
    this.onOptionPromptCanceled.emit();
    this.selectedUsers = [];
  }

  onFriendsListActionConfirmClicked(): void {
    this.selectedUsers = _.uniqBy(this.selectedUsers,'id');
    if (this.selectedUsers && this.selectedUsers.length > 1) {
      this.checkIfGroupExists();
    } else {
      this.toasterService.warning("Group should have more than one user");
    }

    //   this.onOptionPromptConfirmed.emit(this.selectedUsersFromFriendsList);
    //   this.cleanUpUserSelection();
  }

  ontabChanged(event) {
    if (event.tabTitle === "Private") {
      this.userGroupFlag = 0;
    } else if (event.tabTitle === "Group") {
      this.userGroupFlag = 1;
    } else {
      this.userGroupFlag = 2;
    }
  }
  onCheckboxChange(selectedUser: User, isChecked: boolean) {
    if (isChecked) {
      this.selectedUsers.push(selectedUser);
    } else {
      this.selectedUsers.splice(this.selectedUsers.indexOf(selectedUser), 1);
    }
  }

  checkIfGroupExists() {

    let groupExists = false;

    if (this.participants && this.participants.length) {
    let groupList = this.participants.filter(v => v.participantType);
    const subscribers = {subscribers : this.selectedUsers.map(user => user.id)};

    this.messageService.groupExists(subscribers).subscribe( (res:any) => {
      if(res.data){
        groupExists = res.data;
        let el = groupList.find(v => v.id == res.data);
        this.onUserClick(el);
        this.onFriendsListActionCancelClicked();
      }else{
        this.createGroup();
      }
    })
    }
  }

  createGroup() {

    this.groupName = "";
    this.selectedUsers.forEach((ele, index) => {
      if (ele.displayName) {
        if (!index) {
          this.groupName = ele.displayName;
        } else {
          this.groupName = this.groupName + " , " + ele.displayName;
        }
      }
    });

    let group = {
      name: this.groupName,
      subscribers: this.selectedUsers.map(v => v.id)
    };
    // this.toasterService.success("group created", 'Success');
    this.messageService.createGroup(group).subscribe((res: any) => {
      if (res) {
        this.onOptionPromptCanceled.emit();
        this.selectedUsers = [];
        this.toasterService.success(res.message, "Success");
        //this.loading = false;
      } else {
        //this.loading = false;
        this.toasterService.danger(res.message, "Error");
      }
    });
  }
}
