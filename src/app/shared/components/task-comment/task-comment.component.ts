import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-text-comment',
  templateUrl: './task-comment.component.html',
  styleUrls: ['./task-comment.component.scss']
})
export class TaskCommentComponent implements OnInit {

  commentForm: FormGroup;
  constructor(public ref: NbDialogRef<TaskCommentComponent>) { }

  ngOnInit(): void {
    this.commentForm = new FormGroup({
      'comment': new FormControl(null, [Validators.required]),
    });
  }

  onClick() {
   this.ref.close(this.commentForm.value.comment);
  }

}
