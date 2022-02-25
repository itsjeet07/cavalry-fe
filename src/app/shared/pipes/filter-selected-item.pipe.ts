import { V } from "@angular/cdk/keycodes";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "filterOutSelectedItem" })
export class FilterSelectedItemPipe implements PipeTransform {
  transform(lookUpList: any,selectedList:any,index:any) {
    if (lookUpList && selectedList && lookUpList.length && selectedList.length) {
      return lookUpList.filter(
        a => selectedList.findIndex(v => v.lookupField == a.name) == -1 || selectedList[index].lookupField == a.name
      );
    } else {
      return lookUpList;
    }
  }
}
