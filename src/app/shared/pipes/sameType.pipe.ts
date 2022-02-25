import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "sameType",pure:true })
export class SameType implements PipeTransform {
  transform(currentTableDataList: any,selected:any,lookUpItemList:any) {
    if (lookUpItemList && lookUpItemList.length && selected && currentTableDataList.length) {
      let list =  [];
      list = lookUpItemList.filter(a=>{
        if(a.name == selected){
          return true;
        }
        else{
          return false;
        }
      });
      return currentTableDataList.filter(
        a => {
            if(list && list.length && a.type == list[0].type){
                return true;
            }
            else{
                return false;
            }
        }
      );
    } else {
      return currentTableDataList;
    }
  }
}
