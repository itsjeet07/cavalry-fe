import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskfilter',
})
export class TaskfilterPipe implements PipeTransform {

  transform(value: any, args?: any): unknown {
    value = value.filter(function (search) {
       return search.firstName.toLowerCase().indexOf(args.toLowerCase()) > -1;
    });
    return value;
  }

}
