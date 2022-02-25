import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "filterSubFormLookupFields" })
export class FilterSubFormLookupFieldsPipe implements PipeTransform {
  transform(subFormLookupFields: any, selectedSubFormLookup, refreshCounter) {
    if (subFormLookupFields && subFormLookupFields.length && selectedSubFormLookup) {
      let l = subFormLookupFields.filter(f => f.lookupTableName == selectedSubFormLookup);
      if(l.length){
        return l;
      }
      return [];
    } else {
      return [];
    }
  }
}
