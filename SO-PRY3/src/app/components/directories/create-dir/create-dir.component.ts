import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createDirectory } from 'src/app/models/directories.model';

@Component({
  selector: 'app-create-dir',
  templateUrl: './create-dir.component.html',
  styleUrls: ['./create-dir.component.css']
})
export class CreateDirComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CreateDirComponent>,
    @Inject(MAT_DIALOG_DATA) public data: createDirectory) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
