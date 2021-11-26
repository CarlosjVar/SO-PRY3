import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { createFile_ } from 'src/app/models/File.model';
import { SharedService } from 'src/app/services/shared.service';

export interface DialogData {
  user: string;
  name: string;
  type: string;
  a_type: string;
  new_direction: string;
  actual_dir: string;
}

@Component({
  selector: 'app-move',
  templateUrl: './move.component.html',
  styleUrls: ['./move.component.css'],
})
export class MoveComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<MoveComponent>,
    private _sharedService: SharedService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.data.new_direction = this.data.actual_dir;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  ngOnInit(): void {}

  onMove(): void {
    if (this.data.actual_dir.endsWith('/'))
      this.data.actual_dir = this.data.actual_dir.substring(
        0,
        this.data.actual_dir.length - 1
      );
    this._sharedService
      .move({
        from_directory: this.data.actual_dir,
        target_element: this.data.name,
        to_directory: this.data.new_direction,
        username: this.data.user,
        type: this.data.a_type,
      })
      .subscribe({
        next: (result) => {
          console.log(result);
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.toastr.error(err.error);
        },
      });
  }
}
