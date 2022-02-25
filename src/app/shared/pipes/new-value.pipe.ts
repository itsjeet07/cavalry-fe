import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "NewValue",
  pure: false
})
export class NewValue implements PipeTransform {
  transform(srcOptions: any[], checked: any[]): any[] {
    return srcOptions.filter(function(item) {
      if (typeof item == "string") {
        return !checked.includes(item);
      } else if (typeof item == "object") {
        return !checked.includes(item.status);
      }
    });
  }
}
