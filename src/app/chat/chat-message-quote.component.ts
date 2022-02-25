/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DatePipe} from "@angular/common";

/**
 * Chat message component.
 */
@Component({
  selector: 'nb-chat-message-quote',
  template: `
    <p *ngIf="callLog" class="call-log-date">{{datePipe.transform(date, "M/d/yy")}}
      <span></span></p>
    <p [ngClass]="{'sender-call-quote' : callLog, 'sender': !callLog}" *ngIf="sender || date">
      <span>
        {{ sender }}
        <span *ngIf="callLog" class="call-quote">{{ quote }}</span>
      </span>
      <time *ngIf="!callLog">{{ date  | date: dateFormat }}</time>
      <time *ngIf="callLog">{{ datePipe.transform(date, "h:mm a") }}</time>
    </p>
    <p class="quote" *ngIf="!callLog">
      {{ quote }}
    </p>
    <nb-chat-message-text [message]="message" (onDeleteMessage)="onDeleteMessage.emit($event)">
      {{ message }}
    </nb-chat-message-text>
  `,
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NbChatMessageQuoteComponent implements AfterViewInit {

  /**
   * Message sender
   * @type {string}
   */
  @Input() message: string;

  /**
   * Message sender
   * @type {string}
   */
  @Input() sender: string;

  /**
   * Message send date
   * @type {Date}
   */
  @Input() date: Date;

 /**
   * Message send date format, default 'shortTime'
   * @type {string}
   */
  @Input() dateFormat: string = 'shortTime';

  /**
   * Quoted message
   * @type {Date}
   */
  @Input() quote: string;

  @Output() onDeleteMessage = new EventEmitter();
  @Input() callLog;
  @Input() messageId;

  constructor(public datePipe: DatePipe) {

  }

  ngAfterViewInit() {
    console.log(this.messageId);
  }

}
