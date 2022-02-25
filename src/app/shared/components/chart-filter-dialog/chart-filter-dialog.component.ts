import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-chart-filter-dialog',
  templateUrl: './chart-filter-dialog.component.html',
  styleUrls: ['./chart-filter-dialog.component.scss'],
})
export class ChartFilterDialogComponent implements OnInit {
  @Input() data: any;
  @Input() index: any;
  @ViewChild('textArea', { read: ElementRef }) textArea: ElementRef;
  addFilter: FormControl;
  loading: false;
  placeholder;
  constructor(
    private toastrService: NbToastrService,
    public ref: NbDialogRef<ChartFilterDialogComponent>,
    ) {
    this.placeholder = JSON.stringify([
      {
      'condition': 'condition operator ($and, $or etc..)',
      'rules': [
        {
          'field': 'DB field',
          'operator': 'operator ($in, $eq, $ne etc..)',
          'value': 'value to compare',
          'type': 'DB field type'
        }
      ]
    }
    ], undefined, 4);
  }

  ngOnInit(): void {
    if (this.data[this.index] && this.data[this.index].filter && this.data[this.index].filter.length > 0) {
      this.addFilter = new FormControl(JSON.stringify(this.data[this.index].filter, undefined, 4));
    } else {
      this.addFilter = new FormControl('');
    }
  }

  saveFilter() {
    try {

      this.loading = false;
      if (!this.data[this.index]) {
        this.data[this.index] = {};
      }
      this.data[this.index].filter =  JSON.parse(this.addFilter.value);
      // this.data[this.index].filter.forEach(filters => {
      //   filters.rules.forEach(rule => {
      //     if (rule.value === '$currentUser' || (Array.isArray(rule.value) && rule.value.includes('$currentUser'))) {
      //       if (Array.isArray(rule.value)) {
      //         const index =  rule.value.findIndex(x => x === '$currentUser');
      //         rule.value[index] = currentUser._id;
      //       } else {
      //         rule.value = currentUser._id;
      //       }
      //     }
      //   });
      // });
      this.ref.close(this.data[this.index].filter);
    } catch (error) {
      this.loading = false;
      this.toastrService.danger('Incorrect Json', 'Action was unsuccessful!');
    }
  }

  onChange() {
    const textArea = this.textArea.nativeElement;
    textArea.style.overflow = 'hidden';
    textArea.style.height = '0px';
    textArea.style.height = textArea.scrollHeight + 'px';
  }
}
