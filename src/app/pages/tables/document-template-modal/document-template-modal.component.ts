import { Component, Input, OnInit } from '@angular/core';
import { TableService } from '@app/shared/services/table.service';
import { NbDialogRef, NbToastrService } from '@nebular/theme';

export class EmailEvent {
  _id: string = null;
  tableId: string;
  columnId: string;
  event: EmailObject;
  type: string;

  constructor() {
    this.tableId = "";
    this.columnId = null;
    this.type = "Document"
    this.event = new EmailObject();
  }
}

export class EmailObject {
  name: any;
  body: any;
  constructor() {
    this.body = "";
    this.name = "";
  }
}

@Component({
  selector: 'ngx-document-template-modal',
  templateUrl: './document-template-modal.component.html',
  styleUrls: ['./document-template-modal.component.scss']
})
export class DocumentTemplateModalComponent implements OnInit {
  @Input() tableData: any;
  @Input() addFlag: boolean;
  @Input() editFlag: boolean;
  @Input() columnEventData: any;
  @Input() columnId: any;
  @Input() emailIndex: any;


  public isSrcFieldSelected: boolean = false;
  public loading: boolean = false;
  
  public editorConfig: any;
  
  emailEventObject = new EmailEvent();
  constructor(protected dialogRef: NbDialogRef<any>, private tableService: TableService, private toastrService: NbToastrService) {
    
    var that = this;
    this.editorConfig = {
      plugins: "image code",
      toolbar: "undo redo | link image | code",
      image_title: true,
      entity_encoding : "raw",
      skin: false,
      content_css: '/app/assets/tinymce-content.min.css',
      automatic_uploads: true,
      image_dimensions: false,
      file_picker_types: "image",
      // allow_conditional_comments: true,
      // allow_html_in_named_anchor: true,
      // extended_valid_elements : '%',
      // custom_elements : '%,~%',

      file_picker_callback: function (cb, value, meta) {
        var input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");

        input.onchange = function () {
          var file = input.files[0];
          var reader = new FileReader();
          reader.onload = function () {
            var id = "blobid" + new Date().getTime();
            var blobCache = tinymce.activeEditor.editorUpload.blobCache;
            var a1 = reader.result as any;
            var base64 = a1.split(",")[1];
            var blobInfo = blobCache.create(id, file, base64);
            blobCache.add(blobInfo);
            that.loading = true;
            var a = document.getElementsByClassName("mce-floatpanel") as any;
            a[0].style.zIndex = "0";
            tableService.uploadImageEmailEvent(file).subscribe(
              (res: any) => {
                if (res.statusCode === 201) {
                  cb(res["data"][0], { title: file.name });
                  that.loading = false;
                  a[0].style.zIndex = "99992";
                } else {
                }
              },
              (error) => {
                toastrService.danger(error.message, "Action was unsuccessful!");
                that.loading = false;
                a[0].style.zIndex = "99992";
              }
            );
          };
          reader.readAsDataURL(file);
        };

        input.click();
      },
      content_style:
        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px } img {height:200px;width:200px}",
    };
   }

  ngOnInit(): void {
    if (this.editFlag && this.columnEventData) {
      this.getTableDataToEdit();
    }
  }

  getTableDataToEdit() {
    if (this.editFlag) {
    this.emailEventObject._id = this.columnEventData._id;
    this.emailEventObject.event = { ...this.columnEventData.event };
    this.emailEventObject.tableId = this.tableData._id;
    this.isSrcFieldSelected = true;
    }
  }

  closeModal() {
    this.dialogRef.close(false);
  }

  saveDocument(myForm) {
    if (myForm.valid) {
      if (!this.emailEventObject.event.name) {
        this.toastrService.danger("Please fill email-subject field");
        return;
      }
      if (!this.emailEventObject.event.body) {
        this.toastrService.danger("Please fill email-body field");
        return;
      } else if (!this.editFlag) {

        this.emailEventObject.tableId = this.tableData._id;
            this.tableService
              .createEmailTemplate(this.emailEventObject)
              .subscribe(
                (res: any) => {
                  if (res.statusCode === 200) {
                    this.toastrService.success(res.message);
                    this.dialogRef.close(true);
                  } else {
                    this.toastrService.danger(res.message);
                  }
                },
                (error) => {
                }
              );
      } else if (this.editFlag) {
        this.tableService
          .updateEmailTemplate(this.emailEventObject)
          .subscribe(
            (res: any) => {
              if (res.statusCode === 200) {
                this.toastrService.success(res.message);
                this.dialogRef.close(true);
              } else {
                this.toastrService.danger(res.message);
              }
            });
      }
    }
  }

}
