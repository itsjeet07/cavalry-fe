import { Pipe, PipeTransform } from '@angular/core';
import {isString} from 'util';

@Pipe({
  name: 'firstLetterOfWords',
})

export class FirstLetterOfWords implements PipeTransform {

  transform(value: string): string {
    if (value) {
      if (typeof value === 'object') {
        value = value['firstName'] + ' ' + value['lastName'];
        return value.toUpperCase().toString().match(/\b(\w)/g).join('');
      } else {
        return value.toUpperCase().toString().match(/\b(\w)/g).join('');
      }
    } else {
      return value;
    }
  }

}
