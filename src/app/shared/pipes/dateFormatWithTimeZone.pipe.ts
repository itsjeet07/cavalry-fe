import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common'
import * as moment from 'moment';

@Pipe({ name: 'dateFormatWithTimeZone' })
export class DateFormatWithTimeZonePipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {

  }

  transform(input: any, type: any) {

    if (input) {
      let d = new Date(input);
      let startDate = moment().startOf('week');
      let endDate = moment().endOf('week');
      let startDateNumber = startDate.date();
      let endDateNumber = endDate.date();
      let currentDate = moment().date(d.getDate());
      let currentDateNumber = currentDate.date();
      let date;
      let presentDate = moment().date(new Date().getDate());
      let presentDateNumber = presentDate.date();
      if (type == "date") {

        let finaldate;
        if (presentDateNumber == currentDateNumber) {
          finaldate = 'Today';
          return finaldate;
        } else if (currentDateNumber >= startDateNumber && currentDateNumber <= endDateNumber) {
          date = new DatePipe('en-US').transform(d, 'EEEE');
          finaldate = date;
          return finaldate;
        }
        else {
          let d = new Date(input);
          // d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );
          finaldate = this.datePipe.transform(d, "M/d/yy");
          return finaldate;
        }
      }
      else if (type == "dateTime") {

        let finaldate;
        if (presentDateNumber == currentDateNumber) {
          date = new DatePipe('en-US').transform(d, 'h:mm a');
          finaldate = 'Today' + ' ' + date;
          return finaldate;
        }
        else {
          let d = new Date(input);
          // d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );
          finaldate = this.datePipe.transform(d, "M/d/yy, h:mm a");
          return finaldate;
        }

      }
      else {
        return input;
      }
    }
    else {
      return "";
    }

  }
}
