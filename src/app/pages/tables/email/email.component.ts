import { Component, OnInit } from '@angular/core';
import { EmailDialogComponent } from '@app/shared/components/email-dialog/email-dialog.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],

})
export class EmailComponent implements OnInit {
  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
  array = [
    {
      'title': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight:700!important;font-weight: 700!important;',
      'subtitle': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important',
      'content': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important',
      'date': '11-11-2020',
    },
    {
      'title': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight:700!important;font-weight: 700!important;',
      'subtitle': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important',
      'content': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important',
      'date': '11-11-2020',
    },
    {
      'title': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight:700!important;font-weight: 700!important;',
      'subtitle': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important',
      'content': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important',
      'date': '11-11-2020',
    },
    {
      'title': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight:700!important;font-weight: 700!important;',
      'subtitle': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important',
      'content': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important',
      'date': '11-11-2020',
    },
    {
      'title': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight:700!important;font-weight: 700!important;',
      'subtitle': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important',
      'content': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important',
      'date': '11-11-2020',
    },
    {
      'title': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight:700!important;font-weight: 700!important;',
      'subtitle': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important',
      'content': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important',
      'date': '11-11-2020',
    },
    {
      'title': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight:700!important;font-weight: 700!important;',
      'subtitle': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important',
      'content': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important',
      'date': '11-11-2020',
    },
    {
      'title': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight:700!important;font-weight: 700!important;',
      'subtitle': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important',
      'content': 'font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important;font-weight: 700!important',
      'date': '11-11-2020',
    },
  ];
  showCondition = true;
  disableToggle = false;
  showCard = true;
  constructor( private dialogService: NbDialogService) { }

  ngOnInit(): void {
  }

  onClick() {
    this.showCondition = ! this.showCondition;
  }
  onChange() {
    this.disableToggle = ! this.disableToggle;
  }

  openDialog() {
    this.dialogService.open(EmailDialogComponent, {
      context: {
        title: 'This is a title passed to the dialog component',
      },
    }).onClose.subscribe(res => {
    });
}
  onToggle() {
    this.showCard = ! this.showCard;
  }
}
