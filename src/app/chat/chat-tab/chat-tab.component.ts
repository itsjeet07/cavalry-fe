import { DatePipe } from "@angular/common";
import {
  AfterContentChecked, AfterViewInit,
  ChangeDetectorRef, Component,
  ElementRef,
  EventEmitter, HostListener, Input,
  OnChanges,
  OnInit,
  Output,
  QueryList, Renderer2,
  ViewChild,
  ViewChildren
} from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { Router } from "@angular/router";
import { NbChatComponent } from "@app/chat/chat.component";
import { ConfirmDialogComponent } from "@app/shared/components/confirm-dialog/confirm-dialog.component";
import { TableService } from "@app/shared/services/table.service";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { Subscription } from "rxjs";
import { ShowcaseDialogComponent } from "../../shared/components/showcase-dialog/showcase-dialog.component";
import { ChatSubscriptionService } from "../../shared/services/chat-subscription.service";
import { MessageService } from "../../shared/services/message.service";
import { SocketService } from "../../shared/services/socket.service";

@Component({
  selector: "ngx-chat-tab",
  templateUrl: "chat-tab.component.html",
  styleUrls: ["chat-tab.component.scss"],
})
export class ChatTabComponent
  extends NbChatComponent
  implements AfterViewInit, OnChanges, OnInit, AfterContentChecked {
  messageList: any = [];
  subscribe = "Watch";
  currentUser = null;
  subscribers = [];
  @Input() tableInfo;
  @Input() chatOpened = false;
  @Input() uiColor = "#598bff";
  @Input() viewCallLog;
  @Input() createdRecordDate;
  @Input() recordData;
  @Input() columnData;
  @ViewChildren("list") anchorList: QueryList<ElementRef>;
  @Output() messageCount = new EventEmitter();
  @Output() openreminderModal = new EventEmitter();
  @Output() subscriber = new EventEmitter();
  @Input()  createdBy;
  isWatcherOpened = false;
  oldTableInfo;
  resourceData: any;
  loading = true;
  skipMessage = 20;
  loadMoreHistory = true;
  chatSubscriptions;
  firstTimeLoad = true;
  replyMessage;
  replyName;
  replyDate;
  replyFlag: boolean = false;
  replyImageFlag: boolean = false;
  replyToId;
  replyToMessage;
  subscriptionText = "Start watching the issue";
  isSelfSubscribed = false;
  totalMessages = "";
  loadEmoji = false;
  datetrans;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  fileUploading = false;

  @ViewChild("myDiv") myDiv: ElementRef;
  @ViewChild("myModalImage") myModalImage: ElementRef;
  @ViewChild("myCaption") myCaption: ElementRef;
  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("imageInput") imageInput: ElementRef;
  timeout;

  toggled = false;
  chatHistoryFetched = false;
  @Input() fromTask = false;
  chatSubscription: Subscription;
  userSubscription: Subscription;
  checkMessageArray;
  messageListFlag = false;
  message = "";
  showEmojiPicker = false;
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
  callLogStyle;
  height;
  defaultMessageObj = {
    type: '',
    firstName: "",
    lastName: "",
    text: "",
    date: null,
    recordId: []
  };
  constructor(
    private chatSubscriptionService: ChatSubscriptionService,
    private messageService: MessageService,
    private dialogService: NbDialogService,
    private socketService: SocketService,
    public renderer: Renderer2,
    private toasterService: NbToastrService,
    private cdr: ChangeDetectorRef,
    private route: Router,
    private datePipe: DatePipe,
    private tableService: TableService
  ) {
    super();
    this.currentUser = JSON.parse(localStorage.getItem("userData"));
    this.receiveChat();
  }

  ngOnInit() {
    this.defaultMessageObj.type = "user";
    this.defaultMessageObj.firstName = this.currentUser.firstName;
    this.defaultMessageObj.lastName = this.currentUser.lastName;
    this.defaultMessageObj.date = this.createdRecordDate;

    this.tableService.$users.subscribe((res:any) => {
      if (res.length) {
        let creator = res.find(x => x._id == this.createdBy);
        if(creator) {
          this.defaultMessageObj.firstName = creator['firstName'];
          this.defaultMessageObj.lastName = creator['lastName'];
        }
      }
    });
  }

  ngOnChanges() {

    this.loading = true;
    this.isSelfSubscribed = false;
    if (this.chatOpened && this.firstTimeLoad) {
      this.firstTimeLoad = false;
      this.scrollToBottom(300);
    }
    if (
      this.tableInfo.resourceId
    ) {
      this.messageList = [];

      if (!this.chatHistoryFetched) {
        this.loadEmoji = false;
        this.getChatHistory();
      } else if (this.fromTask) {
        this.loadEmoji = false;
        if (this.chatSubscription) {
          this.chatSubscription.unsubscribe();
        }
        this.getChatHistory();
      }
      this.chatHistoryFetched = false;
    }
  }

  scrollToBottom(delayTime) {
    setTimeout(() => {
      const natEle = this.scrollable["scrollable"].nativeElement;
      const height = natEle.scrollHeight;
      natEle.scrollTop = height;
      this.loading = false;
    }, delayTime);
  }

  ngAfterViewInit(): void {
    this.renderer.listen(
      this.scrollable["scrollable"].nativeElement,
      "scroll",
      ($event) => {
        this.loadMoreMessage($event);
      }
    );

    this.resourceData = {
      id: this.tableInfo.resourceId,
      tableName: this.tableInfo.tableName,
      resourceName: this.tableInfo.resourceName,
    };

    this.oldTableInfo = this.tableInfo;

    // this.getChatHistory();
    this.chatHistoryFetched = true;
    this.cdr.detectChanges();

    this.messageService.imageToInternalChatObj.subscribe((ele) => {
      if (ele != "") {
        const fileFormat = [
          {
            url: ele.src,
            type: ele.file.type,
            icon: "file-text-outline",
          },
        ];
        const msg = {
          sender: this.currentUser,
          receiver: this.tableInfo.resourceId,
          type: "file",
          resourceDetails: this.tableInfo,
          dateSent: new Date(),
          dateSeen: null,
          reply: true,
          files: fileFormat,
          id: ele.id
        };
        this.messageList.push(msg);
        this.scrollToBottom(300);
      }
    });
    this.messageService.internalToChatTabObj.subscribe((el) => {
      if (el && this.tableInfo.resourceId == el.receiver) {
        el.sender = this.currentUser;
        this.messageList.push(el);
      }
    });

    this.messageService.imagePastedInChatTab.subscribe((res) => {
      if (res == true) {
        this.scrollToBottom(300);
      }
    });

    if (this.viewCallLog) {
      this.callLogStyle = true;
      this.height = 'height: 100% !important;'
    }
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  loadMoreMessage(event) {
    const pos = event.srcElement.scrollTop;
    if (pos == 0) {
      if (this.totalMessages <= this.messageList.length) {
        return;
      }
      event.srcElement.scrollTop = 25;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        if (this.messageListFlag) {
          if (this.checkMessageArray && this.checkMessageArray.length)
            this.loadMore();
        }
        // else {
        //   this.loadMore();
        // }

      }, 300);
    }
  }

  loadMore(): void {

    if (this.totalMessages && this.totalMessages <= this.messageList.length) {
      return;
    }
    if (!this.loadMoreHistory) {
      return;
    }
    this.loading = true;
    this.messageService
      .loadMoreResourceMessages(this.tableInfo.resourceId, this.skipMessage)
      .subscribe((res: any) => {
        if (res.statusCode === 200) {

          if (res.data) {
            this.messageListFlag = true;
            this.checkMessageArray = res.data.pageOfItems;
            this.skipMessage += 20;
            if (res.data.pageOfItems.length > 0) {

              res.data.pageOfItems.reverse().forEach((element) => {
                let reply = false;
                if (element.sender._id == this.currentUser._id) {
                  reply = true;
                }

                const msg = this.setMessage(element, reply);

                this.messageList.unshift(msg);
              });

              if (res.data.pageOfItems.length < 10) {
                let temp = [];
                if (this.columnData && this.columnData.length) {
                  let autoNumberField = this.columnData.filter(v => v.type == "autoNumber");
                  if (autoNumberField && autoNumberField.length && this.recordData[autoNumberField[0].name]) {
                    if (this.recordData[autoNumberField[0].name]) {
                      temp.push(' ' + this.recordData[autoNumberField[0].name])
                    }
                  }
                  else if (this.recordData["IDField"]) {
                    this.recordData["IDField"].forEach((element, i) => {
                      let IDElement = this.recordData["tableColumns"].filter(v => v.name == element)[0];
                      if (IDElement.type == "date" || IDElement.type == "dateTime") {
                        if (this.recordData[element] && typeof this.recordData[element] !== 'object') {
                          let val = this.datePipe.transform(this.recordData[element], "M/d/yy")
                          temp.push(' ' + val);
                        }
                      } else {
                        if (this.recordData[element] && typeof this.recordData[element] !== 'object') {
                          temp.push(' ' + this.recordData[element]);
                        }
                      }
                    });
                  }
                  else {
                    temp = [];
                  }
                  this.defaultMessageObj.recordId = temp;
                  this.messageList.unshift(this.defaultMessageObj);
                }

              }
            }
            else {
              let find = this.messageList.findIndex(v => v.type == 'user');
              if (find < 0) {
                let temp = [];
                if (this.columnData && this.columnData.length) {
                  let autoNumberField = this.columnData.filter(v => v.type == "autoNumber");
                  if (autoNumberField && autoNumberField.length && this.recordData[autoNumberField[0].name]) {
                    if (this.recordData[autoNumberField[0].name]) {
                      temp.push(' ' + this.recordData[autoNumberField[0].name])
                    }
                  }
                  else if (this.recordData["IDField"]) {
                    this.recordData["IDField"].forEach((element, i) => {
                      let IDElement = this.recordData["tableColumns"].filter(v => v.name == element)[0];
                      if (IDElement.type == "date" || IDElement.type == "dateTime") {
                        if (this.recordData[element] && typeof this.recordData[element] !== 'object') {
                          let val = this.datePipe.transform(this.recordData[element], "M/d/yy")
                          temp.push(' ' + val);
                        }
                      } else {
                        if (this.recordData[element] && typeof this.recordData[element] !== 'object') {
                          temp.push(' ' + this.recordData[element]);
                        }
                      }
                    });
                  }
                  else {
                    temp = [];
                  }
                  this.defaultMessageObj.recordId = temp;
                  this.messageList.unshift(this.defaultMessageObj);
                }
              }


            }
          } else {

            this.loadMoreHistory = false;
          }
          this.loading = false;
        }


      });
  }

  getChatHistory() {
    this.defaultMessageObj.text = 'Created a ' + this.tableInfo.tableName;
    this.loading = true;
    if (this.tableInfo.resourceId) {
      this.chatSubscription = this.messageService
        .getResourceChatHistory(this.tableInfo.resourceId)
        .subscribe((res: any) => {
          if (res.statusCode == 200 && res.data) {
            this.loadSubscribers();
            this.messageList = [];
            this.totalMessages = res.data.pager.totalItems;
            if (res.data.pageOfItems.length > 0) {
              this.messageListFlag = true;
              this.checkMessageArray = res.data.pageOfItems;
              res.data.pageOfItems.reverse().forEach((element) => {
                let reply = false;
                if (element.sender && element.sender._id == this.currentUser._id) {
                  reply = true;
                }
                const msg = this.setMessage(element, reply);
                this.messageList.push(msg);
              });

              if (res.data.pageOfItems.length < 10) {
                let temp = [];
                if (this.columnData && this.columnData.length) {
                  let autoNumberField = this.columnData.filter(v => v.type == "autoNumber");
                  if (autoNumberField && autoNumberField.length && this.recordData[autoNumberField[0].name]) {
                    if (this.recordData[autoNumberField[0].name]) {
                      temp.push(' ' + this.recordData[autoNumberField[0].name])
                    }
                  }
                  else if (this.recordData["IDField"]) {
                    this.recordData["IDField"].forEach((element, i) => {
                      let IDElement = this.recordData["tableColumns"].filter(v => v.name == element)[0];
                      if (IDElement.type == "date" || IDElement.type == "dateTime") {
                        if (this.recordData[element] && typeof this.recordData[element] !== 'object') {
                          let val = this.datePipe.transform(this.recordData[element], "M/d/yy")
                          temp.push(' ' + val);
                        }
                      } else {
                        if (this.recordData[element] && typeof this.recordData[element] !== 'object') {
                          temp.push(' ' + this.recordData[element]);
                        }
                      }
                    });
                  }
                  else {
                    temp = [];
                  }

                  this.defaultMessageObj.recordId = temp;
                  this.messageList.unshift(this.defaultMessageObj);
                }
              }

              this.messageCount.emit(this.messageList.length)
              this.loading = false;
              // setTimeout(() => {
              //   this.scrollToBottom(100);
              // }, 800);
              this.scrollToBottom(0);
              setTimeout(() => {
                this.loadEmoji = true;
              }, 1000);


            }
            else {
              let temp = [];
              if (this.columnData && this.columnData.length) {
                let autoNumberField = this.columnData.filter(v => v.type == "autoNumber");
                if (autoNumberField && autoNumberField.length && this.recordData[autoNumberField[0].name]) {
                  if (this.recordData[autoNumberField[0].name]) {
                    temp.push(' ' + this.recordData[autoNumberField[0].name])
                  }
                }
                else if (this.recordData["IDField"]) {
                  this.recordData["IDField"].forEach((element, i) => {
                    let IDElement = this.recordData["tableColumns"].filter(v => v.name == element)[0];
                    if (IDElement.type == "date" || IDElement.type == "dateTime") {
                      if (this.recordData[element] && typeof this.recordData[element] !== 'object') {
                        let val = this.datePipe.transform(this.recordData[element], "M/d/yy")
                        temp.push(' ' + val);
                      }
                    } else {
                      if (this.recordData[element] && typeof this.recordData[element] !== 'object') {
                        temp.push(' ' + this.recordData[element]);
                      }
                    }

                  });
                }
                else {
                  temp = [];
                }
                this.defaultMessageObj.recordId = temp;
                this.messageList.unshift(this.defaultMessageObj);
                this.loading = false;
              }
              this.loading = false;
            }

          }
        });
    }

  }

  setMessage(data, reply) {
    let msg: any;
    if (data.type == 3 || data.type == "image") {
      let imageType = "jpeg";
      if (data.text) {
        const extension = data.text.split(".").pop();
        if (extension != "jpg") {
          imageType = extension;
        }
      }
      const fileFormat = [
        {
          url: data.text,
          type: "image/" + imageType,
          icon: "file-text-outline",
        },
      ];

      msg = {
        sender: data.sender,
        receiver: this.tableInfo.resourceId,
        type: this.messageService.getResourceMessageType(data.type),
        dateSent: data.createdAt ? data.createdAt : (data.dateSent ? data.dateSent : ''),
        dateSeen: data.dateSeen,
        reply: reply,
        files: fileFormat,
        id: data.id ? data.id : '',
        replyTo: data.replyTo ? data.replyTo : '',
      };
    } else {
      if (data.messageType == "log") {
        msg = {
          sender: data.sender,
          receiver: this.tableInfo.resourceId,
          type: "quote",
          dateSent: data.createdAt ? data.createdAt : (data.dateSent ? data.dateSent : ''),
          dateSeen: data.dateSeen,
          reply: reply,
          quote: data.text,
          id: data.id ? data.id : '',
          replyTo: data.replyTo ? data.replyTo : '',

        };
      } else {
        msg = {
          sender: data.sender,
          receiver: this.tableInfo.resourceId,
          type: this.messageService.getResourceMessageType(data.type),
          dateSent: data.createdAt ? data.createdAt : (data.dateSent ? data.dateSent : ''),
          dateSeen: data.dateSeen,
          reply: reply,
          text: data.text,
          id: data.id ? data.id : '',
          replyTo: data.replyTo ? data.replyTo : '',

        };
      }
    }
    return { ...msg, id: data._id ? data._id : (data.id ? data.id : '') };
  }

  receiveChat() {
    this.socketService.listen("message_removed").subscribe((res: any) => {
      if (res) {
        const index = this.messageList.findIndex((m) => m.id === res);
        if (index > -1) {
          this.messageList.splice(index, 1);
          this.cdr.detectChanges();
        }

      }

    });

    this.socketService.listen("new_message_received").subscribe((res: any) => {
      if (
        res.isGroup &&
        res.receiver == this.tableInfo.resourceId &&
        res.sender._id != this.currentUser._id
      ) {
        this.receiveMessage(res);
      }
    });

    this.socketService.listen("room_message").subscribe((res: any) => {
      if (res.messageType != "log") {
        if (
          res.isGroup &&
          res.receiver == this.tableInfo.resourceId &&
          res.sender._id != this.currentUser._id
        ) {
          this.receiveMessage(res);
        } else if (res.isGroup && res.sender._id == this.currentUser._id) {
          let msg = {};
          if (res.type == 'image') {
          } else {
            msg = {
              sender: res.sender,
              receiver: res.receiver,
              type: res.type,
              text: res.text,
              resourceDetails: res.resourceDetails,
              dateSent: res.createdAt,
              dateSeen: null,
              reply: true,
              id: res._id,
              replyTo: res.replyTo
            };
            this.messageList.push(msg);
          }

          //this.messageList[this.messageList.length - 1].id = res._id;
          this.messageList = [...this.messageList];
        }
      } else {
        if (res.isGroup && res.receiver == this.tableInfo.resourceId) {
          this.receiveMessage(res);
        }
      }
    });

    this.socketService.listen("broadcast_log_message").subscribe((res: any) => {
      if (!this.isSelfSubscribed && res.receiver == this.tableInfo.resourceId) {
        this.receiveMessage(res);
      }
    });
  }

  receiveMessage(data) {
    let reply = false;
    let type: any = this.messageService.getMessageType(data.type);
    let text = data.text;
    let quote = "";
    let file = "";

    if (data.sender._id == this.currentUser._id) {
      reply = true;
    }

    if (data.messageType == "log") {
      type = "quote";
      text = "";
      quote = data.text;
    }

    let msg = {
      sender: data.sender,
      receiver: this.tableInfo.resourceId,
      type: type,
      text: text,
      dateSent: data.createdAt,
      dateSeen: data.dateSeen,
      reply: reply,
      quote: quote,
      file: file,
      replyTo: data.replyTo,
      id: data._id ? data._id : (data.id ? data.id : '')
    };

    if (data.type == "image") {
      msg = this.setMessage(data, false);
    }

    this.messageList.push(msg);
    this.scrollToBottom(300);
  }

  onSubscribe() {
    this.tableInfo = this.tableInfo;
    this.subscribe =
      this.subscribe == "Subscribe" ? "UnSubscribe" : "Subscribe";
  }

  onDeleteMessage({ id }) {
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
              this.messageCount.emit(this.messageList.length === 0);
              const index = this.messageList.findIndex((m) => m.id === id);
              if (index > -1) {
                this.messageList.splice(index, 1);
              }
            }
          });
        }
      });
  }

  mentionRedirect(msg) {
    if (msg && msg.text && msg.text.includes("<span")) {
      let user_id = msg.text.split('"')[3];
      let user_name = msg.text.split("@")[1].split("<")[0];
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
  }

  sendMessage(event: any) {
    if (this.tableInfo.tableId !== "") {
      // -- Subscribe the user to the current channel, if he sends message.
      if (!this.isSelfSubscribed) {
        this.messageService.Join(this.tableInfo.resourceId);
        this.subscriptionText = "Stop watching";
        this.isSelfSubscribed = true;
        const showToaster = false;
        this.activateSubscription(showToaster);
      }

      const files = !event.files ? [] : event.files;

      if (files.length) {
        files.forEach((file) => {
          this.uploadFiles(file);
        });
        this.scrollToBottom(500);
        return;
      }
      let msg;
      if (this.replyFlag) {
        msg = {
          sender: this.currentUser._id,
          receiver: this.tableInfo.resourceId,
          type: this.messageService.getMessageType("text"),
          text: (event.message) ? event.message.trim() : event.message,
          resourceDetails: this.tableInfo,
          dateSent: new Date(),
          dateSeen: null,
          reply: true,
          replyTo: this.replyToId,
        };

      } else if (this.replyImageFlag) {
        msg = {
          sender: this.currentUser._id,
          receiver: this.tableInfo.resourceId,
          type: this.messageService.getMessageType("text"),
          text: (event.message) ? event.message.trim() : event.message,
          resourceDetails: this.tableInfo,
          dateSent: new Date(),
          dateSeen: null,
          reply: true,
          replyTo: this.replyToId,
        };
      } else {
        msg = {
          sender: this.currentUser._id,
          receiver: this.tableInfo.resourceId,
          type: this.messageService.getMessageType("text"),
          text: (event.message) ? event.message.trim() : event.message,
          resourceDetails: this.tableInfo,
          dateSent: new Date(),
          dateSeen: null,
          reply: true,
        };

      }

      const shouldSave = "yes";
      this.chatSubscriptionService.sendMessage(msg, this.tableInfo, shouldSave);
      msg.sender = this.currentUser;
      // this.messageList.push(msg);
      this.scrollToBottom(500);
      this.messageCount.emit(this.messageList.length + 1);
      this.replyFlag = false;
      this.replyImageFlag = false;
    }
  }

  uploadFiles(file) {
    const data = {
      receiver: this.tableInfo.resourceId,
      type: "image",
      sender: this.currentUser._id,
      file: file,
      isGroup: true,
      resourceDetails: this.tableInfo,
    };

    const fileFormat = [
      {
        url: file.src,
        type: file.type,
        icon: "file-text-outline",
      },
    ];

    this.fileUploading = true;
    this.messageService.uploadChatImages(data).subscribe((res: any) => {
      if (res.message) {
        fileFormat[0].url = res.message.text;
        const msg = {
          sender: this.currentUser._id,
          receiver: this.tableInfo.resourceId,
          type: "image",
          resourceDetails: this.tableInfo,
          dateSent: new Date(),
          dateSeen: null,
          reply: true,
          files: fileFormat,
          id: res.message._id ? res.message._id : (res.message.id ? res.message.id : '')
        };

        const emitMessage = {
          sender: this.currentUser._id,
          receiver: this.tableInfo.resourceId,
          type: "image",
          resourceDetails: this.tableInfo,
          dateSent: new Date(),
          dateSeen: null,
          reply: true,
          text: res.message.text,
          id: res.message._id ? res.message._id : (res.message.id ? res.message.id : '')
        };
        const shouldSave = "no";
        this.chatSubscriptionService.sendMessage(
          emitMessage,
          this.tableInfo,
          shouldSave
        );
        msg.sender = this.currentUser;
        msg.type = "file";
        this.messageList.push(msg);
        this.scrollToBottom(300);
        this.fileUploading = false;

        // const conversionObj = {
        //   sender: this.currentUser._id,
        //   receiver: this.tableInfo.resourceId,
        //   text: res.message.text,
        //   isGroup: true,
        //   resourceDetails:this.tableInfo,
        //   type: 'image',
        //   dateSeen: null,
        // }

        // this.messageService.newMessage(conversionObj);
        // msg.text = '';
      }
    });
  }

  showSubscribers() {
    this.loading = true;
    this.userSubscription = this.chatSubscriptionService
      .getSubscribers(this.tableInfo.resourceId)
      .subscribe((res: any) => {
        this.loading = false;
        if (res.data) {
          this.dialogService
            .open(ShowcaseDialogComponent, {
              context: {
                list: res.data,
                title: "List of subscribers",
                button: { text: "Close" },
              },
            })
            .onClose.subscribe((output) => {
            });
        }
      });
  }

  loadSubscribers($event = "") {

    this.chatSubscriptionService
      .getSubscribers(this.tableInfo.resourceId)
      .subscribe((res: any) => {
        if (res.data) {
          this.subscribers = res.data;
          this.subscriber.emit(this.subscribers);
          if (res.data.length > 0) {
            res.data.map((data) => {
              if (data._id == this.currentUser._id) {
                this.subscriptionText = "Stop watching";
                this.isSelfSubscribed = true;
              }
            });
          }
        }
      });
  }

  watcherMenuOpened() {
    this.isWatcherOpened = true;
  }

  watcherMenuClosed() {
    this.isWatcherOpened = false;
  }

  cancelSubscription(user: string): void {
    this.chatSubscriptionService
      .cancelSubscription({
        resourceId: this.tableInfo.resourceId,
        userId: user,
      })
      .subscribe((data: any) => {
        if (data.statusCode == 200) {
          //this.loadSubscribers();
          this.toasterService.success(data.message, "Action was  completed!");
        }
      });
    const itemToRemoveIndex = this.subscribers.findIndex(function (item) {
      return item._id === user;
    });

    if (itemToRemoveIndex !== -1) {
      this.subscribers.splice(itemToRemoveIndex, 1);
    }
  }

  activateSubscription(showToaster = true) {
    const data = {
      resourceId: this.tableInfo.resourceId,
      userId: this.currentUser,
      tableName: this.tableInfo.tableName,
      invitedBy: this.currentUser,
    };

    this.chatSubscriptionService.watch(data).subscribe(
      (res: any) => {
        if (res.statusCode === 201) {
          this.loadSubscribers();
          if (showToaster) {
            this.toasterService.success(res.message, "Success");
            this.loading = false;
          }
        } else {
          this.loading = false;
          this.toasterService.danger(res.message, "Error");
        }
      },
      (error) => {
        this.toasterService.danger(
          `${error.error && error.error.message}`,
          "Error"
        );
        this.loading = false;
      },
      () => {
      }
    );
  }

  selfSubsription(): void {
    if (this.isSelfSubscribed == true) {
      this.subscriptionText = "Start watching";
      this.isSelfSubscribed = false;
      this.cancelSubscription(this.currentUser);
    } else {
      this.subscriptionText = "Stop watching";
      this.isSelfSubscribed = true;
      this.activateSubscription();
    }
  }

  zoomImage(msg) {
    this.myDiv.nativeElement.style.display = "block";
    this.myModalImage.nativeElement.src = msg.text;
    this.myCaption.nativeElement.innerHTML = "Image";
    this.myCaption.nativeElement.parentElement.parentElement.parentElement.classList.add(
      "modal_clicked"
    );
  }

  closeImageModal() {
    this.myDiv.nativeElement.style.display = "none";
  }

  onFileChosen(event) {
    const file = event.target.files[0];
    this.uploadFiles(file);
  }

  chatPageClicked() {
    this.messageService.chatSeenForResource.next(this.tableInfo.resourceId);
  }

  onImageChosen(event) {
    const file = event.target.files[0];
    this.uploadFiles(file);
    // const imgClass = document.getElementsByClassName('scroller')[1];
    // imgClass.append('<div>' + file + '</div>');
  }

  triggerImageUpload(): void {
    if (this.imageInput) this.imageInput.nativeElement.click();
  }

  triggerFileUpload(): void {
    if (this.fileInput) this.fileInput.nativeElement.click();
  }

  // getBase64(file) {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = error => reject(error);
  //   });
  // }

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
    const messageDiv = document.getElementsByClassName("message-row");
    const inputTag = messageDiv[0].getElementsByTagName("input");
    inputTag[0].value += char;

    const evnt = new Event("input", {
      bubbles: true,
      cancelable: true,
    });

    inputTag[0].dispatchEvent(evnt);
  }

  openReminderModal() {
    this.openreminderModal.emit()
  }

  ngOnDestroy(): void {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  @HostListener("document:click")
  clicked() {
    this.showEmojiPicker = false;
  }

  replyParticularMessage(message) {

    this.replyMessage = message;
    this.replyName = (message.sender.firstName + " " + message.sender.lastName);
    this.datetrans = this.datePipe.transform(message.dateSent, "M/d/yy, h:mm a");
    this.replyDate = this.datetrans;
    if (message.type == "file") {
      this.replyToId = message.id;
      let ext = message.files[0].url.split('.').pop();
      if (ext == "jpg" || ext == "jpeg" || ext == "png") {
        this.replyToMessage = message.files[0].url;
        this.replyImageFlag = true;
      } else {
        this.replyToMessage = "assets/images/file-img.png"
        this.replyImageFlag = true;
      }

    } else {
      this.replyToId = message.id;
      this.replyToMessage = message.text;
      this.replyFlag = true;
    }
  }

  replyFlagEmitMethod(value) {
    this.replyFlag = value;

  }

  replyImageFlagEmitMethod(value) {
    this.replyImageFlag = value;
  }

  scrollToMessage(message) {

    if (message.replyTo && message.replyTo.isActive) {
      let inter = setInterval(() => {
        let index = this.messageList.findIndex(v => v.id == message.replyTo._id)
        if (index > -1) {

          let val = "msg" + index;
          const ele = document.getElementById(val);

          ele.scrollIntoView();
          ele.classList.add("highlightedMessage");
          setTimeout(function () {
            ele.classList.remove("highlightedMessage");
          }, 2000)
          clearInterval(inter);

        } else {
          this.loading = true;
          this.messageService
            .loadMoreResourceMessages(this.tableInfo.resourceId, this.skipMessage)
            .subscribe((res: any) => {
              if (res.statusCode === 200) {
                if (res.data) {
                  this.skipMessage += 20;
                  res.data.pageOfItems.reverse().forEach((element) => {
                    let reply = false;
                    if (element.sender._id == this.currentUser._id) {
                      reply = true;
                    }

                    const msg = this.setMessage(element, reply);

                    this.messageList.unshift(msg);
                  });
                }

              } else {
                this.loadMoreHistory = false;
              }
              this.loading = false;
            });
        }

      }, 1000)
    }


  }
  loadSubFromForm(event) {
    this.loadSubscribers();
  }
}
