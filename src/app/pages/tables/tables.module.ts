import { NgChatModule } from './../ng-chat-v1/ng-chat.module';
import { TableBreadcrumbComponent } from './table-breadcrumb/table-breadcrumb.component';
import { NgModule } from '@angular/core';
import { TablesRoutingModule, routedComponents } from './tables-routing.module';
import { FsIconComponent } from './tree-grid/tree-grid.component';
import { SharedModule } from '@app/shared/shared.module';
import { NbContextMenuModule, NbIconLibraries, NbTreeGridModule, NbToggleModule, NbLayoutModule, NbAlertModule, NbMenuModule } from '@nebular/theme';
import { AddEditColumnInDialogComponent } from './add-edit-column-in-dialog/add-edit-column-in-dialog.component';
import { DynamicTreeTableComponent } from './dynamic-tree-table/dynamic-tree-table.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DynamicTableViewComponent } from './dynamic-table-view/dynamic-table-view.component';
import { NgPluralizeModule } from 'ng-pluralize';
import { TaskTabComponent } from './task-tab/task-tab.component';
// import { ChatTabComponent } from './chat-tab/chat-tab.component';
import { MatMenuModule } from '@angular/material/menu';
import { TableConfigComponent } from './table-config/table-config.component';
import { EmailComponent } from './email/email.component';
import { TaskComponent } from './list-task/task.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NbChatModule } from '@app/chat/chat.module';
import { TaskCountComponent } from './task-count/task-count.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NotificationsComponent } from './notifications/notifications.component';
import { ResizableDirective } from './resizable.directive';
import { DependenciesComponent } from './dependencies/dependencies.component';
import { ThemeModule } from '@app/@theme/theme.module';
import { EmailTemplateConfigComponent } from './email-template-config/email-template-config.component';
import { EmailTemplateModalComponent } from './email-template-modal/email-template-modal.component';
import { EmailConfigHelpComponent } from './email-config-help/email-config-help.component';
import { RemindersComponent } from './reminders/reminders.component';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { TriggerTableComponent } from './trigger-table/trigger-table.component';
import { GojsAngularModule } from 'gojs-angular';
import { DocumentTemplateConfigComponent } from './document-template-config/document-template-config.component';
import { DocumentTemplateModalComponent } from './document-template-modal/document-template-modal.component';
import { ActionsTemplateConfigComponent } from './actions-template-config/actions-template-config.component';
import { AddEditActionsConfigComponent } from './add-edit-actions-config/add-edit-actions-config.component';
import { ExportTableComponent } from './export-table/export-table.component';
import { ImportTableComponent } from './import-table/import-table.component';
import { FileSaverModule } from 'ngx-filesaver';
import { ExportTableDataComponent } from './export-table-data/export-table-data.component';
import {DefaultFiltersComponent} from "@app/pages/tables/default-filters/default-filters.component";
import { AddEditDefaultFiltersComponent } from './add-edit-default-filters/add-edit-default-filters.component';
import { NewReminderComponent } from './new-reminder/new-reminder.component';
import { ViewHandlerComponent } from './view-handler/view-handler.component';
import { RecordGadgetsComponent } from './record-gadgets/record-gadgets.component';
import { AddEditRecordGadgetComponent } from './add-edit-record-gadget/add-edit-record-gadget.component';
import { ValidationCheckComponent } from './validation-check/validation-check.component';
import { AddEditValidationCheckComponent } from './add-edit-validation-check/add-edit-validation-check.component';
import { FilterComponent } from './filter/filter.component';
import { OverviewComponent } from './overview/overview.component';


@NgModule({
  imports: [
    SharedModule,
    NbTreeGridModule,
    NbToggleModule,
    TablesRoutingModule,
    DragDropModule,
    NbContextMenuModule,
    NgPluralizeModule,
    NbChatModule,
    NbLayoutModule,
    MatMenuModule,
    NgChatModule,
    NbAlertModule,
    PickerModule,
    ThemeModule,
    NgxLinkifyjsModule,
    MatAutocompleteModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    GojsAngularModule,
    FileSaverModule,
    NbMenuModule
  ],
  declarations: [
    ...routedComponents,
    FsIconComponent,
    ResizableDirective,
    AddEditColumnInDialogComponent,
    DynamicTreeTableComponent,
    DynamicTableViewComponent,
    TableBreadcrumbComponent,
    TaskTabComponent,
    // ChatTabComponent,
    TableConfigComponent,
    EmailComponent,
    TaskComponent,
    TaskCountComponent,
    NotificationsComponent,
    DependenciesComponent,
    EmailTemplateConfigComponent,
    EmailTemplateModalComponent,
    EmailConfigHelpComponent,
    RemindersComponent,
    TriggerTableComponent,
    DocumentTemplateConfigComponent,
    DocumentTemplateModalComponent,
    ActionsTemplateConfigComponent,
    AddEditActionsConfigComponent,
    ExportTableComponent,
    ImportTableComponent,
    ExportTableDataComponent,
    NewReminderComponent,
    DefaultFiltersComponent,
    AddEditDefaultFiltersComponent,
    ViewHandlerComponent,
    RecordGadgetsComponent,
    AddEditRecordGadgetComponent,
    ValidationCheckComponent,
    AddEditValidationCheckComponent,
    FilterComponent,
    OverviewComponent,
  ],
  exports: [
    TaskComponent,
    NotificationsComponent,
    // ChatTabComponent
  ],
})
export class TablesModule {
  constructor(iconsLibrary: NbIconLibraries) {
   iconsLibrary.registerSvgPack('delete', { 'python': '<img src="assets/images/delete.png" width="100%" style="display:block">' });
  iconsLibrary.registerSvgPack('details', { 'python': '<img src="assets/images/details.png" width="100%"  style="display:block">'});
   iconsLibrary.registerSvgPack('view', { 'python': '<img src="assets/images/view.png" width="100%" style="display:block">' });
   iconsLibrary.registerSvgPack('edit', { 'python': '<img src="assets/images/edit.png" width="100%">' });

  }
}
