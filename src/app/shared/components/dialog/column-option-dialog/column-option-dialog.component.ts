import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NbComponentStatus, NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import 'codemirror/mode/htmlmixed/htmlmixed';
import { HelpComponent } from '../../help/help.component';
import { FormulaHelpDialogComponent } from '../formula-help-dialog/formula-help-dialog.component';

@Component({
  selector: 'ngx-column-option-dialog',
  templateUrl: 'column-option-dialog.component.html',
  styleUrls: ['column-option-dialog.component.scss'],
})
export class ColumnOptionDialogComponent implements OnInit{
  @Input() items = [];
  @Input() isSelected='';
  @Input() columnType='';
  options = [];
  values = [];
  defVal='';
  defaultValueChip=[];
  codeMirrorConfig = {
    lineNumbers: true,
    mode: "htmlmixed",
    lineWrapping: false,
    theme: 'monokai'
  };
  showHelp = false;
  public formulas = ["String", "Number", "Date", "Radio"];
  constructor(
    protected ref: NbDialogRef<ColumnOptionDialogComponent>,
    protected dialogService:NbDialogService,
    private cdr: ChangeDetectorRef,
    private nbToastrService : NbToastrService,
  ) {

  }
  ngOnInit(): void {
    if(this.columnType && this.columnType == 'formula'){
      if(!this.items || (this.items && !this.items.length)){
        this.items = [{type:null, formula:null, alsoAFrontEndFormula: false}];
      }
    }

  }

  ngAfterViewInit(): void {
    if(this.isSelected){
      this.defaultValueChip.push(this.isSelected);
    }
    if (this.items) {
      this.items.forEach(element => {
        this.options.push({ display: element, value: element });
      });
    }
    console.log(this.isSelected);
    this.cdr.detectChanges();
  }


  cancel() {
    this.ref.close();
  }

  onItemAdded(event) {
    // this.values.push(event.value);
  }

  submit() {
    if(this.columnType && this.columnType == 'formula'){
      this.values = this.items;
    }else{
      this.options.forEach(elements => {
        this.values.push(elements.value);
      });
    }
      let optionsObj={
        options:this.values,
        defaultVal:this.isSelected
      }
      this.ref.close(optionsObj);
      console.log('is ',optionsObj);

  }
  public onSelect(item) {
    if(item.value==this.isSelected){
      this.isSelected='';
    }else{
     this.isSelected=item.value;}
  }

  validateFormula(){
    let status = <NbComponentStatus>'warning';

    if(this.columnType == 'formula' && this.items[0].alsoAFrontEndFormula && this.items[0].formula.includes('lookup')){
      this.nbToastrService.show('Formula Validated','This formula is not supported for frontend, beause forntend does not support lookup info.',{status})
    }else{
      status = 'success'
      this.nbToastrService.show('Formula Validated','Formula looks good!',{status});
    }
  }

  showHelpModal(){
    let dialogData = 'This is formula HTML';
    this.dialogService.open(FormulaHelpDialogComponent,{ context: dialogData})
  }
}
