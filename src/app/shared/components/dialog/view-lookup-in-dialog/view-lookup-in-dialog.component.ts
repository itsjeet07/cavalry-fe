import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-view-lookup-in-dialog',
  templateUrl: './view-lookup-in-dialog.component.html',
  styleUrls: ['./view-lookup-in-dialog.component.scss']
})
export class ViewLookupInDialogComponent implements OnInit {

  @Input() value: string = '';
  @Input() resourceLink: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  redirectToLink() {
    this.router.navigate([this.redirectToLink]);
  }
}
