import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createFile_ } from 'src/app/models/File.model';


@Component({
  selector: 'app-create-file',
  templateUrl: './create-file.component.html',
  styleUrls: ['./create-file.component.css']
})
export class CreateFileComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<CreateFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: createFile_) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
