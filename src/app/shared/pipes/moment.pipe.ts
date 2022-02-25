import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(value: any, dateformat: string, language? : string, nonUtc = false  ): any {
    let momentInstance = (value ? moment(value, 'YYYY-MM-DD h:mm:ss a') : moment());    
    if(language) {
      momentInstance = momentInstance.locale(language);
    }
    return momentInstance.format(dateformat).replace('.','');
  }
}
