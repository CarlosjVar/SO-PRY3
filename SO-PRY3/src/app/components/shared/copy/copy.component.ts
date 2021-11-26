import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/services/shared.service';

export interface DialogData {
  user: string;
  name: string;
  type: string;
  a_type: string;
  new_direction: string;
  actual_dir: string;
  size: string;
}

@Component({
  selector: 'app-copy',
  templateUrl: './copy.component.html',
  styleUrls: ['./copy.component.css'],
})
export class CopyComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CopyComponent>,
    private _sharedService: SharedService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.data.new_direction = this.data.actual_dir;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}
  
  onMove(): void {
    if (this.data.actual_dir.endsWith('/'))
      this.data.actual_dir = this.data.actual_dir.substring(
        0,
        this.data.actual_dir.length - 1
      );

    console.log(this.data.new_direction);
    console.log(this.data.actual_dir + this.data.name);
    let current_dir = this.data.actual_dir + this.data.name;

    if (
      this.data.new_direction.split('/').length > current_dir.split('/').length
    ) {
      this.toastr.error(
        'Se intentó copiar un directorio dentro de uno de sus subdirectorios',
        'Error'
      );
      return;
    }

    this._sharedService
      .copy({
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
          console.log(err);
          this.toastr.error(err.error);
        },
      });
  }
  isEnoughSpace(val: number): boolean {
    let max_size = localStorage.getItem('max_drive_size');
    let actual_size = localStorage.getItem('actual_size');
    if (max_size != null && actual_size != null) {
      let total_s = parseInt(max_size);
      let actual_s = parseInt(actual_size);
      actual_s += val;
      if (actual_s > total_s) return false;
    }
    return true;
  }
}
