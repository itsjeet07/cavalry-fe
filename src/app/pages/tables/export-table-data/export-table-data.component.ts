import { NgxLinkifyjsService } from 'ngx-linkifyjs';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { TableService } from '@app/shared/services/table.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-export-table-data',
  templateUrl: './export-table-data.component.html',
  styleUrls: ['./export-table-data.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExportTableDataComponent implements OnInit {
  @Input() columnList = []
  @Input() tableName;
  @Input() recordTypes;
  tableData = [];
  headerField = []
  public loading = false;
  displayTable = true;
  recordTypeFieldName;
  selectedObjectsFromArray: any[] = [];
  constructor(protected ref: NbDialogRef<ExportTableDataComponent>, private tableService: TableService,
    private toastrService: NbToastrService,
    public linkifyService: NgxLinkifyjsService,
    private dialogService: NbDialogService) { }

  ngOnInit() {
    this.columnList.map((res) => {
      this.selectedObjectsFromArray.push(res.name);
    });
  }

  onChange(column) {

  }

  onCancel() {
    this.ref.close();
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    setTimeout(() => {
      const data = document.getElementById('table-view')
      const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data, { raw: true });
      const jsonWorksheet = XLSX.utils.sheet_to_csv(worksheet);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, excelFileName);
      this.loading = false;
    }, 0);
  }



  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    this.onCancel()
  }

  getTableData(type) {

    if (this.selectedObjectsFromArray.length) {
      this.loading = true;
      this.tableService.getDynamicTreeData(this.tableName, 1, null, null, null, this.recordTypes)
        .pipe(
          switchMap((data: any) => {
            if (data.statusCode) {
              this.tableData = [...data.data.pageOfItems];
              data.data.pager.pages.shift();
              const combineALl = data.data.pager.pages.map((page) => this.tableService.getDynamicTreeData(this.tableName, page, null, null, null, this.recordTypes).pipe(
                tap((resp: any) => {
                  if (resp.statusCode) {
                    this.tableData = [...this.tableData, ...resp.data.pageOfItems];
                  }
                })
              ));
              return data.data.pager.pages.length === 0 ? of({}) : combineLatest(combineALl);
            }
            return of({});
          })
        )
        .subscribe(() => {
          const col = this.columnList.filter(({ selected, name }) => selected && this.isProjectable(name)).map(({ name, label, type, isCurrency }) => ({ name, label, type, isCurrency, isLookUp: type === "lookup" }))
          this.tableData = this.tableData.map((d) => {


            delete d._id;
            const data = {};
            col.forEach((c) => {
              if (this.selectedObjectsFromArray.includes(c.name)) {
                if (c.isLookUp) {
                  const selectedLookUp = d.lookups.find(({ lookupName }) => lookupName === c.name);
                  if (selectedLookUp) {
                    data[c.label] = selectedLookUp.lookupVal;
                  } else {
                    data[c.label] = '';
                  }
                } else {
                  data[c.label] = d[c.name] || '';
                }
              }
            })
            return data;

          })

          const recordTypes = col.find(
            (x: any) => x.type == "recordType"
          );
          if (recordTypes != undefined) {
            this.recordTypeFieldName = recordTypes.name;
          }
          this.headerField = col.filter(v => {
            if (this.selectedObjectsFromArray.includes(v.name)) {
              return true;
            } else {
              return false;
            }
          })

          if (type === 1) {
            this.exportAsExcelFile(this.tableData, this.tableName)
          } else if (type === 2) {
            this.exportAsCSVFile(this.tableData, this.tableName)
          } else {
            this.exportAsPdfFile(this.tableData, this.tableName)
          }
        });
    } else {
      this.toastrService.danger("Select any one field", "Validation");
    }

  }

  testLinkify(item) {
    try {
      this.linkifyService.test(item);
      return true;
    } catch (_e) {
      return false;
    }
  }

  getUrl(item, column) {
    if (!(typeof item == "number") && column.type != "number" && this.testLinkify(item)) {
      return item;
    } else {
      let fractionPoint = column.fraction;
      if (item > 0) {
        if (fractionPoint > 0 || (fractionPoint === 0 && column.isCurrency)) {
          if (column.isCurrency) {
            return "$" + Number(item).toFixed(fractionPoint);
          } else {
            return Number(item).toFixed(fractionPoint);
          }
        } else {
          if (column.isCurrency) {
            if (!(Number(item) % 1 != 0)) {
              fractionPoint = 2;
              return "$" + Number(item).toFixed(fractionPoint);
            }
          } else {
            if (!(Number(item) % 1 != 0)) {
              fractionPoint = column.type === "autoNumber" ? 0 : fractionPoint === 0 ? 0 : 2;
              if (fractionPoint === 0) {
                return item;
              }
              return Number(item).toFixed(fractionPoint);
            }
          }
        }
      } else {
        return item;
      }
    }
  }



  isProjectable(itemName) {
    const ignoreFields = [
      "lookupTableName",
      "lookupTableId",
      "_id",
      "__v",
      "isActive",
    ];
    if (ignoreFields.includes(itemName)) {
      return false;
    }
    if (itemName.indexOf("Image") > -1) {
      return false;
    }
    return true;
  }

  exportAsPdfFile(resp, fileName: string) {
    setTimeout(() => {
      const data = document.getElementById('table-view')
      this.displayTable = false
      html2canvas(data).then(canvas => {
        this.loading = false;
        if (this.tableData.length < 15) {
          var doc: any = new jsPDF();
          doc.addImage(canvas, 'JPEG', 5, 5);
          doc.save(`${fileName}.pdf`);
        } else {
          var doc: any = new jsPDF('p', 'mm');
          var imgWidth = 210;
          var pageHeight = 295;
          const imgData = canvas.toDataURL('image/png')
          var imgHeight = canvas.height * imgWidth / canvas.width;
          var heightLeft = imgHeight;
          var position = 0;

          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight + 15);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight + 15);
            heightLeft -= pageHeight;
          }
          doc.save(`${fileName}.pdf`);
        }
        this.onCancel()
      });
    }, 0);
  }

  exportAsCSVFile(resp: any, fileName: string) {
    setTimeout(() => {
      const data = document.getElementById('table-view')
      const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data, { raw: true });
      const jsonWorksheet = XLSX.utils.sheet_to_csv(worksheet);
      FileSaver.saveAs(new Blob([jsonWorksheet]), fileName + '.csv');
      this.loading = false;
      this.onCancel()
    }, 0);
  }


  save(type) {
    if (type === 3) {
      const dialogData = {
        title: 'Multiple columns ',
        text: 'Might not fit on the pdf',
        exportButton: false
      };
      this.dialogService.open(ConfirmDialogComponent, { context: dialogData }).onClose.subscribe(data => {
        if (data) {
          this.getTableData(type);
        }
      })
    } else {
      this.getTableData(type);
    }
  }

}
