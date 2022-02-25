import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule as ngFormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NbChatModule } from '@app/chat/chat.module';
import { WatchUserComponent } from '@app/pages/tables/watch-user/watch-user.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import {
  NbActionsModule,
  NbAlertModule,
  NbAutocompleteModule,
  NbBadgeModule,
  NbButtonModule,
  NbCalendarModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbDatepickerModule,
  NbDialogModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbPopoverModule,
  NbProgressBarModule,
  NbRadioModule,
  NbSelectModule,
  NbSpinnerModule,
  NbStepperModule,
  NbTabsetModule,
  NbTooltipModule,
  NbUserModule,
  NbWindowModule,
} from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgSelectModule } from '@ng-select/ng-select';
import { ShowcaseDialogComponent } from '@shared/components';
import { PhonePipe } from '@shared/pipes/phone.pipe';
import { AuthService } from '@shared/services';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TagInputModule } from 'ngx-chips';
import { ClipboardModule } from 'ngx-clipboard';

import { ActivityWatchersComponent } from './components/activity-watchers/activity-watchers.component';
import { AddRefComponent } from './components/add-ref/add-ref.component';
import { ChartFilterDialogComponent } from './components/chart-filter-dialog/chart-filter-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DateTimePickerComponent } from './components/date-time-picker/date-time-picker.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { DescriptionDialogComponent } from './components/description-dialog/description-dialog.component';
import { AdditionalFormDialogComponent } from './components/dialog/additional-form-dialog/additional-form-dialog.component';
import {
  ColumnDateTimeDialogComponent,
} from './components/dialog/column-date-time-dialog/column-date-time-dialog.component';
import { ColumnDropdownImageComponent } from './components/dialog/column-dropdown-image/column-dropdown-image.component';
import { ColumnOptionDialogComponent } from './components/dialog/column-option-dialog/column-option-dialog.component';
import { ColumnRollUpDialogComponent } from './components/dialog/column-roll-up-dialog/column-roll-up-dialog.component';
import { ColumnStatusComponent } from './components/dialog/column-status-dialog.component.ts/column-status-dialog.component';
import { FilterDialogComponent } from './components/dialog/filter-dialog/filter-dialog.component';
import { FormulaHelpDialogComponent } from './components/dialog/formula-help-dialog/formula-help-dialog.component';
import { InfoDialogComponent } from './components/dialog/info-dialog/info-dialog.component';
import { LookupDetailDialogComponent } from './components/dialog/lookup-detail-dialog/lookup-detail-dialog.component';
import { LookUpDialogComponent } from './components/dialog/lookup-dialog/lookup-dialog.component';
import { MapFieldDialogComponent } from './components/dialog/map-field-dialog/map-field-dialog.component';
import { PublishDialogComponent } from './components/dialog/publish-dialog/publish-dialog.component';
import {
  DynamicFormDialogNewDesignComponent,
} from './components/dynamic-form-dialog-new-design/dynamic-form-dialog-new-design.component';
import { DynamicFormDialogComponent } from './components/dynamic-form-dialog/dynamic-form-dialog.component';
import { DynamicSubformComponent } from './components/dynamic-form-dialog/dynamic-subform/dynamic-subform.component';
import { EmailDialogComponent } from './components/email-dialog/email-dialog.component';
import { EscapeDialogComponent } from './components/escape-dialog/escape-dialog.component';
import { FilePreviewDialogComponent } from './components/file-preview-dialog/file-preview-dialog.component';
import { NgxDocViewerModule } from './components/file-preview-dialog/modules';
import { FilterDataSaveComponent } from './components/filter-data-save/filter-data-save.component';
import { FilterFormulaPopupComponent } from './components/filter-formula-popup/filter-formula-popup.component';
import { FilterListingComponent } from './components/filter-listing/filter-listing.component';
import { HelpComponent } from './components/help/help.component';
import { LookupModalDetailComponent } from './components/lookup-modal-detail/lookup-modal-detail.component';
import { LookupModalComponent } from './components/lookup-modal/lookup-modal.component';
import { NewReminderModalComponent } from './components/new-reminder-modal/new-reminder-modal.component';
import { ReminderAlertComponent } from './components/reminder-alert/reminder-alert.component';
import { ReminderModalComponent } from './components/reminder-modal/reminder-modal.component';
import { SnoozeTimeComponent } from './components/snooze-time/snooze-time.component';
import { TaskCommentComponent } from './components/task-comment/task-comment.component';
import { NumberOnlyDirective } from './directive/number-only.directive';
import { FilterSelectedItemPipe, SameType } from './pipes';
import { DateCustomPipe } from './pipes/date.pipe';
import { DateFormatWithTimeZonePipe } from './pipes/dateFormatWithTimeZone.pipe';
import { DynamicFormDependenciesPipe } from './pipes/dynamic-form-dependency-filter.pipe';
import { CheckDependencyFilterPipe } from './pipes/filter-checked-dependencies.pipe';
import { FilterSelectedFieldPipe } from './pipes/filter-selected-field-dependency.pipe';
import { FilterSubFormLookupPipe } from './pipes/filter-selected-subForm-lookup.pipe';
import { FilterSubFormLookupFieldsPipe } from './pipes/filter-subform-lookup-fields.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { FirstLetterOfWords } from './pipes/first-letter-of-words';
import { HelpPipe } from './pipes/help.pipe';
import { NewLineTextPipe } from './pipes/new-line-text-pipe';
import { NewValue } from './pipes/new-value.pipe';
import { NormalTextPipe } from './pipes/normal-text.pipe';
import { PluralizePipe } from './pipes/pluralize.pipe';
import { ReversePipe } from './pipes/reverse.pipe';
import { SanitizePipe } from './pipes/sanitize.pipe';
import { SearchStatusOptionsPipe } from './pipes/searchStatusOptions.pipe';
import { SubFormPipe } from './pipes/subForm.pipe';
import { TaskfilterPipe } from './pipes/taskfilter.pipe';
import { FilterTabsPipe } from './pipes/filter-tabs.pipe';


const materialModules = [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatRadioModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatExpansionModule,
];
const ENTRY_COMPONENTS = [
  EmailDialogComponent,
  ColumnOptionDialogComponent,
  DynamicFormDialogComponent,
  DynamicFormDialogNewDesignComponent,
  DynamicSubformComponent,
  DeleteDialogComponent,
  ConfirmDialogComponent,
  EscapeDialogComponent,
  FilterFormulaPopupComponent,
  LookUpDialogComponent,
  MapFieldDialogComponent,
  AdditionalFormDialogComponent,
  FilePreviewDialogComponent,
  FilterDataSaveComponent,
  ColumnStatusComponent,
  LookupModalComponent,
  LookupModalDetailComponent,
  LookupDetailDialogComponent,
  DescriptionDialogComponent,
  TaskCommentComponent,
  ChartFilterDialogComponent,
  ReminderModalComponent,
  NewReminderModalComponent,
  ActivityWatchersComponent
];
@NgModule({
  declarations: [
    FilterPipe,
    SubFormPipe,
    HelpPipe,
    FilterSubFormLookupPipe,
    FilterSubFormLookupFieldsPipe,
    SearchStatusOptionsPipe,
    DateFormatWithTimeZonePipe,
    FilterSelectedFieldPipe,
    CheckDependencyFilterPipe,
    DynamicFormDependenciesPipe,
    FilterSelectedItemPipe,
    SearchStatusOptionsPipe,
    SameType,
    NewValue,
    DateCustomPipe,
    AdditionalFormDialogComponent,
    NormalTextPipe,
    ShowcaseDialogComponent,
    LookUpDialogComponent,
    MapFieldDialogComponent,
    ColumnOptionDialogComponent,
    DynamicFormDialogComponent,
    DynamicFormDialogNewDesignComponent,
    DeleteDialogComponent,
    EscapeDialogComponent,
    FilterFormulaPopupComponent,
    ConfirmDialogComponent,
    ReversePipe,
    FilePreviewDialogComponent,
    FilterDataSaveComponent,
    NewLineTextPipe,
    EmailDialogComponent,
    ColumnStatusComponent,
    FirstLetterOfWords,
    LookupModalComponent,
    LookupDetailDialogComponent,
    TaskfilterPipe,
    DescriptionDialogComponent,
    TaskCommentComponent,
    DateTimePickerComponent,
    ChartFilterDialogComponent,
    ColumnDateTimeDialogComponent,
    HelpComponent,
    InfoDialogComponent,
    WatchUserComponent,
    ReminderModalComponent,
    PluralizePipe,
    PhonePipe,
    DynamicSubformComponent,
    NumberOnlyDirective,
    FilterDialogComponent,
    ColumnRollUpDialogComponent,
    FilterFormulaPopupComponent,
    FormulaHelpDialogComponent,
    SanitizePipe,
    ColumnDropdownImageComponent,
    AddRefComponent,
    AddRefComponent,
    FilterListingComponent,
    LookupModalDetailComponent,
    NewReminderModalComponent,
    SnoozeTimeComponent,
    PublishDialogComponent,
    ReminderAlertComponent,
    ActivityWatchersComponent,
    FilterTabsPipe,
    //ViewLookupInDialogComponent,
  ],
  imports: [
    NbChatModule,
    CommonModule,
    ClipboardModule,
    ReactiveFormsModule,
    HttpClientModule,
    NbTabsetModule,
    NbCardModule,
    NbSpinnerModule,
    NbButtonModule,
    DragDropModule,
    NbPopoverModule,
    NbIconModule,
    NbInputModule,
    Ng2SmartTableModule,
    NbCheckboxModule,
    NbRadioModule,
    NbActionsModule,
    NbUserModule,
    NbDatepickerModule,
    NbSelectModule,
    ngFormsModule,
    NgxMatDatetimePickerModule,
    NbDialogModule.forChild(),
    NbWindowModule.forChild(),
    NbTooltipModule,
    TagInputModule,
    EditorModule,
    NbAutocompleteModule,
    NbProgressBarModule,
    NbCalendarModule,
    NbListModule,
    MatIconModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    NgxDocViewerModule,
    ...materialModules,
    NgbModule,
    NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule,
    NbBadgeModule,
    NbStepperModule,
    MatMenuModule,
    NbContextMenuModule,
    MatExpansionModule,
    NgSelectModule,
    NgOptionHighlightModule,
    CodemirrorModule,
    NbAlertModule
  ],
  exports: [
    NgbModule,
    HelpPipe,
    NewValue,
    FilterPipe,
    SubFormPipe,
    FilterTabsPipe,
    FilterSubFormLookupPipe,
    ActivityWatchersComponent,
    FilterSubFormLookupFieldsPipe,
    SearchStatusOptionsPipe,
    DateFormatWithTimeZonePipe,
    FilterSelectedFieldPipe,
    CheckDependencyFilterPipe,
    DynamicFormDependenciesPipe,
    FilterSelectedItemPipe,
    SearchStatusOptionsPipe,
    SameType,
    DateCustomPipe,
    NormalTextPipe,
    ReversePipe,
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgOptionHighlightModule,
    CodemirrorModule,
    HttpClientModule,
    NbContextMenuModule,
    NbTabsetModule,
    NbCardModule,
    NbSpinnerModule,
    ClipboardModule,
    NbButtonModule,
    NbDialogModule,
    NbPopoverModule,
    NbWindowModule,
    NbIconModule,
    NbInputModule,
    Ng2SmartTableModule,
    NbCheckboxModule,
    NbRadioModule,
    NbActionsModule,
    NbUserModule,
    NbDatepickerModule,
    NbSelectModule,
    ngFormsModule,
    NgxMatDatetimePickerModule,
    NbTooltipModule,
    NbAutocompleteModule,
    NbProgressBarModule,
    NbListModule,
    EditorModule,
    NbCalendarModule,
    MatIconModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    NewLineTextPipe,
    ...materialModules,
    FirstLetterOfWords,
    LookupDetailDialogComponent,
    TaskfilterPipe,
    DescriptionDialogComponent,
    NbBadgeModule,
    HelpComponent,
    WatchUserComponent,
    EscapeDialogComponent,
    FilterFormulaPopupComponent,
    NbStepperModule,
    DateTimePickerComponent,
    ReminderModalComponent,
    NewReminderModalComponent,
    PluralizePipe,
    LookupModalDetailComponent,
    NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule,
    SanitizePipe,
    DynamicFormDialogNewDesignComponent
  ],
  providers: [
    HelpPipe,
    FilterPipe,
    SanitizePipe,
    SubFormPipe,
    NormalTextPipe,
    ReversePipe,
    AuthService,
    NewLineTextPipe,
    NewValue,
    FirstLetterOfWords,

    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class SharedModule {
}
