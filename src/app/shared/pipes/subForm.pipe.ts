import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "subFormFilter",
})
export class SubFormPipe implements PipeTransform {
  transform(value: any, data:any , field:any): any {

    let col;
    data.forEach(ele=>{
        if(ele.name == field){
            col = ele;
        }
    })
    if(col){
      value = value.filter(element => {
        if(element.value == col.subFormTableName)
        return true;
    });

    }

    return value;
  }
}
