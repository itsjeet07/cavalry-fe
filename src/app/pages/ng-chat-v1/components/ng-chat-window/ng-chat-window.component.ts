import { Router } from "@angular/router";
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  HostListener,
  AfterViewInit,
  ChangeDetectorRef,
  OnInit,
  ViewChildren,
  QueryList,
} from "@angular/core";

import { Message } from "../../core/message";
import { MessageType } from "../../core/message-type.enum";
import { Window } from "../../core/window";
import { ChatParticipantStatus } from "../../core/chat-participant-status.enum";
import { ScrollDirection } from "../../core/scroll-direction.enum";
import { Localization } from "../../core/localization";
import { IFileUploadAdapter } from "../../core/file-upload-adapter";
import { IChatOption } from "../../core/chat-option";
import { Group } from "../../core/group";
import { ChatParticipantType } from "../../core/chat-participant-type.enum";
import { IChatParticipant } from "../../core/chat-participant";
import { MessageCounter } from "../../core/message-counter";
import { chatParticipantStatusDescriptor } from "../../core/chat-participant-status-descriptor";
import { ParticipantResponse } from "../../core/participant-response";
import { MessageService } from "@app/shared/services/message.service";
import { SocketService } from "@app/shared/services/socket.service";
import { timeInterval, timeout } from "rxjs/operators";
import { ChatSubscriptionService } from "@app/shared/services/chat-subscription.service";
import { User } from "../../core/user";
import { TableService } from "@app/shared/services/table.service";
import { FilePreviewDialogComponent } from "@shared/components/file-preview-dialog/file-preview-dialog.component";
import { NbDialogService } from "@nebular/theme";
import { AddPeopleComponent } from "../add-people/add-people.component";
import { ConfirmDialogComponent } from "@app/shared/components/confirm-dialog/confirm-dialog.component";
import { DynamicFormDialogComponent } from "@app/shared/components/dynamic-form-dialog/dynamic-form-dialog.component";
import { MessageComponent } from "@app/pages/message/message.component";
import { DatePipe } from "@angular/common";
import { async } from "@angular/core/testing";
import { id } from "date-fns/locale";
import { DynamicFormDialogNewDesignComponent } from "@app/shared/components/dynamic-form-dialog-new-design/dynamic-form-dialog-new-design.component";
import { IChatGroupAdapter } from '@app/pages/ng-chat-v1/core/chat-group-adapter';

@Component({
  selector: "ng-chat-window",
  templateUrl: "./ng-chat-window.component.html",
  styleUrls: ["./ng-chat-window.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class NgChatWindowComponent implements AfterViewInit, OnInit {

  @ViewChildren("list") anchorList: QueryList<ElementRef>;
  @ViewChildren('chatWindow') chatWindows: QueryList<NgChatWindowComponent>;
  totalMessages = 0;
  messageClassOverflow = true;
  oldMessage = "";
  usersWithIds = [];
  users: string[] = [];
  showEmojiPicker = false;
  showQuote: boolean = false;
  replyFlag: boolean = false;
  replyImageFlag = false;
  replyFileFlag = false;
  replyToId;
  replyToMessage;
  replyToSender;
  senderName;
  replyToMsgDate;
  public addPeopleFlag: boolean = false;
  @Input() message: string = "";
  @Input() windowIndex: number = 0;
  @Input() openedWindow: boolean;
  @Output() send = new EventEmitter<{ message: string; files: File[] }>();
  @Output() existinPopClose = new EventEmitter<{ isWindow?: boolean, index?: number, userDetails?: string }>();
  public groupAdapter: IChatGroupAdapter;
  datetrans;

  sets = [
    "native",
    "google",
    "twitter",
    "facebook",
    "emojione",
    "apple",
    "messenger",
  ];
  set = "twitter";
  currentUser = null;
  isOpenPopOutWindow: boolean = false;
  popInEnable: boolean = false;
  constructor(
    private messageService: MessageService,
    private dialogService: NbDialogService,
    private cdr: ChangeDetectorRef,
    private socketService: SocketService,
    private chatSubscriptionService: ChatSubscriptionService,
    private router: Router,
    private tableService: TableService,
    private datePipe: DatePipe
  ) {

    this.currentUser = JSON.parse(localStorage.getItem("userData"));
    this.tableService.$users.subscribe((res) => {
      if (res.length) {
        res.forEach((usr: any) => {
          this.users.push(usr.firstName + " " + usr.lastName);
          this.usersWithIds = res;
        });
      }
    });

    this.messageService.removeMessageEmitter.subscribe(async (res) => {
      if (res) {
        let idx = this.window.messages.findIndex((x) => x.id == res);
        if (idx > -1) {
          this.window.messages.splice(idx, 1);
          this.cdr.detectChanges();
        }

      }
    });

    // this.messageService.setIdAtSenderSideEmitter.subscribe(async res =>{
    //   if(res){
    //     let msg = this.window.messages[this.window.messages.length - 1];
    //     let dp = this.datePipe.transform(msg.dateSent, 'yyyy-mm-dd');
    //     let dp1 = this.datePipe.transform(res.createdAt, 'yyyy-mm-dd');
    //     if(dp == dp1 && !msg.sender && msg.toId == res.receiver && !msg.id){
    //       msg.id = res._id;
    //       //msg.sender = res.sender;
    //     }
    //   }
    // })

    // this.socketService.listen('new_message_received').subscribe((res: any) => {
    //   if (res.isGroup && res.isGroup != 'false') {
    //   } else {
    //      if (res.sender._id === this.userId && res.text === this.window.messages[this.window.messages.length - 1].message) {

    //       this.window.messages[this.window.messages.length - 1].id = res._id;
    //       this.window.messages = [...this.window.messages];
    //     }
    //   }
    // });
  }


  ngOnInit() {
    this.window.messages.forEach(ele => {
      if (ele.replyTo && (ele.replyTo.type == 'image' || ele.replyTo.type == 'file')) {
        let ext = ele.replyTo.text.split('.').pop();
        if (ext == "jpg" || ext == "jpeg" || ext == "png") {

        }
        else {
          ele.replyTo.type = "file";
        }
      }
    });
  }
  ngAfterViewInit() {
    if (this.window.messages && this.window.messages.length) {
      this.totalMessages = this.window.messages[0].totalMessages;
      if (this.window.messages.length > 5) {
        const othermsg = this.window.messages.splice(
          0,
          this.window.messages.length - 5
        );
        setTimeout(() => {
          othermsg.reverse().forEach((e) => {
            this.window.messages.unshift(e);
          });
        }, 1000);
      }
    }
    this.scrollChatWindow(this.window, ScrollDirection.Bottom);
    this.chatWindowInput.nativeElement.focus();
  }

  @HostListener("wheel", ["$event"])
  handleWheelEvent(event) {
    if (this.isLoading) {
      event.preventDefault();
    }
  }

  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (
      event.key == "Escape" &&
      this.myDiv &&
      this.myDiv.nativeElement.style.display == "block"
    ) {
      this.myDiv.nativeElement.style.display = "none";
    }
  }

  @HostListener("document:click")
  clicked() {
    this.showEmojiPicker = false;
  }

  @Input()
  public participantsResponse: ParticipantResponse[];

  // @Input()
  // public fileUploadAdapter: IFileUploadAdapter;

  @Input()
  public window: Window;

  droppedFiles: any[] = [];

  @Input()
  public userId: any;

  @Input()
  public localization: Localization;

  @Input()
  public showOptions: boolean;

  @Input()
  public emojisEnabled: boolean = true;

  @Input()
  public linkfyEnabled: boolean = true;

  @Input()
  public showMessageDate: boolean = true;

  @Input()
  public messageDatePipeFormat: string = "short";

  @Input()
  public hasPagedHistory: boolean = true;

  @Output()
  public onChatWindowClosed: EventEmitter<{
    closedWindow: Window;
    closedViaEscapeKey: boolean;
  }> = new EventEmitter();

  @Output()
  public onMessagesSeen: EventEmitter<Message[]> = new EventEmitter();

  @Output()
  public onMessageSent: EventEmitter<Message> = new EventEmitter();

  @Output()
  public onTabTriggered: EventEmitter<{
    triggeringWindow: Window;
    shiftKeyPressed: boolean;
  }> = new EventEmitter();

  @Output()
  public onOptionTriggered: EventEmitter<IChatOption> = new EventEmitter();

  @Output()
  public onLoadHistoryTriggered: EventEmitter<Window> = new EventEmitter();

  @Output()
  public onWindowClicked: EventEmitter<IChatParticipant> = new EventEmitter();

  @Output()
  public onImageMessageSent: EventEmitter<Window> = new EventEmitter();

  @Output()
  onParticipantListUpdate: EventEmitter<any> = new EventEmitter();

  @Output()
  public onAddPeople: EventEmitter<{
    participant: IChatParticipant;
    addPeopleFlag: boolean;
  }> = new EventEmitter();

  @ViewChild("chatMessages") chatMessages: any;
  @ViewChild("nativeFileInput") nativeFileInput: ElementRef;
  @ViewChild("nativeImageInput") nativeImageInput: ElementRef;
  @ViewChild("chatWindowInput") chatWindowInput: any;

  // custom
  isLoading = false;
  totalUnreadMsg = "";
  @Output()
  public onPushSendMessage: EventEmitter<Message> = new EventEmitter();

  // File upload state
  public fileUploadersInUse: string[] = []; // Id bucket of uploaders in use

  // Exposes enums and functions for the ng-template
  public ChatParticipantType = ChatParticipantType;
  public ChatParticipantStatus = ChatParticipantStatus;
  public MessageType = MessageType;
  public chatParticipantStatusDescriptor = chatParticipantStatusDescriptor;

  // Zoom vars

  @ViewChild("myDiv") myDiv: ElementRef;
  @ViewChild("myModalImage") myModalImage: ElementRef;
  @ViewChild("myCaption") myCaption: ElementRef;
  @ViewChild("mySpan") mySpan: ElementRef;
  @ViewChild("imgRenderer") imgRenderer: ElementRef;
  copiedFile: File;
  fileUploading = false;
  isDragged = false;
  // clearTime;
  // zoomImage(image) {
  //   this.myDiv.nativeElement.style.display = 'block';
  //   this.myModalImage.nativeElement.src = image;
  //   this.myCaption.nativeElement.innerHTML = 'Image';
  //   this.myCaption.nativeElement.parentElement
  //     .parentElement
  //     .parentElement
  //     .parentElement
  //     .parentElement
  //     .parentElement
  //     .parentElement
  //     .classList.add('modal_clicked');
  // }

  onFilePreview(filename, item) {
    const fileDialog = this.dialogService.open(FilePreviewDialogComponent, {
      context: {
        Data: filename,
        Ext: filename.split(".").pop(),
      },
    });

    fileDialog.componentRef.instance.saveTo.subscribe((data: any) => {
      this.tableService.getTableByName("Files").subscribe((tableres: any) => {
        const tempParentTableHeader = Object.assign(
          [],
          tableres.data[0].columns
        );
        const fileType = tableres.data[0].columns.find(
          ({ type }) => type === "file"
        );
        let type = "file";
        if (fileType && fileType.name) {
          type = fileType.name;
        }
        const res = {
          data: {
            relatedTo: data,
            lookup: [],
            [type]: [],
          },
        };
        res.data[type].push(item.message);
        const ref = this.dialogService
          .open(DynamicFormDialogNewDesignComponent, {
            closeOnEsc: false,
            context: {
              title: "Add New File",
              //headerDetail: this.headerObj,
              isForceSave: true,
              subFormLookupIds: "",
              form: tempParentTableHeader,
              button: { text: "Save" },
              tableName: "Files",
              Data: res.data,
              recordType: null,
              recordTypeFieldName: null,
              action: "Add",
              // mainTableData: [],
              tableRecordTypes: [],
            },
          })
          .onClose.subscribe((name) => { });
      });
    });
  }

  closeImageModal() {
    this.myDiv.nativeElement.style.display = "none";
  }

  chatBoxClicked() {
    const unreadMessages = this.window.messages.filter(
      (message) =>
        message.dateSeen == null &&
        (message.toId == this.userId ||
          this.window.participant.participantType === ChatParticipantType.Group)
    );

    if (unreadMessages && unreadMessages.length > 0) {
      // this.onMessagesSeen.emit(unreadMessages);
    }
  }
  sendMessage(newMessage) {
    let tempMessage;
    if (this.checkIfMention(newMessage)) {
      this.count;
      if (this.droppedFiles.length || String(newMessage).trim().length) {
        if (String(newMessage).trim().length) {
          tempMessage = newMessage;
          return tempMessage;
        } else {
          return newMessage;
        }

        // this.send.emit({ message: newMessage, files: this.droppedFiles });

        // this.droppedFiles = [];
      }
    }
  }

  addClassToMention(message) {
    let newSubscriberAdded = false;
    this.usersWithIds.forEach((user) => {
      let userName = "@" + user.firstName + " " + user.lastName;
      if (message.indexOf(userName) > -1) {
        message = message.replace(
          userName,
          `<span class="mention ${user._id}" [id]="${user._id}" >${userName}</span>`
        );
        this.activateSubscription(user._id);
        newSubscriberAdded = true;
      }
    });
    this.message = message;
    if (newSubscriberAdded) {
      this.onViewPeopleClicked(this.window);
    }

    return message;
  }

  checkIfMention(message) {
    if (message.includes("@")) {
      return true;
    } else {
      this.count = 2;
      return false;
    }
  }
  draggedFiles(files) {
    const file = files[0];
    this.copiedFile = file;
    if (this.isImageFile(file)) {
      this.renderImage(file);
    } else {
      this.imgRenderer.nativeElement.src = "assets/images/file-img.png";
    }
    this.isDragged = false;
    var element = document.getElementById("drag-image-div");
    if (element) {
      element.classList.remove("drag-drop-msg");
    }
  }

  getFileName(fileUrl) {
    if (fileUrl) {
      return fileUrl
        .substring(fileUrl.lastIndexOf("/") + 1)
        .replace(/[0-9]/g, "");
    } else {
      return fileUrl;
    }
  }

  onOptionClicked(currentWindow: Window) {
    this.addPeopleFlag = true;
    if (currentWindow.participant.participantType == ChatParticipantType.User) {
      let participant = currentWindow.participant;
      this.onAddPeople.emit({
        participant: participant,
        addPeopleFlag: this.addPeopleFlag,
      });
    }
  }
  onViewPeopleClicked(window) {
    if (window.participant.resourceTableName == "") {
      this.messageService
        .getSubscribers(window.participant.id)
        .subscribe((res) => {
          let groupUsers = res["data"].subscribers;
          this.dialogService
            .open(AddPeopleComponent, {
              context: {
                selectedUsers: groupUsers,
                edittextFlag: false,
                saveButtonFlage: false,
                groupName: window.participant.displayName,
                tableInfo: {
                  resourceId: window.participant.id,
                  tableName: window.participant.resourceTableName,
                },
              },
            })
            .onClose.subscribe((res) => {
              if (res) {
              }
            });
        });
    } else {
      this.chatSubscriptionService
        .getSubscribers(window.participant.id)
        .subscribe((res) => {
          let groupUsers = res["data"];
          this.dialogService
            .open(AddPeopleComponent, {
              context: {
                selectedUsers: groupUsers,
                edittextFlag: false,
                saveButtonFlage: false,
                groupName: window.participant.displayName,
                tableInfo: {
                  resourceId: window.participant.id,
                  tableName: window.participant.resourceTableName,
                },
              },
            })
            .onClose.subscribe((res) => {
              if (res) {
              }
            });
        });
    }
  }
  checkImage(name) {
    if (name) {
      const extension = name.split(".").pop();
      if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
        return true;
      }
    }
    return false;
  }

  onFileDragged(dragged) {
    if (dragged) {
      this.isDragged = true;
      var element = document.getElementById("drag-image-div");
      if (element) {
        element.classList.add("drag-drop-msg");
      }
    } else {
      this.isDragged = false;
    }
  }

  sendImage() {
    if (this.copiedFile) {
      this.uploadFiles(this.copiedFile);
      this.copiedFile = null;
    }
  }

  // custom function for uploading files in case of dragged or copied
  uploadFiles(file) {
    let data;
    const part = this.window.participant;

    if (this.fileFlag) {
      if (this.window.participant.participantType == 1) {
        data = {
          receiver: part.id,
          type: "file",
          sender: this.userId,
          file: file,
          isGroup: true,
          resourceDetails: {
            resourceId: part.id,
            tableId: part.parentTableId,
            tableName: part.resourceTableName,
            resourceName: part.displayName,
          }
        };
      } else {
        data = {
          receiver: this.window.participant.id,
          type: "file",
          sender: this.userId,
          file: file,
          isGroup: false,
        };
      }

      this.fileUploading = true;

      this.messageService.uploadChatImages(data).subscribe((res: any) => {
        if (res.message) {
          const data = res.message;
          const sendMessage = new Message();
          sendMessage.message = data.text;
          sendMessage.dateSent = new Date();
          sendMessage.fromId = data.sender;
          sendMessage.toId = data.receiver;
          sendMessage.type = MessageType.File;
          sendMessage.dateSeen = data.dateSeen;
          sendMessage.isGroup = false;
          sendMessage.id = res.message._id ? res.message._id : (res.message.id ? res.message.id : '');
          if (this.window.participant.participantType == 1) {
            const part = this.window.participant;
            sendMessage.isGroup = true;
            sendMessage.sender = JSON.parse(localStorage.getItem("userData"));
            sendMessage.resourceDetails = {
              resourceId: part.id,
              tableId: part.parentTableId,
              tableName: part.resourceTableName,
              resourceName: part.displayName,
            };
          }
          this.fileUploading = false;
          if (!sendMessage.isGroup) {
            //this.window.messages.push(sendMessage);

            this.onParticipantListUpdate.emit(sendMessage.toId);
          }
          if (sendMessage.isGroup) {


            const emitMessage = {
              sender: this.userId,
              receiver: part.id,
              type: "file",
              resourceDetails: part,
              dateSent: new Date(),
              dateSeen: null,
              reply: true,
              text: res.message.text,
              id: res.message._id ? res.message._id : (res.message.id ? res.message.id : '')
            };
            const shouldSave = "no";
            this.chatSubscriptionService.sendMessage(
              emitMessage,
              part,
              shouldSave
            );

            this.messageService.imageToInternalChatObj.emit({
              file: file,
              resource: sendMessage.resourceDetails,
              id: sendMessage.id,
              src: res.message.text
            });

            // this.window.messages.push(sendMessage)
            this.onParticipantListUpdate.emit(
              sendMessage.resourceDetails.resourceId
            );
          }

          this.scrollChatWindow(this.window, ScrollDirection.Bottom);
        }
      });
    }
    else {
      if (this.window.participant.participantType == 1) {
        data = {
          receiver: part.id,
          type: "image",
          sender: this.userId,
          file: file,
          isGroup: true,
          resourceDetails: {
            resourceId: part.id,
            tableId: part.parentTableId,
            tableName: part.resourceTableName,
            resourceName: part.displayName,
          }
        };
      } else {
        data = {
          receiver: this.window.participant.id,
          type: "image",
          sender: this.userId,
          file: file,
          isGroup: false,
        };
      }
      this.fileUploading = true;

      this.messageService.uploadChatImages(data).subscribe((res: any) => {
        if (res.message) {
          const data = res.message;
          const sendMessage = new Message();
          sendMessage.message = data.text;
          sendMessage.dateSent = new Date();
          sendMessage.fromId = data.sender;
          sendMessage.toId = data.receiver;
          sendMessage.type = MessageType.Image;
          sendMessage.dateSeen = data.dateSeen;
          sendMessage.isGroup = false;
          sendMessage.id = res.message._id ? res.message._id : (res.message.id ? res.message.id : '');
          if (this.window.participant.participantType == 1) {
            const part = this.window.participant;
            sendMessage.isGroup = true;
            sendMessage.sender = JSON.parse(localStorage.getItem("userData"));
            sendMessage.resourceDetails = {
              resourceId: part.id,
              tableId: part.parentTableId,
              tableName: part.resourceTableName,
              resourceName: part.displayName,
            };
          }
          this.fileUploading = false;
          if (!sendMessage.isGroup) {
            //this.window.messages.push(sendMessage);

            this.onParticipantListUpdate.emit(sendMessage.toId);
          }
          if (sendMessage.isGroup) {


            const emitMessage = {
              sender: this.userId,
              receiver: part.id,
              type: "image",
              resourceDetails: part,
              dateSent: new Date(),
              dateSeen: null,
              reply: true,
              text: res.message.text,
              id: res.message._id ? res.message._id : (res.message.id ? res.message.id : '')
            };
            const shouldSave = "no";
            this.chatSubscriptionService.sendMessage(
              emitMessage,
              part,
              shouldSave
            );

            this.messageService.imageToInternalChatObj.emit({
              file: file,
              resource: sendMessage.resourceDetails,
              id: sendMessage.id,
              src: res.message.text
            });

            // this.window.messages.push(sendMessage)
            this.onParticipantListUpdate.emit(
              sendMessage.resourceDetails.resourceId
            );
          }

          this.scrollChatWindow(this.window, ScrollDirection.Bottom);
        }
      });
    }


  }

  defaultWindowOptions(currentWindow: Window): IChatOption[] {
    // if (this.showOptions && currentWindow.participant.participantType == ChatParticipantType.User) {
    //   return [{
    //     isActive: false,
    //     chattingTo: currentWindow,
    //     validateContext: (participant: IChatParticipant) => {
    //       return participant.participantType == ChatParticipantType.User;
    //     },
    //     displayLabel: 'Add People', // TODO: Localize this
    //   }];
    // }
    return [];
  }

  // Asserts if a user avatar is visible in a chat cluster
  isAvatarVisible(window: Window, message: Message, index: number): boolean {
    if (message.fromId != this.userId) {
      if (index == 0) {
        return true; // First message, good to show the thumbnail
      } else {
        // Check if the previous message belongs to the same user,
        // if it belongs there is no need to show the avatar again to form the message cluster
        if (
          window.messages[index - 1] &&
          window.messages[index - 1].fromId != message.fromId
        ) {
          return true;
        }
      }
    }
    return false;
  }

  getChatWindowAvatar(
    participant: IChatParticipant,
    message: Message
  ): string | null {
    if (participant.participantType == ChatParticipantType.User) {
      return participant.avatar;
    } else if (
      participant.participantType == ChatParticipantType.Group &&
      this.window &&
      this.window.messages &&
      this.window.messages.length &&
      this.window.messages[0].subscribers
    ) {
      const group = new Group(this.window.messages[0].subscribers);

      const userIndex = group.chattingTo.findIndex(
        (x) => x.id == message.fromId
      );

      return group.chattingTo[userIndex >= 0 ? userIndex : 0].avatar;
    }

    //   const participantOfTypeUser=new User();
    // participantOfTypeUser.avatar=participant.avatar;
    // participantOfTypeUser.displayName=participant.displayName;
    // participantOfTypeUser.id=participant.id;
    // participantOfTypeUser.status=participant.status;
    return null;
  }

  isUploadingFile(window: Window): boolean {
    // const fileUploadInstanceId = this.getUniqueFileUploadInstanceId(window);
    // return this.fileUploadersInUse.indexOf(fileUploadInstanceId) > -1;
    return;
  }

  // pasteEventss(event: ClipboardEvent) {
  //   const pastedImage = this.getPastedImage(event);
  // }

  removeImageCopied() {
    this.copiedFile = null;
    this.window.newMessage = "";
  }

  pasteEvent(event: any) {
    const items = event.clipboardData.items;
    let blob = null;
    this.window.newMessage = "";

    for (const item of items) {
      if (item.type.indexOf("image") === 0) {
        blob = item.getAsFile();
        this.copiedFile = blob;
      }
    }
    this.renderImage(blob);
    //this.chatWindowInput.nativeElement.value = '';
  }

  renderImage(blob) {
    if (blob !== null) {
      const fileFromBlob: File = new File([blob], new Date().toString());
      const reader = new FileReader();
      reader.onload = (evt: any) => {
        this.imgRenderer.nativeElement.src = evt.target.result;
      };
      reader.readAsDataURL(blob);
    }
    this.scrollChatWindow(this.window, ScrollDirection.Bottom);
  }

  // private getPastedImage(event: ClipboardEvent): File | null {

  //   if (
  //     event.clipboardData &&
  //     event.clipboardData.files &&
  //     event.clipboardData.files.length &&
  //     this.isImageFile(event.clipboardData.files[0])) {
  //     return event.clipboardData.files[0];
  //   }
  //   //return null;
  // }

  showSenderName(data) {
    if (typeof data === "object") {
      return true;
    }
    return false;
  }

  private isImageFile(file: File): boolean {
    if (file) {
      return file.type.search(/^image\//i) === 0;
    }
  }

  // Generates a unique file uploader id for each participant
  getUniqueFileUploadInstanceId(window: Window): string {
    // if (window && window.participant) {
    //   return `ng-chat-file-upload-${window.participant.id}`;
    // }
    // return 'ng-chat-file-upload';
    return;
  }

  unreadMessagesTotal(window: Window) {
    // if (!window.isCollapsed) {
    //   this.chatBoxClicked();
    // }
    // const id = this.participantsResponse.find(x => x.participant.id == this.userId);
    // if(id && id.participant && id.participant.totalUnreadCount){
    //     const total = this.messageService.totalUnreadMessage.subscribe( res=>{
    //         let count = 0;
    //         if(count == 0){
    //             count++;
    //             this.messageService.totalUnreadMessage.next(res - id.participant.totalUnreadCount);
    //         }
    //     });
    // }
    // clearTimeout(this.clearTime);
    // this.clearTime = setTimeout(() => {
    //     return MessageCounter.unreadMessagesTotal(window, this.userId);
    // }, 2000);
    // this.window.messages.filter((obj, pos, arr) => {
    //     return arr.map(mapObj => mapObj['id']).indexOf(obj['id']) === pos;
    // });
    // window.messages = [...new Set(window.messages)];

    // window.messages.filter(function(item, pos) {
    //     return window.messages.indexOf(item) == pos;
    // })
    return MessageCounter.unreadMessagesTotal(window, this.userId);
  }

  scrollChatWindow(window: Window, direction: ScrollDirection): void {
    if (!window.isCollapsed) {
      setTimeout(() => {
        if (this.chatMessages) {
          const element = this.chatMessages.nativeElement;
          const position =
            direction === ScrollDirection.Top ? 0 : element.scrollHeight;
          element.scrollTop = position;
        }
      },300);
    }
  }

  activeOptionTrackerChange(option: IChatOption): void {
    this.onOptionTriggered.emit(option);
  }

  // Triggers native file upload for file selection from the user
  triggerNativeFileUpload(window: Window): void {
    if (window) {
      if (this.nativeFileInput) this.nativeFileInput.nativeElement.click();
    }
  }

  triggerNativeImageUpload(window: Window): void {
    if (window) {
      if (this.nativeImageInput) this.nativeImageInput.nativeElement.click();
    }
  }

  markMessagesAsRead(messages: Message[]): void {
    // this.onMessagesSeen.emit(messages);
  }
  toggleWindowFocus(window: Window): void {
    setTimeout(() => {
      this.unreadMessagesTotal(this.window);
    }, 800);
    const data = {
      sender: window.participant.id,
      receiver: this.userId,
      participantType: window.participant.participantType,
    };
    this.socketService.emit('message_status_change', data);
    window.hasFocus = !window.hasFocus;
    if (window.hasFocus) {
      const unreadMessages = window.messages
        .filter(message => message.dateSeen == null
          && (message.toId == this.userId || window.participant.participantType === ChatParticipantType.Group));
      if (unreadMessages && unreadMessages.length > 0) {
        this.onMessagesSeen.emit(unreadMessages);
      }
    }
  }
  fetchMessageHistory(window: Window): void {
    // this.onLoadHistoryTriggered.emit(window);
  }

  onContainerScroll(e, isGroup): void {
    const scrollTop = e.srcElement.scrollTop;
    if (scrollTop == 0 && this.totalMessages != 100) {
      this.isLoading = true;
      this.messageService
        .loadMoreMessages(this.window, isGroup)
        .subscribe((res: any) => {
          if (res.statusCode === 200) {
            if (res.data && res.data.length) {
              this.window.skipMessage += 20;
              res.data.forEach((msg, i) => {
                const message = new Message();
                message.message = msg.text;
                message.dateSent = msg.createdAt;
                message.fromId = msg.sender._id;
                message.sender = msg.sender;
                message.toId = msg.receiver;
                message.replyTo = msg.replyTo;
                message.id = msg._id;
                message.dateSeen = new Date();
                message.type = this.messageService.getMessageType(msg.type);
                this.window.messages.unshift(message);
                if (i == 0) {
                  const element = this.chatMessages.nativeElement;
                  element.scrollTop = 10;
                }
              });
            } else {
              this.totalMessages = 100;
            }
            this.isLoading = false;
            // setTimeout(() => {
            //   this.toggleWindowFocus(this.window);
            // }, 1000);
          }
        });
    }
  }

  // Closes a chat window via the close 'X' button
  onCloseChatWindow(): void {
    this.onChatWindowClosed.emit({
      closedWindow: this.window,
      closedViaEscapeKey: false,
    });
  }

  onCollapseChatWindow() {
    this.window.isCollapsed = true;
  }

  mentionRedirect(msg, event) {
    if (msg.message.includes("<span")) {
      let user_id = msg.message.split('"')[3];
      let user_name = msg.message.split("@")[1].split("<")[0];
      const redirectFromMentionObj = {
        avatar: null,
        displayName: user_name,
        email: "",
        id: user_id,
        participantType: 0,
        status: 3,
        totalUnreadCount: 0,
      };

      this.messageService.redirectionFromMentionObj.next(
        redirectFromMentionObj
      );
    }
    // let urlArray = msg.message.split("/");
    // this.router.navigate(['pages/tables/dynamic/' + urlArray[urlArray.length - 3] + '/' + urlArray[urlArray.length - 2] + '/' + urlArray[urlArray.length - 1]]);
  }

  /*  Monitors pressed keys on a chat window
      - Dispatches a message when the ENTER key is pressed
      - Tabs between windows on TAB or SHIFT + TAB
      - Closes the current focused window on ESC
  */
  count = 0;
  onChatInputTyped(event: any, window: Window): void {
    const textArea = this.chatWindowInput.nativeElement;
    textArea.style.height = "0px";
    textArea.style.overflow = "hidden";
    textArea.style.height = textArea.scrollHeight + "px";
    switch (event.keyCode) {
      case 13: {
        if (this.count == 1) {
          this.count++;
        }
        if (!this.count && this.checkIfMention(window.newMessage)) {
          this.count++;
          window.newMessage = this.sendMessage(window.newMessage);
        }

        if (this.count == 2) {
          window.newMessage = this.addClassToMention(window.newMessage);
          if (this.copiedFile) {
            this.uploadFiles(this.copiedFile);
            this.copiedFile = null;
            window.newMessage = ""; // Resets the new message input
          } else if (window.newMessage && window.newMessage.trim() != "") {
            const message = new Message();

            message.fromId = this.userId;
            message.toId = window.participant.id;
            message.message = window.newMessage;
            message.dateSent = new Date();

            if (window.participant.participantType == 1) {
              const part = window.participant;
              message.isGroup = true;
              message.sender = JSON.parse(localStorage.getItem("userData"));
              message.resourceDetails = {
                resourceId: part.id,
                tableId: part.parentTableId,
                tableName: part.resourceTableName,
                resourceName: part.displayName,
              };
              message.fromInternal = true;
            }
            const textArea = this.chatWindowInput.nativeElement;
            textArea.style.overflow = "hidden";
            textArea.style.height = "22px";

            if (this.replyFlag || this.replyImageFlag || this.replyFileFlag) {
              message.replyTo = this.replyToId;
            }

            this.onMessageSent.emit(message);

            window.newMessage = ""; // Resets the new message input
            this.replyFlag = false;
            this.replyImageFlag = false;
            this.replyFileFlag = false;

            this.scrollChatWindow(window, ScrollDirection.Bottom);
            event.preventDefault();
          }
          this.count = 0;
        }
        this.scrollChatWindow(window, ScrollDirection.Bottom);
        if(window.participant.status !== 0) {
          this.offlineFlag = true;
        }
        else {
          this.offlineFlag = false;
        }
        break;
      }
      case 9:
        event.preventDefault();

        this.onTabTriggered.emit({
          triggeringWindow: window,
          shiftKeyPressed: event.shiftKey,
        });

        break;
      case 27:
        this.onChatWindowClosed.emit({
          closedWindow: window,
          closedViaEscapeKey: true,
        });

        break;
    }

  }
offlineFlag:boolean = false;
  // Toggles a chat window visibility between maximized/minimized
  onChatWindowClicked(window: Window): void {
    window.isCollapsed = !window.isCollapsed;
    let windowParticipant = window.participant;
    let participant = {
      participantType: windowParticipant.participantType,
      id: windowParticipant.id,
      displayName: windowParticipant.displayName,
      status: windowParticipant.status,
      avatar: windowParticipant.avatar,
    };

    this.onWindowClicked.emit(participant);
    this.scrollChatWindow(window, ScrollDirection.Bottom);
  }

  private clearInUseFileUploader(fileUploadInstanceId: string): void {
    // const uploaderInstanceIdIndex = this.fileUploadersInUse.indexOf(fileUploadInstanceId);
    // if (uploaderInstanceIdIndex > -1) {
    //   this.fileUploadersInUse.splice(uploaderInstanceIdIndex, 1);
    // }
  }

  fileFlag: boolean = null;
  // Handles file selection and uploads the selected file using the file upload adapter
  onFileChosen(window: Window, userId, isFile = false): void {
    const fileUploadInstanceId = this.getUniqueFileUploadInstanceId(window);

    const uploadElementRef = isFile
      ? this.nativeFileInput
      : this.nativeImageInput;

    if (uploadElementRef) {
      const file: File = uploadElementRef.nativeElement.files[0];
      this.fileUploadersInUse.push(fileUploadInstanceId);
      this.copiedFile = file;
      if (this.isImageFile(file)) {
        this.fileFlag = false;
        this.renderImage(file);
      } else {
        this.fileFlag = true;
        this.imgRenderer.nativeElement.src = "assets/images/file-img.png";
      }
    }
  }

  getChatName(data) {
    if (data.sender && data.sender.firstName) {
      return data.sender.lastName
        ? data.sender.firstName + " " + data.sender.lastName
        : data.sender.firstName;
    }
  }

  redirectToResourcePage(data) {
    const href = this.router.url;
    const urlArray = href.split("/");

    if (data.parentTableId == urlArray[4] && data.id == urlArray[6]) {
      return false;
    }

    this.router.navigate([
      `pages/tables/dynamic/${data.parentTableId}/${data.resourceTableName}/${data.id}`,
    ]);
  }

  toggleEmojiPicker(event) {
    event.stopPropagation();
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  emojiClicked(event) {
    event.stopPropagation();
  }

  insertEmoji(event) {
    this.showEmojiPicker = false;
    const char = event.emoji.native;
    this.window.newMessage += char;
  }

  replyParticularMessage(window, message, id, index) {
    this.replyToId = id;
    this.replyToMessage = message.message;
    this.replyToSender = message.fromId;
    this.senderName = (message.sender.firstName + " " + message.sender.lastName);
    let date;
    if (message.replyTo && message.replyTo.createdAt) {
      date = message.replyTo.createdAt;
    }
    else {
      date = message.dateSent;
    }
    this.datetrans = this.datePipe.transform(date, "M/d/yy, h:mm a");
    this.replyToMsgDate = this.datetrans;
    this.replyFlag = true;
    if (message.type == 3) {
      this.replyFlag = false;
      this.replyFileFlag = false;
      this.replyImageFlag = true;
    }
    else if (message.type == 2) {
      this.replyFileFlag = true;
      this.replyFlag = false;
      this.replyImageFlag = false;
    }
    this.scrollChatWindow(window, ScrollDirection.Bottom);
  }

  deleteMessage(id, index) {
    const dialogData = {
      title: "Are you Sure?",
      text: "Are you sure you want to delete this message?",
    };
    this.dialogService
      .open(ConfirmDialogComponent, { context: dialogData })
      .onClose.subscribe((res: any) => {
        if (res) {
          this.messageService.deleteMessage(id).subscribe((res) => {
            if (res["statusCode"] == 200) {
              let idx = this.window.messages.findIndex((x) => x.id == id);
              if (idx > -1) {
                this.window.messages.splice(idx, 1);
              }
              this.cdr.detectChanges();
            }
          });
        }
      });
  }
  public deleteMsgFromReceiver(id) {
    let idx = this.window.messages.findIndex((x) => x.id == id);
    if (idx > -1) {
      this.window.messages.splice(idx, 1);
    }
    this.cdr.detectChanges();
  }


  scrollToMessage(message, i, obj) {

    if (obj.replyTo && obj.replyTo.isActive) {
      let inter = setInterval(() => {
        let index = this.window.messages.findIndex(v => v.id == message)
        if (index > -1) {

          const elementRef = this.anchorList.find((item, i) => i === index);
          const ele = elementRef.nativeElement;
          ele.scrollIntoView();
          ele.classList.add("highlightedMessage");
          setTimeout(function () {
            ele.classList.remove("highlightedMessage");
          }, 2000)
          clearInterval(inter);
        } else {
          const element = this.chatMessages.nativeElement;
          element.scrollBy(0, -100);
        }

      }, 10)

    }



  }

  activateSubscription(userId) {
    const data = {
      resourceId: this.window.participant.id,
      userId: userId,
      tableName: this.window.participant.resourceTableName,
      invitedBy: this.currentUser._id
    };

    this.chatSubscriptionService.watch(data).subscribe(
      (res: any) => {
        if (res.statusCode === 201) {
          //-- sucess
        } else {

        }
      },
      (error) => {
        console.log('Failed to add watcher', error)
      },
      () => { }
    );
  }

  onParticipantClickedFromWindowList() {}

  onWindowMessagesSeen() {}

  onWindowMessageSent(message) {
    this.onMessageSent.emit(message);
  }

  onWindowTabTriggered() {}

  onWindowChatClosed() {}

  onWindowOptionTriggered() {}

  pushSendMessage() {}

  changeParticipantPosOnMessage() {}

  addPeopleClicked() {}

  isWindowOpen() {
    // this.isOpenPopOutWindow = true;
  }

  popEmitValue(popoutValue, userId) {
    if (popoutValue.popUpClose == false) {
      this.isOpenPopOutWindow = popoutValue.popUpClose;
      this.existinPopClose.emit({ isWindow: popoutValue.popUpClose, index: this.windowIndex, userDetails: userId });
      setTimeout(() => {
        this.scrollChatWindow(this.window, ScrollDirection.Bottom);
      }, 300);
    }
    if (popoutValue.isOpenWindow) {
      this.existinPopClose.emit({ isWindow: popoutValue.isOpenWindow, index: this.windowIndex, userDetails: userId });
    }
  }
}
