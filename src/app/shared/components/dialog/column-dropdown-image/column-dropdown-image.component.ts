import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TableService } from '@app/shared/services/table.service';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-column-dropdown-image',
  templateUrl: './column-dropdown-image.component.html',
  styleUrls: ['./column-dropdown-image.component.scss']
})
export class ColumnDropdownImageComponent implements OnInit {

  @Input() items: any;
  list = [];
  imageURL = [];

  constructor(
    protected ref: NbDialogRef<ColumnDropdownImageComponent>,
    private cdr: ChangeDetectorRef,
    private service: TableService,

  ) {

  }

  ngOnInit(){

    
  }

  addNewRow() {
    this.list.push(new ImageObject());
  }

  ngAfterViewInit(): void {
    if(this.items && this.items.length){
      this.items.forEach((element,i) => {
        this.list.push(new ImageObject());
        this.list[i].title = element.title;
        this.list[i].image = element.image
        this.imageURL[i] = element.image;

      });
    }
    else{
      this.list.push(new ImageObject());

    }

    this.cdr.detectChanges();
  }


  cancel() {
    this.ref.close();
  }


  removeRow(i) {
    if(i == 0 && this.list.length == 1){
      this.list = [];
      this.imageURL = [];
      this.list.push(new ImageObject());
    }
    else{
      this.list.splice(i, 1);
      this.imageURL.splice(i,1);
    }
  }



  submit() {
    this.ref.close(this.list);
  }

  onFileChange(event,i) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.list[i].image = file;
      this.uploadIcon(i);
    }
  }

  uploadIcon(i) {
    const formData = new FormData();
    formData.append("file", this.list[i].image);
    this.service.uploadMedia(formData).subscribe((res: any) => {
      if (res.statusCode === 201) {
        this.list[i].image = res.data[0];
        this.imageURL[i] = this.list[i].image;
      }
    });
  }


}

export class ImageObject{

  title:any;
  image:any;

  constructor(){
    this.title = null;
    this.image = null;
  }

}
