import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "filterOutSubFormFieldsFromDynamicForm" })
export class FilterSubFormFieldsFromDynamicFormPipe implements PipeTransform {
  transform(inputFieldList: any, subFormFields, refreshCounter) {
    if (inputFieldList && subFormFields && subFormFields.length) {
      return inputFieldList.filter(
        a => subFormFields.findIndex(v => v._id == a._id) == -1
      );
    } else {
      return inputFieldList;
    }
  }
}
