import { Component, Input, OnInit } from '@angular/core';
import { TableService } from '@app/shared/services/table.service';
import { NbDialogRef } from '@nebular/theme';
import { Subject } from 'rxjs';
import { viewerType } from './modules/document-viewer.component';

@Component({
  selector: 'ngx-file-preview-dialog',
  templateUrl: './file-preview-dialog.component.html',
  styleUrls: ['./file-preview-dialog.component.scss'],
})
export class FilePreviewDialogComponent implements OnInit {

  loading = false;

  @Input() Data: any;
  @Input() Ext: any;
  @Input() filename: string

  public saveTo = new Subject();

  imageShow;

  viewers: { name: viewerType,
    docs: string[],
    custom: boolean,
    acceptedUploadTypes: string,
    viewerUrl?: string }[] = [];
  selectedViewer;
  selectedDoc;
  isZoom = false;

  lookupList = [];

  constructor(public ref: NbDialogRef<FilePreviewDialogComponent>,
    private tableService: TableService) { }

  ngOnInit(): void {
    this.loading = true;
    const myRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;
    if (myRegex.test(this.Data)) {
      this.imageShow = true;
      this.loading = false;
    } else if (this.Ext == 'bloblUrl') {
      this.selectedViewer = {
        name: 'url'
      };
      this.loading = false;
      this.selectedDoc = this.Data;
     } else if (this.Ext == 'pdf') {
      this.imageShow = false;
      this.viewers = [
        {
          name: 'google',
          docs: [
            this.Data,
          ],
          custom: false,
          acceptedUploadTypes: 'application/pdf',
        },
      ];
      this.selectedViewer = this.viewers[0];
      this.selectedDoc = this.selectedViewer.docs[0];
      this.loading = false;
    } else {
      this.imageShow = false;
      this.viewers = [
        {
          name: 'google',
          docs: [
            this.Data,
          ],
          custom: false,
          acceptedUploadTypes: '*',
        },
      ];
      this.selectedViewer = this.viewers[0];
      this.selectedDoc = this.selectedViewer.docs[0];
      this.loading = false;
    }
    this.getTableByName();
  }

  onCancel() {
    this.isZoom = false;
    this.ref.close();
  }

  addNewFile(lookup) {
    this.saveTo.next(lookup);
    this.ref.close();
  }

  getFileName(filename) {
    return this.filename || filename.match(/.*\/(.*)$/)[1];
  }

  getTableByName() {
    this.tableService.getTableByName('Files').subscribe((res: any) => {
      if (res && res.data && res.data[0] && res.data[0].columns && res.data[0].columns.length) {
        const data = res.data[0].columns.find(x => x.type == 'dropdown' && x.name === "relatedTo");
        if (data && data.options) {
          this.lookupList = data.options
        }
      }
    })
  }

  onImage() {
    const link = document.createElement('a');
    link.href = this.Data;
    link.download = this.getFileName(this.Data);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onZoomIn() {
    this.isZoom = true;
    const image = document.getElementById('image');
    const width: any = image.clientWidth;
    image.style.width = (width + 25) + 'px';
  }

  onZoomOut() {
    this.isZoom = true;
    const image = document.getElementById('image');
    const width: any = image.clientWidth;
    image.style.width = (width - 25) + 'px';
  }
}
