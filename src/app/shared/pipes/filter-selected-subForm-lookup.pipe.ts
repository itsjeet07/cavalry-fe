import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "filterSubFormLookup" })
export class FilterSubFormLookupPipe implements PipeTransform {
  transform(lookup: any, currentlookup ,selectedLookup, refreshCount) {
    if (lookup && lookup.length && selectedLookup) {
      return lookup.filter(
        a => selectedLookup.findIndex(v => v.tableName == a._id) == -1 || a._id == currentlookup)
    }else{
      return lookup;
    }
  }
}
