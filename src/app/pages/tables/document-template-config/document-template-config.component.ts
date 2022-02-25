import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableService } from '@app/shared/services/table.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { DocumentTemplateModalComponent } from '../document-template-modal/document-template-modal.component';
import {jsPDF} from 'jspdf';
import { FilePreviewDialogComponent } from '@app/shared/components/file-preview-dialog/file-preview-dialog.component';
import { DynamicFormDialogComponent } from '@app/shared/components/dynamic-form-dialog/dynamic-form-dialog.component';
import { DynamicFormDialogNewDesignComponent } from '@app/shared/components/dynamic-form-dialog-new-design/dynamic-form-dialog-new-design.component';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-document-template-config',
  templateUrl: './document-template-config.component.html',
  styleUrls: ['./document-template-config.component.scss']
})
export class DocumentTemplateConfigComponent implements OnInit {
  documentTemplateList = [];
  @Input() tableDetails;
  @Output() getTableDetails :EventEmitter<any> =  new EventEmitter();
  selectedDoc = '';
  constructor(private tableService: TableService, private dialogService: NbDialogService,
     private toastrService: NbToastrService,private router:Router) { }

  ngOnInit(): void {
    this.getAllEmailEvents();
  }

  documentTemplateChange(e) {
    this.tableDetails.isDocumentTemplate = e;
    this.tableService.updateMainTable(this.tableDetails).subscribe();
  }

  getAllEmailEvents(){

    this.tableService.getAllDocumentsEvents(this.tableDetails._id).subscribe(
      (res: any) => {
        if (res.statusCode === 200) {
          this.documentTemplateList = res['data'];
        } else {
        }
      });
  }

  addNewDocumentTemplate() {
    this.dialogService
      .open(DocumentTemplateModalComponent, {
        context: {
          tableData: this.tableDetails,
          addFlag: true,
          editFlag: false,
          columnId: null
        }
      })
      .onClose.subscribe(res => {
        if (res) {
          this.getAllEmailEvents();
        }
      });
  }

  editTemplate(id, index) {

    let column = this.documentTemplateList.filter(f=>f._id == id);
    if(column.length == 1){
      this.dialogService
      .open(DocumentTemplateModalComponent, {
        context: {
          tableData: this.tableDetails,
          columnEventData: column[0],
          editFlag: true,
          addFlag: false,
          columnId: column[0].columnId,
          emailIndex: index
        }
      })
      .onClose.subscribe(res => {
        if (res) {
          this.getAllEmailEvents();
        }
      });
    }
  }

  viewDocument(col) {
    const doc: any = new jsPDF('p', 'pt', 'letter');

    doc.html(col.event.body, {
      filename: col.event.name,
      callback: (doc) => {
        var blobPDF =  new Blob([ doc.output() ], { type : 'application/pdf'});
      var blobUrl = URL.createObjectURL(blobPDF);  
       this.selectedDoc = blobUrl
       
        const fileDialog = this.dialogService.open(FilePreviewDialogComponent, {
          context: {
            Data: blobUrl,
            Ext: 'bloblUrl'
          },
        });
    
        fileDialog.componentRef.instance.saveTo.subscribe((data: any) => {
          this.tableService.getTableByName('Files').subscribe((tableres: any) => {
    
            const tempParentTableHeader = Object.assign([], tableres.data[0].columns);
            const fileType = tableres.data[0].columns.find(({type}) => type === "file");
            let type = 'file';
            if (fileType && fileType.name) {
              type = fileType.name
            }
              const res = {data: {
                relatedTo: data,
                lookup: [],
                [type]: []
              }};
              res.data[type].push(blobUrl)
              const ref = this.dialogService.open(DynamicFormDialogNewDesignComponent, {
                closeOnEsc:false,
                context: {
                  title: 'Add New File',
                  //headerDetail: this.headerObj,
                  isForceSave: true,
                  subFormLookupIds: "",
                  form: tempParentTableHeader,
                  button: { text: 'Save' },
                  tableName: 'Files',
                  Data: res.data,
                  recordType: null,
                  recordTypeFieldName: null,
                  action: 'Add',
                  // mainTableData: [],
                  tableRecordTypes: []
                },
              })
                .onClose.subscribe(name => {
                });
        });
        })
      }
    });
  }

  deleteTemplate(id, index) {
    this.tableService.deleteEmailEvent(id).subscribe(
      (res: any) => {
        if (res.statusCode === 200) {
          this.toastrService.success("Success", res.message);
          this.getAllEmailEvents();
        } else {
          this.toastrService.danger("Request failed", res.message);
        }
      },
      error => {
        this.toastrService.danger("Failed to delete, please try again");
      }
    );
  }

  onEdit(){
    this.router.navigate(['pages/tables/edit/' + this.tableDetails._id])
  }

}
