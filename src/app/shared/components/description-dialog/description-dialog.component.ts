import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-description-dialog',
  templateUrl: './description-dialog.component.html',
  styleUrls: ['./description-dialog.component.scss'],
})
export class DescriptionDialogComponent implements OnInit {
  @Input() data: any;
  editDescription: FormControl;
  constructor(
    public ref: NbDialogRef<DescriptionDialogComponent>,
    ) { }

  ngOnInit(): void {
    this.editDescription = new FormControl(this.data);
  }

  onUpdate() {
    const data = this.editDescription.value;
    this.ref.close(data);
  }
}
