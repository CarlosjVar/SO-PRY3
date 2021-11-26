import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { toShare } from 'src/app/models/shared.model';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css'],
})
export class ShareComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ShareComponent>,
    private _sharedService: SharedService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: toShare
  ) {
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}

  share(): void {
    this._sharedService.share(this.data).subscribe({
      error: (err: any) => {
        this.toastr.error(err.error, 'Error');
        console.log(err);
      },
    });
  }
}
