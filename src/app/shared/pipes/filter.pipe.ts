import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filter",
})
export class FilterPipe implements PipeTransform {
  transform(value: any, args?: any, refreshFilterString?): any {
    if (value && value.length && refreshFilterString) {
      if(args){
        value = value.filter(
          (a) =>
            a.value.toLowerCase().indexOf(refreshFilterString) > -1 ||
            args.findIndex((f) => a.id == f.id) > -1
        );
  
      }
      else{
        value = value.filter(
          (a) =>
            a.value.toLowerCase().indexOf(refreshFilterString) > -1
        );
  
      }
    }

    return value;
  }
}
