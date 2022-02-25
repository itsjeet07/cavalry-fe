import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { iconList } from '@app/shared/iconData/iconList';
import { TableService } from '@app/shared/services/table.service';
import { NbDialogRef, NbToastrService, NbDialogService } from '@nebular/theme';
import { combineLatest } from 'rxjs';
import * as JSZip from 'jszip';

@Component({
  selector: 'ngx-import-table',
  templateUrl: './import-table.component.html',
  styleUrls: ['./import-table.component.scss']
})
export class ImportTableComponent implements OnInit {
  public uploadedFiles = [];
  public isActive = false;
  droppedFiles = [];
  uploadProgress = 0;
  fileFormData: any;
  renameTable = [];
  newRenameTable = [];
  fileData = {};
  loading = false;
  constructor(protected ref: NbDialogRef<ImportTableComponent>, private tableService: TableService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService) { }

  ngOnInit(): void {
  }

  onCancel() {
    this.ref.close();
  }

  validate() {
    if (JSON.stringify(this.fileData) === '{}') {
      this.toastrService.danger('Please add atleast one Zip file');
      return;
    }
    const dialogData = {
      title: 'Are you Sure?',
      text: 'You want Import New Tables',
      actionFlag: true,
      cancel: 'Cancel'
    };
    this.dialogService.open(ConfirmDialogComponent, { context: dialogData }).onClose.subscribe(data => {
      if (!data) {
        return;
      }
      this.loading = true;
    this.tableService.validateImport(this.fileData).subscribe((resp: any) => {
      const data = resp || null;
      this.loading = false;
      if (data.statusCode === 400) {
        this.toastrService.danger(data.message);
        return;
      }
      if (data && data.data && data.data.errors && data.data.errors.length) {
        data.data.errors.forEach(({ newTableName, tableName }) => {
          this.toastrService.danger(`Unable to import table ${newTableName}, it seems like this table was already imported, name of existing table is ${tableName}`);
        });
        this.onCancel();
      }
      if (data && data.data && data.data.warnnings && data.data.warnnings.length) {
        data.data.warnnings.forEach((tableName) => {
          this.toastrService.warning(`Table ${tableName} found, new imported table will be named ${tableName}1 `);
        });
        this.onCancel();
      }
      if (data && data.data && data.data.inform && data.data.inform.length) {
        data.data.inform.forEach((tableName) => {
          this.toastrService.success(`Table ${tableName} Created successfully`, 'Remember to Assign a permission in order to view this table', {duration: 7000});
        });
        this.onCancel();
      }
      if (data && data.data && data.data.tableNameChanges && data.data.tableNameChanges.length) {
        this.renameTable = data.data.tableNameChanges
        this.newRenameTable = data.data.tableNameChanges
      }
    }, () => {
      this.toastrService.danger('Please Provide zip which contains valid json files');
      this.onCancel();
    })
  });
  }

  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.isActive = true;
  }

  onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.isActive = false;
  }

  onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.droppedFiles = [];
    for (let i = 0; i < event.dataTransfer.files.length; i++) {
      this.droppedFiles.push(event.dataTransfer.files[i]);
    }
    this.onDroppedFile(this.droppedFiles);
    this.isActive = false;
  }

  onDroppedFile(droppedFiles) {
    this.fileData = {};
    const formData = new FormData();
    if (this.droppedFiles && this.droppedFiles) {
      for (let i = 0; i < this.droppedFiles.length; i++) {
        formData.append("file", this.droppedFiles[i]);
      }
    }
    this.fileFormData = formData;
    this.uploadProgress = 0;
    const jszip = new JSZip();
    jszip.loadAsync(this.droppedFiles[0]).then((zip) => {
      Object.keys(zip.files).forEach(async (filename) => {
       await this.getFileData(zip, filename)
    })
    })
  }

  async getFileData(zip, filename) {
    return new Promise((resolve: any) => {
      zip.files[filename].async('string').then((fileData) => {
        try {
          fileData = JSON.parse(fileData)
        } catch(e) {
          fileData = fileData;
        }
        this.fileData = {
          ...this.fileData,
          [filename]: fileData
        }
        resolve();
      });
    });
  }

  onSelectedFile(event: any) {
    this.droppedFiles = [];
    for (let i = 0; i < event.target.files.length; i++) {
      this.droppedFiles.push(event.target.files[i]);
    }
    this.onDroppedFile(this.droppedFiles);
  }

  getFileName(filename) {
    const name = decodeURI(filename.name);
    return name.split(".")[0];
  }

  getFileExtension(filename) {
    const ext = filename.name.split(".").pop();
    const obj = iconList.filter((row) => {
      if (row.type === ext) {
        return true;
      }
    });
    if (obj.length > 0) {
      return obj[0].icon;
    } else {
      return "fiv-cla fiv-icon-blank fiv-size-md";
    }
  }

  onDelete(event) {
    // delete file from FileList
    if (this.droppedFiles) {
      this.droppedFiles.splice(event, 1);
    }
  }

  save() {
    combineLatest(this.renameTable.map(({tableId}, index) => this.tableService.updateMainTable({_id: tableId, tableName: this.newRenameTable[index].tableName}))).subscribe((data) => {
      this.onCancel();
    })
  }

}
