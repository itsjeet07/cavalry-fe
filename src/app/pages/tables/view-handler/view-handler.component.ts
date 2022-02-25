import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TableService } from '@app/shared/services/table.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-view-handler',
  templateUrl: './view-handler.component.html',
  styleUrls: ['./view-handler.component.scss']
})
export class ViewHandlerComponent implements OnInit {

  id;
  tableId;
  tableName;
  paramsSub:Subscription;
  viewInModal: boolean = false;
  apiCalled:boolean = false
  constructor(
    private route: ActivatedRoute,
    private tableService: TableService,
    private cdr:ChangeDetectorRef
  ) {
    this.paramsSub = this.route.params.subscribe((params) => {
      if (Object.keys(params).length) {
        this.id = params.id;
        this.tableId = params.tableId;
        this.tableName = params.tableName;
        if (this.id) {
          this.getTableByName();
        }
      }
    });
  }

  ngOnInit(): void {
    this.apiCalled = false;
  }

  getTableByName() {

    this.tableService.getTableByName(this.tableName).subscribe((res: any) => {
      if (res && res.data && res.data[0].columns) {

          this.viewInModal = res.data[0].viewInModal;
          this.apiCalled = true;
      }
    });

  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
}

}
