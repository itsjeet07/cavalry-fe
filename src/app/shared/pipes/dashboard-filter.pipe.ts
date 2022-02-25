import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filterDashboard',
})
export class FilterDashboardPipe implements PipeTransform {
  transform(value: any[], searchText: string): any[] {
    if (!value) return [];
    if (!searchText) {
      return value;
    }

    return value.filter((el) => {
      return (
        (el.subject.toUpperCase().indexOf(searchText.toUpperCase()) != -1) ||
        (el.dueDate.toString().toUpperCase().indexOf(searchText.toUpperCase()) != -1) ||
        (el.status.toUpperCase().indexOf(searchText.toUpperCase()) != -1)
      );
    });
  }
}
