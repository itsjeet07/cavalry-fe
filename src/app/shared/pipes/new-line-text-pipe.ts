import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newLineText',
})

export class NewLineTextPipe implements PipeTransform {

  transform(value: string): string {
    return  value.toString().replace(/,/g, '\n');
  }

}
