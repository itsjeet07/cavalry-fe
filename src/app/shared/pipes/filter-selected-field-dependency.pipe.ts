import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "filterOutSelectedField" })
export class FilterSelectedFieldPipe implements PipeTransform {
  transform(inputFieldList: any, soruceColumnType) {
    if (soruceColumnType) {
      return inputFieldList.filter(
        a => (a._id != soruceColumnType && a.type != "lookup")
      );
    } else {
      return inputFieldList;
    }
  }
}
