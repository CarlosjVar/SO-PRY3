import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { createFile_ } from 'src/app/models/File.model';
import { FilesService } from 'src/app/services/files.service';
import { SharedService } from 'src/app/services/shared.service';
import { DeleteComponent } from '../../shared/delete/delete.component';
import { DatePipe } from '@angular/common';
import { MoveComponent } from '../../shared/move/move.component';
import { ShareComponent } from '../../shared/share/share.component';
import { CopyComponent } from '../../shared/copy/copy.component';

@Component({
  selector: 'app-read-file',
  templateUrl: './read-file.component.html',
  styleUrls: ['./read-file.component.css'],
  providers: [DatePipe],
})
export class ReadFileComponent implements OnInit {
  info!: string;
  edit: boolean = false;
  content_: string = '';
  myDate: Date | undefined;
  salida: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ReadFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: createFile_,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private _sharedService: SharedService,
    private _fileService: FilesService
  ) {
    this.info =
      'Extensión: ' +
      data.ext +
      '\nFecha de Creación: ' +
      data.date_created +
      '\nFecha de Modif.: ' +
      data.date_modified +
      '\nTamaño: ' +
      data.size +
      'B';
  }

  onNoClick(): void {
    this.dialogRef.close(this.salida);
  }

  ngOnInit(): void {}

  openDialogDelete(): void {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '40vh',
      data: { boolean: false },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._sharedService
          .delete({items:[{
            from_directory: this.data.target_dir,
            target_element: this.data.name,
            username: this.data.username,
            type: 'file',
          }]})
          .subscribe({
            next: (res) => {
              console.log(res);
              this.dialogRef.close(1);
            },
            error: (err) => {
              console.log(err);
            },
          });
      }
    });
  }

  editMode(): void {
    this.edit = !this.edit;
    this.content_ = this.data.content;
  }

  guardarEdit(): void {
    this.myDate = new Date();
    let date = this.datePipe.transform(Date.now(), 'medium');
    this._fileService
      .modifyFile({
        username: this.data.username,
        name: this.data.name,
        old_name:  this.data.name,
        ext: this.data.ext,
        date_created: this.data.date_created,
        date_modified: date,
        content: this.data.content,
        target_dir: this.data.target_dir,
        size: unescape(encodeURIComponent(this.data.content)).length.toString(),
      })
      .subscribe({
        next: (res) => {
          this.edit = !this.edit;
          this.salida = 2;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  cancelarEdit():void{
    this.edit = !this.edit;
    this.data.content = this.content_;
  }

  move():void{
    const dialogRef = this.dialog.open(MoveComponent, {
      width: '60vh',
      data: {
        user: this.data.username,
        name: this.data.name,
        type: 'archivo',
        a_type: 'file',
        actual_dir: this.data.target_dir,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        window.location.reload();
      }
    });
  }

  share():void{
    let dir = this.data.target_dir;
    if(this.data.target_dir!=null && this.data.target_dir.endsWith("/"))
      dir=this.data.target_dir.substring(0,this.data.target_dir.length-1);
    const dialogRef = this.dialog.open(ShareComponent, {
      width: '90vh',
      data: {
        from_directory:dir,
        target_element:this.data.name,
        username:this.data.username,
        target_username:"",
        type:"file",
        },
    });
  }

  copy():void{
    const dialogRef = this.dialog.open(CopyComponent, {
      width: '60vh',
      data: {
        user: this.data.username,
        name: this.data.name,
        type: 'archivo',
        a_type: 'file',
        actual_dir: this.data.target_dir,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        window.location.reload();
      }
    });
  }
}
