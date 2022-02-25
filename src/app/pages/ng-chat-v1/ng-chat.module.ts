import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgChat } from './ng-chat.component';
import { EmojifyPipe } from './pipes/emojify.pipe';
import { LinkfyPipe } from './pipes/linkfy.pipe';
import { GroupMessageDisplayNamePipe } from './pipes/group-message-display-name.pipe';
import { NgChatOptionsComponent } from './components/ng-chat-options/ng-chat-options.component';
import { NgChatFriendsListComponent } from './components/ng-chat-friends-list/ng-chat-friends-list.component';
import { NgChatWindowComponent } from './components/ng-chat-window/ng-chat-window.component';
import { DragDropDirective } from '../drag-drop.directive';
import { MessageCountPipe } from '@app/shared/pipes/messageCount.pipe';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { SharedModule } from '@app/shared/shared.module';
import { UserGroupPipe } from './pipes/user-group.pipe';
import { countByParticipantTypePipe } from './pipes/countByParticipantType.pipe';
import { MentionModule } from '../angular-mentions/src/lib';
import { AddPeopleComponent } from './components/add-people/add-people.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SetStatusComponent } from './components/set-status/set-status.component';
import { MatMenuModule, _MatMenu } from '@angular/material/menu';
import { PopoutwindowComponent } from './components/popoutwindow/popoutwindow.component';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    PickerModule,
    SharedModule,
    MentionModule,
    DragDropModule,
    MatMenuModule,
    PortalModule,
  ],
  declarations: [
    NgChat,
    EmojifyPipe,
    LinkfyPipe,
    GroupMessageDisplayNamePipe,
    NgChatOptionsComponent,
    NgChatFriendsListComponent,
    NgChatWindowComponent,
    DragDropDirective,
    MessageCountPipe,
    UserGroupPipe,
    countByParticipantTypePipe,
    AddPeopleComponent,
    SetStatusComponent,
    PopoutwindowComponent,
  ],
  exports: [NgChat, LinkfyPipe, MessageCountPipe, UserGroupPipe, countByParticipantTypePipe, DragDropModule],
  providers: [LinkfyPipe, MessageCountPipe, UserGroupPipe, countByParticipantTypePipe]
})
export class NgChatModule {
}
