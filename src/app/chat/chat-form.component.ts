/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  Output,
  ViewChild
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NbComponentStatus } from '../component-status';
import { TableService } from '@app/shared/services/table.service';
import { map } from 'rxjs/operators';
import { MessageService } from '@app/shared/services/message.service';
import { ChatSubscriptionService } from '@app/shared/services/chat-subscription.service';

/**
 * Chat form component.
 *
 * Show a message form with a send message button.
 *
 * ```ts
 * <nb-chat-form showButton="true" buttonIcon="nb-send">
 * </nb-chat-form>
 * ```
 *
 * When `[dropFiles]="true"` handles files drag&drop with a file preview.
 *
 * Drag & drop available for files and images:
 * @stacked-example(Drag & Drop Chat, chat/chat-drop.component)
 *
 * New message could be tracked outside by using `(send)` output.
 *
 * ```ts
 * <nb-chat-form (send)="onNewMessage($event)">
 * </nb-chat-form>
 *
 * // ...
 *
 * onNewMessage({ message: string, files: any[] }) {
 *   this.service.sendToServer(message, files);
 * }
 * ```
 */
@Component({
  selector: 'nb-chat-form',
  template: `
    <div class="dropped-files" *ngIf="droppedFiles?.length">
      <ng-container *ngFor="let file of droppedFiles">
        <div *ngIf="file.urlStyle" [style.background-image]="file.urlStyle">
          <span class="remove" (click)="removeFile(file)">&times;</span>
        </div>

        <div>
          <nb-icon *ngIf="!file.urlStyle" icon="file-text-outline" pack="nebular-essentials"></nb-icon>
          <span class="remove" (click)="removeFile(file)">&times;</span>
        </div>
      </ng-container>
    </div>
    <div class="message-row">

      <div class="image-div chat-tab-imge" [hidden]="!copiedFile">
        <i class="fa fa-remove rem-icon" (click)="removeImageCopied()"></i>
        <img #imgRenderer class="renderImage img-thumbnail" height="75px" width="150px" />
        <div class="send-img-outer"><img src="/assets/images/send.png" (click)="sendImage()" height="35px" width="35px"
            class="send-img"></div>
        <!-- <a class="btn btn-danger btn-sm" (click)="removeImageCopied()">Delete</a> -->
      </div>

      <textarea nbInput
             id="chatMessage"
             fullWidth
             rows="1"
             [mention]="users"
             [mentionConfig]="{dropUp:true}"
             [status]="getInputStatus()"
             (focus)="inputFocus = true"
             (blur)="inputFocus = false"
             (mouseenter)="inputHover = true"
             (mouseleave)="inputHover = false"
             [(ngModel)]="message"
             [class.with-button]="showButton"
             (paste)="pasteEvent($event)"
             type="text"
             #textArea
             (keyup)="onChange()"
             placeholder="{{ fileOver ? dropFilePlaceholder : messagePlaceholder }}"
             (keyup.enter)="sendMessage()"
             [disabled]="copiedFile">
      </textarea>
      <button nbButton
              *ngIf="showButton"
              [class.with-icon]="!buttonTitle"
              (click)="sendMessage()"
              class="send-button"
              [ngStyle]="setColor()"
              >
        <nb-icon *ngIf="!buttonTitle; else title" [icon]="buttonIcon" pack="nebular-essentials"></nb-icon>
        <ng-template #title>{{ buttonTitle }}</ng-template>
      </button>
    </div>
  `,
  styleUrls: ['./chat-style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class NbChatFormComponent implements OnChanges{

  status: NbComponentStatus = 'basic';
  inputFocus: boolean = false;
  inputHover: boolean = false;

  droppedFiles: any[] = [];
  imgDropTypes = ['image/png', 'image/jpeg', 'image/gif'];

  copiedFile: File;
  fileUploading = false;
  users: string[] = [];
  oldMessage = '';
  usersWithIds = [];
  count=0;
  currentUser = null;
  /**
   * Predefined message text
   * @type {string}
   */
  @Input() message: string = '';

  @Input() uiColor = '#598bff';
  /**
   * Message placeholder text
   * @type {string}
   */
  @Input() messagePlaceholder: string = 'Type a message';
  /**
   * Send button title
   * @type {string}
   */
  @Input() buttonTitle: string = '';

  /**
   * Send button icon, shown if `buttonTitle` is empty
   * @type {string}
   */
  @Input() buttonIcon: string = 'paper-plane-outline';

  /**
   * Show send button
   * @type {boolean}
   */
  @Input() showButton: boolean = true;

  /**
   * Show send button
   * @type {boolean}
   */
  @Input() dropFiles: boolean = false;

  /**
   * Resource Id
   */
  @Input() resourceId: string = "";
  /**
   * Resource table name
   */
   @Input() resourceTableName: string = "";
  /**
   * File drop placeholder text
   * @type {string}
   */
  @Input() dropFilePlaceholder: string = 'Drop file to send';


  @ViewChild('textArea', { read: ElementRef }) textArea: ElementRef;
  /**
   *
   * @type {EventEmitter<{ message: string, files: File[] }>}
   */
  @Output() send = new EventEmitter<{ message: string, files: File[] }>();

  @HostBinding('class.file-over') fileOver = false;

  @ViewChild('imgRenderer') imgRenderer: ElementRef;

  @Output() loadSubscribers = new EventEmitter();

  constructor(protected cd: ChangeDetectorRef,
    protected domSanitizer: DomSanitizer,
    private tableService: TableService,
    private messageService: MessageService,
    private chatSubscriptionService: ChatSubscriptionService
    ) {

    this.currentUser = JSON.parse(localStorage.getItem("userData"));
    this.tableService.$users.subscribe(res => {
      if (res.length) {
        res.forEach((usr: any) => {
          this.users.push(usr.firstName + ' ' + usr.lastName);
          this.usersWithIds = res;
        })
      }
    });
  }


  @HostListener('drop', ['$event'])
  onDrop(event: any) {
    if (this.dropFiles) {
      event.preventDefault();
      event.stopPropagation();

      this.fileOver = false;
      if (event.dataTransfer && event.dataTransfer.files) {

        for (const file of event.dataTransfer.files) {
          const res = file;

          if (this.imgDropTypes.includes(file.type)) {
            const fr = new FileReader();
            fr.onload = (e: any) => {
              res.src = e.target.result;
              res.urlStyle = this.domSanitizer.bypassSecurityTrustStyle(`url(${res.src})`);
              this.cd.detectChanges();
            };

            fr.readAsDataURL(file);
          }
          this.droppedFiles.push(res);
        }
      }
    }
  }

  ngOnChanges(){
  }

  onChange() {
    const textArea = this.textArea.nativeElement;
    textArea.style.overflow = 'hidden';
    textArea.style.height = '0px';
    textArea.style.height = textArea.scrollHeight + 'px';
  }

  setColor(){
    return {
      background:this.uiColor,
      border:'1px solid ' + this.uiColor,
    }
  }
  removeFile(file) {
    const index = this.droppedFiles.indexOf(file);
    if (index >= 0) {
      this.droppedFiles.splice(index, 1);
    }
  }

  @HostListener('dragover')
  onDragOver() {
    if (this.dropFiles) {
      this.fileOver = true;
    }
  }

  @HostListener('dragleave')
  onDragLeave() {
    if (this.dropFiles) {
      this.fileOver = false;
    }
  }

  checkIfMention(message) {

    if(message.includes("@") )
    {
      return true;
    }
    return false;
  }

  addClassToMention(message):void{

    let newSubscriberAdded = false;

    this.usersWithIds.forEach( (user) => {
      let userName = '@'+user.firstName +' ' + user.lastName;
      if(message.indexOf(userName) > -1){
        message = message.replace(userName,`<span class="mention ${user._id}" [id]="${user._id}" >${userName}</span>`)
        //-- Subscribe to watchers
          this.activateSubscription(user._id);
          newSubscriberAdded = true;
      }
    });
    this.message = message;
    if(newSubscriberAdded){
      this.loadSubscribers.emit("subscriber");
    }

    return;
  }

  sendMessage() {
    const textArea = this.textArea.nativeElement;
    textArea.style.overflow = 'hidden';
    textArea.style.height = '37px';
   if(this.message || this.droppedFiles.length){
      let tempMessage;
       if (this.checkIfMention(this.message)) {
          this.count++;
          if(this.count==1){
            if (this.droppedFiles.length || String(this.message).trim().length) {
              if(String(this.message).trim().length){
                tempMessage=this.message;
              }
            }
          }else if(this.count==2){
            this.addClassToMention(this.message);
            this.send.emit({ message: this.message, files: this.droppedFiles });
            this.message = '';
            this.count=0;
            this.droppedFiles = [];
          }

      }else {
        this.send.emit({ message: this.message, files: this.droppedFiles });
        this.message = '';
        this.count=0;
        this.droppedFiles = [];
      }
    }
  }

  setStatus(status: NbComponentStatus): void {
    if (this.status !== status) {
      this.status = status;
      this.cd.detectChanges();
    }
  }

  getInputStatus(): NbComponentStatus {
    if (this.fileOver) {
      return this.getHighlightStatus();
    }

    if (this.inputFocus || this.inputHover) {
      return this.status;
    }

    return 'basic';
  }

  getButtonStatus(): NbComponentStatus {
    return this.getHighlightStatus();
  }

  protected getHighlightStatus(): NbComponentStatus {
    if (this.status === 'basic' || this.status === 'control') {
      return 'primary';
    }
    return this.status;
  }

  removeImageCopied() {
     this.copiedFile = null;
     this.message = '';
  }

  pasteEvent(event: any) {
    const items = event.clipboardData.items;
    let blob = null;

    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        blob = item.getAsFile();
        this.copiedFile = blob;
      }
    }
    this.messageService.imagePastedInChatTab.next(true);

    this.renderImage(blob);
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
  }

  sendImage() {
    if (this.copiedFile) {

      this.fileUploading = true;
      this.send.emit({ message: this.message, files: [this.copiedFile] });
      this.copiedFile = null;
      this.message = '';
      // this.messageService.imagePastedInChatTab.next(false);
    }
  }

  activateSubscription(userId) {
    const data = {
      resourceId: this.resourceId,
      userId: userId,
      tableName: this.resourceTableName,
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
}
