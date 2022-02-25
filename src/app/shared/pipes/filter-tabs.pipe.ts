import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTabs'
})
export class FilterTabsPipe implements PipeTransform {

  transform(value: any[], tablesMenu: any[]) {

    let final = [];
    if (value && value.length && tablesMenu && tablesMenu.length) {
      value.forEach(ele => {
        tablesMenu.forEach(item => {
          if (item.tableName == ele[0]) {
            final.push(ele);
          }
        })
      })

      return final;
    } else {
      return value;
    }
  }

}
