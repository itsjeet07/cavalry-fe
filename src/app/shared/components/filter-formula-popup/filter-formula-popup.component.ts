import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-filter-formula-popup',
  templateUrl: './filter-formula-popup.component.html',
  styleUrls: ['./filter-formula-popup.component.scss']
})
export class FilterFormulaPopupComponent implements OnInit {

  filter:any;
  constructor(public ref: NbDialogRef<FilterFormulaPopupComponent>) { }

  ngOnInit(): void {
  }

  onCancel() {
    this.ref.close();
  }


  onSaveFilterData() {
    this.ref.close(this.filter);
  }


}
