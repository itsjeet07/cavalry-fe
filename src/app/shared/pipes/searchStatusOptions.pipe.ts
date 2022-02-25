import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "searchStatusOptions" })
export class SearchStatusOptionsPipe implements PipeTransform {
  transform(option: any,item) {
    if (option && option.length && item) {
      return option.filter(ele => ele.status.toUpperCase().indexOf(item.toUpperCase()) != -1);
    } else {
      return option;
    }
  }
}
