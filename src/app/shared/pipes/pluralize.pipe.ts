import { Pipe, PipeTransform } from '@angular/core';
import { NgPluralizeService } from 'ng-pluralize';

@Pipe({
  name: 'pluralize'
})
export class PluralizePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    const pluralize = new NgPluralizeService();
    return pluralize.fromCount(value,2,false);
  }

}
