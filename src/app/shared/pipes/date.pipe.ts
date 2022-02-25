import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from '@angular/common';
import * as moment from "moment";
@Pipe({
  name: "dateCustomPipe"
})
export class DateCustomPipe implements PipeTransform {
  transform(value: any): any {
    if (value) {
      let d = new Date(value);
      let hh = d.getHours();
      let m: any = d.getMinutes();
      let s: any = d.getSeconds();
      let dd = "AM";
      let h = hh;
      if (h >= 12) {
        h = hh - 12;
        dd = "PM";
      }
      if (h == 0) {
        h = 12;
      }
      m = m < 10 ? "0" + m : m;

      s = s < 10 ? "0" + s : s;
      let startDate = moment().startOf('week');
      let endDate = moment().endOf('week');
      let startDateNumber = startDate.date();
      let endDateNumber = endDate.date();
      let currentDate = moment().date(d.getDate());
      let currentDateNumber = currentDate.date();
      let date;
      let presentDate = moment().date(new Date().getDate());
      let presentDateNumber = presentDate.date();

      if(presentDateNumber == currentDateNumber){
        date = new DatePipe('en-US').transform(d, 'M/d/yyyy');
        let replacement = h + ":" + m;

        replacement += " " + dd;
        value = 'Today' + ' ' + replacement;
      }
      else if (currentDateNumber >= startDateNumber && currentDateNumber <= endDateNumber) {
        date = new DatePipe('en-US').transform(d, 'EEEE M/d/yyyy');

        let replacement = h + ":" + m;

        replacement += " " + dd;
        value = date + ' ' + replacement;
      }
      else {
        date = new DatePipe('en-US').transform(d, 'M/d/yyyy');
        let replacement = h + ":" + m;

        replacement += " " + dd;
        value = date + ' ' + replacement;
      }

    }
    return value;
  }
}
