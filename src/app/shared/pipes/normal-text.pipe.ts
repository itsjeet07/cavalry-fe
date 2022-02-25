import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'normalText',
})
export class NormalTextPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); });
  }

}
