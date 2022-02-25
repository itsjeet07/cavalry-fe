import { Component, Input, OnInit } from '@angular/core';
import { TableService } from '@app/shared/services/table.service';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-showcase-dialog',
  templateUrl: './showcase-dialog.component.html',
  styleUrls: ['./showcase-dialog.component.scss'],
})
export class ShowcaseDialogComponent implements OnInit{

  @Input() title: string;
  @Input() body: string;
  @Input() list: [];
  @Input() button: {text: string};
  @Input() firstTimeLogin:boolean = false;
  userId = '';

  constructor(protected ref: NbDialogRef<ShowcaseDialogComponent>,
              private tableService: TableService) {}

  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem('userData'));
    if (user && user._id) {
      this.userId = user._id;
    }
  }

  dismiss() {
    this.ref.close();
    if(this.firstTimeLogin){
      this.tableService.setWelcomeMessageSeen(this.userId).subscribe(
        res => {

        }
      )
    }
  }

}
