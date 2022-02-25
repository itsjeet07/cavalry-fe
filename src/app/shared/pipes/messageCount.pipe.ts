import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'messageCount',
})
export class MessageCountPipe implements PipeTransform {

  transform(value): string {
    if(Number(value) >= 20){
      return '20+';
    }
    return value;
  }

}
