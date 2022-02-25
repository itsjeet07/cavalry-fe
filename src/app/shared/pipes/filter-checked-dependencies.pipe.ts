import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "checkDependencyFilter" })
export class CheckDependencyFilterPipe implements PipeTransform {
  transform(option: any, queryList, columnName) {
    if (option && queryList && columnName && queryList[columnName]) {
      return queryList[columnName].indexOf(option) > -1;
    } else {
      return false;
    }
  }
}
