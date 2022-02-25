import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'helpPipe',
})
export class HelpPipe implements PipeTransform {

  transform(tutorials: any, fieldName?: any): any {

    const index = tutorials.findIndex(x => x.fieldName == fieldName);

    if(index > -1){
      return tutorials[index];
    }else{
      return false;
    }
  }
}
