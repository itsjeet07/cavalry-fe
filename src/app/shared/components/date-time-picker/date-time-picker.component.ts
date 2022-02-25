import {
  Component,
  OnInit,
  Input,
  forwardRef,
  ViewChild,
  AfterViewInit,
  Injector
} from "@angular/core";
import {
  NgbTimeStruct,
  NgbDateStruct,
  NgbPopoverConfig,
  NgbPopover,
  NgbDatepicker
} from "@ng-bootstrap/ng-bootstrap";
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  NgControl
} from "@angular/forms";
import { DatePipe } from "@angular/common";
import { DateTimeModel } from "./date-time.model";
import { BehaviorSubject, noop } from "rxjs";
import { TableService } from "@app/shared/services/table.service";
import { DateCustomPipe } from "../../pipes/date.pipe";

@Component({
  selector: "app-date-time-picker",
  templateUrl: "./date-time-picker.component.html",
  styleUrls: ["./date-time-picker.component.scss"],
  providers: [
    DatePipe,
    DateCustomPipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true
    }
  ]
})
export class DateTimePickerComponent
  implements ControlValueAccessor, OnInit, AfterViewInit {
  @Input()
  dateString: string;

  @Input()
  inputDatetimeFormat = "M/d/yyyy H:mm";
  @Input()
  hourStep = 1;
  @Input()
  minuteStep = 15;
  @Input()
  secondStep = 30;
  @Input()
  seconds = false;

  @Input()
  disabled = false;

  minDate;
  currentDate;


  private showTimePickerToggle = false;

  public datetime: DateTimeModel = new DateTimeModel();
  private firstTimeAssign = true;
  dateTimePickerFocused = false;

  // @ViewChild(NgbDatepicker, { static: true })
  // private dp: NgbDatepicker;

  @ViewChild(NgbPopover, { static: true })
  private popover: NgbPopover;

  private onTouched: () => void = noop;
  private onChange: (_: any) => void = noop;

  public ngControl: NgControl;

  constructor(private config: NgbPopoverConfig, private inj: Injector, private tableService: TableService) {
    config.autoClose = "outside";
    config.placement = "auto";
    this.currentDate = new Date();
    this.minDate = { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1, day: this.currentDate.getDate() };
  }

  ngOnInit(): void {
    this.ngControl = this.inj.get(NgControl);
  }

  ngAfterViewInit(): void {
    let isDateTime = Object.keys(this.datetime).length;
    if(isDateTime){
      this.focusChanged(true);
    }
    this.popover.hidden.subscribe($event => {
      this.showTimePickerToggle = false;
    });
  }

  writeValue(newModel: string) {
    if (newModel) {
      this.datetime = Object.assign(
        this.datetime,
        DateTimeModel.fromLocalString(newModel)
      );
      this.dateString = newModel;
      this.setDateStringModel();
    } else {
      this.datetime = new DateTimeModel();
    }
  }

  close(){
    this.popover.hidden.subscribe($event => {
      this.showTimePickerToggle = false;
    });
    return false;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleDateTimeState($event) {
    this.showTimePickerToggle = !this.showTimePickerToggle;
    $event.stopPropagation();
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange($event: any) {
    const value = $event.target.value;
    const dt = DateTimeModel.fromLocalString(value);

    if (dt) {
      this.datetime = dt;
      this.setDateStringModel();
    } else if (value.trim() === "") {
      this.datetime = new DateTimeModel();
      this.dateString = "";
      this.onChange(this.dateString);
    } else {
      this.onChange(value);
    }
  }

  onDateChange($event: string | NgbDateStruct, dp: NgbDatepicker) {
    this.focusChanged(true);
    const date = new DateTimeModel($event);

    if (!date) {
      this.dateString = this.dateString;
      return;
    }

    if (!this.datetime) {
      this.datetime = date;
    }

    this.datetime.year = date.year;
    this.datetime.month = date.month;
    this.datetime.day = date.day;

    const adjustedDate = new Date(this.datetime.toString());
    if (this.datetime.timeZoneOffset !== adjustedDate.getTimezoneOffset()) {
      this.datetime.timeZoneOffset = adjustedDate.getTimezoneOffset();
    }

    this.setDateStringModel();
  }

  onTimeChange(event: NgbTimeStruct) {
    if(event){
      if(this.datetime){
        this.datetime.hour = event.hour;
        this.datetime.minute = event.minute;
        this.datetime.second = event.second;
        this.setDateStringModel();
      }
    }
  }

  setDateStringModel() {
    this.dateString = this.datetime.toString();

    if (!this.firstTimeAssign) {
      this.onChange(this.dateString);
    } else {
      // Skip very first assignment to null done by Angular
      if (this.dateString !== null) {
        this.firstTimeAssign = false;
        this.onChange(this.dateString);
      }
    }
  }

  inputBlur($event) {
    this.onTouched();
  }

  focusChanged(isFocusIn){
    let isDateTime = Object.keys(this.datetime).length;
    if(isFocusIn || isDateTime){
      this.dateTimePickerFocused = true;
      this.tableService.dateTimePickerFocused.next(this.dateTimePickerFocused);
    } else {
      this.dateTimePickerFocused = false;
      this.tableService.dateTimePickerFocused.next(this.dateTimePickerFocused);
    }
  }
}
