import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { TableService } from '@app/shared/services/table.service';
import * as JSZip from 'jszip';
import { FileSaverService } from 'ngx-filesaver';
import { combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'ngx-export-table',
  templateUrl: './export-table.component.html',
  styleUrls: ['./export-table.component.scss']
})
export class ExportTableComponent implements OnInit {
  @Input() source: any = [];
  public tableList = [];
  form: FormGroup;
  formSubmitted = false;
  selectedTables = [];
  lookupsTable = [];
  selectedLookupsTable = [];
  events = [];
  loadingAPI = false;
  tableFields = []
  constructor(private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
    private tableService: TableService,
    protected ref: NbDialogRef<ExportTableComponent>,
    private fileSaverService: FileSaverService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      table: ['', [Validators.required]]
    });
    this.setTableList();
  }

  setTableList() {
    if (this.source && this.source.data) {
      this.tableList = this.source.data.filter(({ displayInMenu }) => displayInMenu);
    }
  }
  onCancel() {
    this.ref.close(true);
  }

  compareFn(c11: any, c22: any): boolean {
    return c11 && c22 ? c11.id === c22.id : c11 === c22;
  }

  updatedVal(event) {

  }

  onSelectionChange() {

  }

  addSubForm() {

  }

  addLookUp() {
    this.lookupsTable = [];
    this.selectedLookupsTable.forEach(({ tableName }) => {
      this.selectedTables.push(tableName)
    })
  }

  save() {
    this.formSubmitted = true;
    if (this.form.valid) {
      if (this.form.value.table.subFormLookups && this.form.value.table.subFormLookups.length > 0) {
        const dialogData = {
          title: 'Lookups to other table(s) exist',
          text: 'You want include the lookup tables in export file ?',
          exportButton: true
        };
        this.dialogService.open(ConfirmDialogComponent, { context: dialogData }).onClose.subscribe(data => {
          this.selectedTables.push(this.form.value.table.tableName)
          if (data === 'Yes & Next') {
            this.selectedLookupsTable = this.form.value.table.subFormLookups;
            this.addLookUp();
          } else if (data === 'Choose manual') {
            this.lookupsTable = this.form.value.table.subFormLookups;
          }
        })
      } else {
        this.selectedTables.push(this.form.value.table.tableName)
      }
    }
  }

  reset() {
    this.formSubmitted = false;
    this.form.reset();
    this.selectedTables = [];
    this.lookupsTable = [];
    this.tableFields = [];
    this.selectedLookupsTable = [];
  }

  export() {
    const tableAPi = [];
    this.selectedTables.forEach((tableName) => {
      tableAPi.push(this.tableService.tableSchema(tableName));
    })
    combineLatest(tableAPi).pipe(
      map((tables) => tables.map(({ data }) => data && data[0])),
      switchMap((tables) => {
        const eventsCall = []
        tables.forEach((table) => {
          eventsCall.push(this.tableService.getAllEmailEvents(table._id).pipe(
            map(({ data }: any) => data && data.map(({ event, type }) => ({...event, type})))
          ))
        })
        return combineLatest([of(tables), ...eventsCall])
      })
    ).subscribe((data: any) => {
      this.tableFields = data[0].map(({ columns }) => columns);
      this.selectedTables = data[0].map((table) => {
        delete table.columns;
        return table;
      });
      data.splice(0, 1);
      this.events = data;
      this.downloadFile()
    })
  }

  downloadFile() {
    const jszip = new JSZip();
    jszip.file('tables.json', JSON.stringify(this.selectedTables));
    jszip.file('tableFields.json', JSON.stringify(this.tableFields));
    jszip.file('Events.json', JSON.stringify(this.events));

    jszip.generateAsync({ type: 'blob' }).then((content) => {
      // see FileSaver.js
      this.fileSaverService.save(content, 'Table.zip');
      this.reset();
      this.onCancel();
    });
  }

}
