import { Component, Output, ViewEncapsulation } from "@angular/core";
import { MessageService } from "@app/shared/services/message.service";
import { SocketService } from "@app/shared/services/socket.service";
import { TableService } from "@app/shared/services/table.service";
import { environment } from "@env/environment";
import { DemoAdapter } from "./my-adapter";
import { Router } from "@angular/router";
import { NgChatWindowComponent } from "../ng-chat-v1/components/ng-chat-window/ng-chat-window.component";
import { EventEmitter } from "events";

@Component({
  selector: "ngx-message",
  templateUrl: "./message.component.html",
  styleUrls: ["./message.component.scss"],
  encapsulation: ViewEncapsulation.ShadowDom, // Use to disable CSS Encapsulation for this component
})
export class MessageComponent {
  title = "app";
  userId;
  imageUploadUrl = environment.apiUrl + "/message/upload";
  // theme = 'Dark';
  constructor(
    private tableservice: TableService,
    private socketService: SocketService,
    private messageService: MessageService,
    private route: Router
  ) {
    this.socketService.listen("user_status_change").subscribe((res: any) => {
      if (res.id) {
        this.messageService.userStatusChangeonListen(res.id, res.status);
      }
    });

    this.userId = JSON.parse(localStorage.getItem("userData"))._id;
    this.socketService.listen("new_group_created").subscribe((res: any) => {
      if (
        res.sender._id == this.userId ||
        (res.subscribers &&
          res.subscribers.findIndex((v) => v == this.userId) > -1)
      )
        this.messageService.newGroupEmitter.emit(res);
    });
    this.socketService.listen("new_message_received").subscribe((res: any) => {

      const internalToChatTabObj1 = {
        sender: res.sender._id,
        receiver: res.receiver,
        type: res.type,
        text: res.text,
        resourceDetails: res.resourceDetails,
        dateSent: new Date(),
        dateSeen: null,
        reply: true,
        id: res._id,
        replyTo:res.replyTo,
      };
      if (res.sender._id == this.userId) {
        this.messageService.setNewMessageIdAtSenderSide(res);
        this.messageService.internalToChatTabObj.next(internalToChatTabObj1);
      }
      if (res.isGroup && res.isGroup != "false") {
        if (res.sender._id != this.userId) {
          let counter = 0;
          this.messageService.receiveResourceMessage(res, 0);
        }
      } else {
        if ((res.sender._id != this.userId) && (res.sender._id != res.receiver)) {
          let counter = 0;
          this.messageService.receiveMessage(res, 0);
        }
      }
    });
    this.socketService.listen("room_message").subscribe((res: any) => {
      let counter = 0;
      //this.messageService.receiveResourceMessage(res, 0);
      // if(res.type!= 'image')
        this.messageService.setNewMessageIdAtSenderSide(res);
    });

    this.socketService.listen("message_removed").subscribe((res: any) => {
      //-- Remove message
      this.messageService.emitRemovedMessage(res);
    });

    this.socketService.listen("broadcast_log_message").subscribe((res: any) => {
      let counter = 0;
      this.messageService.receiveResourceMessage(res, 0);
    });
  }

  onPushSendMessage(event) {
    this.adapter.addToHistory(event);
  }

  public adapter = new DemoAdapter(
    this.tableservice,
    this.messageService,
    this.socketService,
    this.route
  );
}
