import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule, NbCalendarModule, NbBadgeModule, NbCheckboxModule, NbMenuModule, NbContextMenuModule, NbCalendarRangeModule,
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { NgChatModule } from '../ng-chat-v1/ng-chat.module';
import { FilterDashboardPipe } from '@app/shared/pipes/dashboard-filter.pipe';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@app/shared/shared.module';
import { TablesModule } from '../tables/tables.module';
import { GoogleChartsModule } from 'angular-google-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  imports: [
    FormsModule,
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbTabsetModule,
    NbActionsModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NgxEchartsModule,
    NbCalendarModule,
    NbBadgeModule,
    NbCheckboxModule,
    NbMenuModule,
    NgChatModule,
    NbContextMenuModule,
    NbCalendarRangeModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    SharedModule,
    TablesModule,
    GoogleChartsModule,
    NgbModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  declarations: [
    DashboardComponent,
    FilterDashboardPipe,
  ],
  exports: [
    FilterDashboardPipe,
  ],
  providers: [
    FilterDashboardPipe,
  ],
})
export class DashboardModule { }
