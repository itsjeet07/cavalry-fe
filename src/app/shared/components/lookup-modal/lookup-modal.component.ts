import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';


@Component({
  selector: 'ngx-lookup-modal',
  templateUrl: './lookup-modal.component.html',
  styleUrls: ['./lookup-modal.component.scss']
})
export class LookupModalComponent implements OnInit {
  @Input() lookup;
  constructor(public ref: NbDialogRef<LookupModalComponent>, private router: Router) { }

  ngOnInit(): void {
  }

  onClose() {
    this.ref.close('no');
  }

  redirectToLookup(lookupItem) {
    const link = lookupItem[Object.keys(lookupItem)[1]];
    this.router.navigate([link]);
    this.ref.close('no');
  }

}
