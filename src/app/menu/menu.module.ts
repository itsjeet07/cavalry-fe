/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NbIconModule, NbBadgeModule } from '@nebular/theme';

import { NbMenuComponent, NbMenuItemComponent } from './menu.component';
import { NbMenuService, NbMenuInternalService } from './menu.service';


const nbMenuComponents = [NbMenuComponent, NbMenuItemComponent];

const NB_MENU_PROVIDERS = [NbMenuService, NbMenuInternalService];

@NgModule({
  imports: [
    NbIconModule,
    NbBadgeModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  declarations: [...nbMenuComponents],
  exports: [...nbMenuComponents],
})
export class NbMenuModule {
  static forRoot(): ModuleWithProviders<NbMenuModule> {
    return {
      ngModule: NbMenuModule,
      providers: [
        ...NB_MENU_PROVIDERS,
      ],
    };
  }
}
