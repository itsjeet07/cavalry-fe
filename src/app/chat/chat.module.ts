/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';
import { NbChatComponent } from './chat.component';
import { NbChatMessageComponent } from './chat-message.component';
import { NbChatFormComponent } from './chat-form.component';
import { NbChatMessageTextComponent } from './chat-message-text.component';
import { NbChatMessageFileComponent } from './chat-message-file.component';
import { NbChatMessageQuoteComponent } from './chat-message-quote.component';
import { NbChatMessageMapComponent } from './chat-message-map.component';
import { NbChatOptions } from './chat.options';
import { NbIconModule, NbInputModule, NbButtonModule, NbSpinnerModule, NbCardModule } from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MentionModule } from '@app/pages/angular-mentions/src/lib/mention.module';
import { NbChatMessageHtmlComponent } from './chat-message-html.component';
import { ChatTabComponent } from './chat-tab/chat-tab.component';
import { MatMenuModule } from '@angular/material/menu';
import { PickerModule } from '@ctrl/ngx-emoji-mart';


const NB_CHAT_COMPONENTS = [
  NbChatComponent,
  NbChatMessageComponent,
  NbChatFormComponent,
  NbChatMessageTextComponent,
  NbChatMessageFileComponent,
  NbChatMessageQuoteComponent,
  NbChatMessageMapComponent,
  NbChatMessageHtmlComponent,
  ChatTabComponent
];

@NgModule({
  imports: [
    NbSpinnerModule,
    NbCardModule,
    MatMenuModule,
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    CommonModule,
    FormsModule,
    RouterModule,
    PickerModule,
    MentionModule,
  ],
  declarations: [
    ...NB_CHAT_COMPONENTS
  ],
  exports: [
    ...NB_CHAT_COMPONENTS
  ],
})
export class NbChatModule {

  static forRoot(options?: NbChatOptions): ModuleWithProviders<NbChatModule> {
    return {
      ngModule: NbChatModule,
      providers: [
        { provide: NbChatOptions, useValue: options || {} },
      ],
    };
  }

  static forChild(options?: NbChatOptions): ModuleWithProviders<NbChatModule> {
    return {
      ngModule: NbChatModule,
      providers: [
        { provide: NbChatOptions, useValue: options || {} },
      ],
    };
  }
}
