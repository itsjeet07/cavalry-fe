import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "dynamicFormDependenciesFilter", pure: true })
export class DynamicFormDependenciesPipe implements PipeTransform {
  dependencyHit = false;
  transform(
    options: any,
    dependencies: any,
    field,
    formData,
    count,
    columns,
    lookupValues,
    recordType,
    parentTableName?
  ) {
    let allQueries = [];
    let formValues;
    if (formData) {
      formValues = formData.value ? formData.value : formData;
    }

    let showUndependentOptions = false;
    let newUniqueList = [];
    let dependencyFound: boolean = false;
    let isDependencyOptions: boolean = false;
    options = options ? options : [];
    newUniqueList = [...options];

    //check if any dependency exist for current field..
    dependencies.forEach((element) => {
      let keys = Object.keys(element.query);
      if (keys.indexOf(field.name) > -1) {
        dependencyFound = true;
      }
    });

    //if dependency found for current field..
    if (dependencyFound) {
      for (let i = 0; i < dependencies.length; i++) {

        //for status field on tasks page, without parentDetails
        if(!formValues){
          let keys = Object.keys(dependencies[i].query);
          if(keys){
            let key = keys.filter(k=> k == field.name);
            if(key.length > 0){
              let idx = dependencies[i].fields.findIndex(f=>f == 'Null');
              if(idx > -1){
                newUniqueList = this.setOptions(
                  dependencies[i],
                  field,
                  options
                );
              }
            }
          }
          if (this.dependencyHit) {
            this.dependencyHit = false;
            return newUniqueList;
          }
          continue;
        }else{
          //for type other than recordType..
          if (dependencies[i].srcFieldType != "recordType") {
            if(parentTableName && dependencies[i].srcFieldType == 'lookup'){
              let lookupName = parentTableName.toLowerCase()+"lookup";
              if(dependencies[i].srcFieldName == lookupName && dependencies[i].fields[0] == 'Not Null'){
                newUniqueList = this.setOptions(
                  dependencies[i],
                  field,
                  options
                );
              }
              if (this.dependencyHit) {
                this.dependencyHit = false;
                return newUniqueList;
              }
              continue;
            }


            let keys = Object.keys(dependencies[i].query);
            let index = keys.indexOf(field.name);
            if (index > -1) {
              newUniqueList = [];
              if (dependencies[i].srcFieldType == "checkbox") {
                //if dependency fields contains NULL
                if (
                  dependencies[i].fields.filter((f) => f == "Null") &&
                  !formValues[dependencies[i].srcFieldName]
                ) {
                  newUniqueList = this.setOptions(
                    dependencies[i],
                    field,
                    options
                  );
                } else {

                  //if checkbox get selected options by separating by comma
                  let srcOptions = formValues[dependencies[i].srcFieldName].split(
                    ","
                  );
                  if (srcOptions && srcOptions.length) {
                    for (let option of srcOptions) {
                      let hit = dependencies[i].fields.filter((f) => f == option);
                      if (hit.length) {
                        newUniqueList = this.setOptions(
                          dependencies[i],
                          field,
                          options
                        );
                      }
                    }
                  }
                }
              }
              //for src field other than lookup
              else if (dependencies[i].srcFieldType != "lookup") {
                //if dependency fields comntains NULL.
                if (
                  dependencies[i].fields.filter((f) => f == "Null") &&
                  !formValues[dependencies[i].srcFieldName]
                ) {
                  newUniqueList = this.setOptions(
                    dependencies[i],
                    field,
                    options
                  );
                } else {
                  //if Not Null and form contains value available in dependency fields.
                  for (let srcOption of dependencies[i].fields) {
                    if (srcOption == formValues[dependencies[i].srcFieldName]) {
                      //get dependency query options.
                      newUniqueList = this.setOptions(
                        dependencies[i],
                        field,
                        options
                      );
                    }
                  }
                }
              }
              //for lookups
              else if (dependencies[i].srcFieldType == "lookup") {
                //if dependency fields contains NULL
                if (dependencies[i].fields[0] == "Null") {
                  let hit = formValues["lookup"] && formValues["lookup"].filter(
                    (f) => f.lookupName == dependencies[i].srcFieldName
                  );
                  if (hit && hit.length == 0) {
                    newUniqueList = this.setOptions(
                      dependencies[i],
                      field,
                      options
                    );
                  }
                }
                //if dependency fields contains NOT NULL
                else if (dependencies[i].fields[0] == "Not Null") {
                  let hit = formValues.lookup && formValues.lookup.filter(
                    (f) => f.lookupName == dependencies[i].srcFieldName
                  );
                  if (hit && hit.length > 0) {
                    newUniqueList = this.setOptions(
                      dependencies[i],
                      field,
                      options
                    );
                  }
                }
              }
            }
            if (this.dependencyHit) {
              this.dependencyHit = false;
              return newUniqueList;
            }
            continue;
          }

          //for recordType as src field in dependency..
          let keys = Object.keys(dependencies[i].query);
          if (keys.indexOf(field.name) > -1) {
            for (let j = 0; j < keys.length; j++) {
              //if dependency query contains currentfield -> dependency exist or not
              if (keys[j] == field.name) {
                dependencies[i].fields.forEach((element) => {
                  let field1 = columns.filter(
                    (f) => f.name == dependencies[i].srcFieldName
                  );
                  if (field1.length > 0) {
                    dependencies[i].query[keys[j]].forEach((element) => {
                      allQueries.push(element);
                    });

                    showUndependentOptions = dependencies[i].showUndependent;
                    if (!lookupValues && recordType) {
                      if (recordType == element) {
                        newUniqueList = [];
                        isDependencyOptions = true;
                        dependencies[i].query[keys[j]].forEach((insert) => {
                          let isOptionFound = options.filter(
                            (o) => o.status === insert
                          );
                          if (isOptionFound.length == 1)
                            newUniqueList.push(isOptionFound[0]);
                        });
                      } else {
                        if (showUndependentOptions && !isDependencyOptions) {
                          allQueries.forEach((q) => {
                            let idx = newUniqueList.indexOf(q);
                            if (idx > -1 && newUniqueList.length) {
                              newUniqueList.splice(idx, 1);
                            }
                          });
                        }
                      }
                    }
                  }
                });
                //return newUniqueList;
              }
            }
          }
        }

      }
      if (!isDependencyOptions) {
        if (!showUndependentOptions) newUniqueList = [];
      }
    } else {
      newUniqueList = [...options];
    }
    return newUniqueList;
  }

  setOptions(dependency, field, options): any {
    let list = [];
    if (!this.dependencyHit) {
      //append all options according to dependency from query...
      dependency.query[field.name].forEach((element) => {
        let item = options.filter((f) => (f.status ? f.status : f) == element);
        if (item) {
          list.push(item[0]);
        }
      });
      this.dependencyHit = true;
      return list;
    }
  }
}
