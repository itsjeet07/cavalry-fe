import { NgModule } from '@angular/core';
import { NbIconLibraries, NbChatModule, NbIconModule, NbCardModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MessageComponent } from './message/message.component';
import { NgChatModule } from './ng-chat-v1/ng-chat.module';
import { NbMenuModule } from '@app/menu/menu.module';
import { NbMenuInternalService } from '@app/menu/menu.service';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    NgChatModule,
    // NbChatModule,
    // NbIconModule,
    // NbCardModule
  ],
  declarations: [
    PagesComponent,
    MessageComponent,
  ],
  providers: [
    NbMenuInternalService
  ]
})
export class PagesModule {
  constructor(iconsLibrary: NbIconLibraries) {
    iconsLibrary.registerSvgPack('dashboard', { 'python': '<img src="assets/images/dashboard.png" width="25px">' });
    iconsLibrary.registerSvgPack('custom-icon', { 'contact': '<img src="assets/images/contact.png" width="25px">' });
  }
}
