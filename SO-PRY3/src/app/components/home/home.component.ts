import { Component, OnInit } from '@angular/core';
import { DirectoriesService } from 'src/app/services/directories.service';
import { createFile_ } from 'src/app/models/File.model';
import { MatDialog } from '@angular/material/dialog';
import { ReadFileComponent } from '../files/read-file/read-file.component';
import { DeleteComponent } from '../shared/delete/delete.component';
import { SharedService } from 'src/app/services/shared.service';
import { MoveComponent } from '../shared/move/move.component';
import { ToastrService } from 'ngx-toastr';
import { ShareComponent } from '../shared/share/share.component';
import { CopyComponent } from '../shared/copy/copy.component';

import { FilesService } from 'src/app/services/files.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user = localStorage.getItem('username');
  complete_p: string | null = '';
  name: string = this.user !== null ? this.user : '';
  actual: string | null;
  complete_parent: string | null;
  parent: string | null;
  public DATA!: createFile_[];
  imglist: string[] = [];
  max_size: string | null = '';

  constructor(
    private _dirService: DirectoriesService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private _sharedService: SharedService,
    private _fileService: FilesService,
    public datepipe: DatePipe
  ) {
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.scale = 'cover';
    this.actual = '';
    this.complete_parent = '';
    this.parent = '';
    this.DATA = [];
    this.max_size = localStorage.getItem('max_drive_size');
  }

  cargarArchivos() {
    if (this.complete_parent != null && this.actual != null)
      this._dirService
        .getInside(this.name, this.complete_parent + this.actual)
        .subscribe({
          complete: () => {},
          next: (res) => {
            this.DATA = res.files;
          },
          error: (errors: any) => {
            console.log(errors);
            this.toastr.error(errors, 'Error');
          },
        });
  }

  nameEventHander($event: any): void {
    this.actual = localStorage.getItem('actual');
    this.complete_parent = localStorage.getItem('complete_parent');
    this.parent = localStorage.getItem('parent');
    this.complete_p = this.complete_parent;
    if (this.complete_parent != null && this.complete_parent.endsWith('/')) {
      this.complete_p = this.complete_parent.substring(
        0,
        this.complete_parent.length - 1
      );
    }
    this.DATA = [];
    if (this.complete_parent != null && this.actual != null)
      this._dirService
        .getInside(this.name, this.complete_parent + this.actual)
        .subscribe({
          complete: () => {
            if (this.DATA.length > this.imglist.length) this.chooseImg();
          },
          next: (res) => {
            this.DATA = res.files;
          },
          error: (errors: Error) => {
            console.log(errors);
          },
        });
  }

  ngOnInit(): void {}

  openDialog(file: any): void {
    const dialogRef = this.dialog.open(ReadFileComponent, {
      width: '90vh',
      data: {
        username: this.name,
        name: file.name,
        ext: file.ext,
        date_created: file.date_created,
        date_modified: file.date_modified,
        content: file.content,
        target_dir: file.parent,
        size: file.size,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 1) {
        //eliminar
        if (this.complete_parent != null && this.actual != null)
          this._dirService
            .getInside(this.name, this.complete_parent + this.actual)
            .subscribe({
              complete: () => {},
              next: (res) => {
                this.DATA = res.files;
                console.log(res);
              },
              error: (errors: Error) => {
                console.log(errors);
              },
            });
      }
      if (result == 2) {
        if (this.complete_parent != null && this.actual != null)
          this._dirService
            .getInside(this.name, this.complete_parent + this.actual)
            .subscribe({
              complete: () => {},
              next: (res) => {
                this.DATA = res.files;
                console.log(this.DATA);
              },
              error: (errors: Error) => {
                console.log(errors);
              },
            });
      }
    });
  }

  openDialogDelete(): void {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '40vh',
      data: { type: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.complete_parent != null && this.actual != null)
          this._sharedService
            .delete({
              items: [
                {
                  from_directory: this.complete_parent.substring(
                    0,
                    this.complete_parent.length - 1
                  ),
                  target_element: this.actual,
                  username: this.name,
                  type: 'dir',
                },
              ],
            })
            .subscribe({
              next: (res: any) => {
                window.location.reload();
                localStorage.setItem('actual', '');
                localStorage.setItem('complete_parent', '');
                localStorage.setItem('parent', '');
                this.cargarArchivos();
                let str: string = res.message;
                let msg: string = str.slice(str.indexOf('[') + 1, str.length);
                this.toastr.success(msg, 'Exito');
              },
              error: (errors) => {
                let str: string = errors.error;
                let msg: string = str.slice(
                  str.indexOf('[') + 2,
                  str.length - 3
                );
                this.toastr.error(msg, 'ERROR');
              },
            });
      }
    });
  }

  openDialogDeleteFiles(): void {
    let lista_: string[] = [];
    this.DATA.filter((x) => {
      lista_.push(x.name);
    });
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '60vh',
      data: { type: true, list: lista_ },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.value != null) {
        let lista_: {
          from_directory: string | null;
          target_element: any;
          username: string;
          type: string;
        }[] = [];
        result.value.forEach((element: any) => {
          let dir = this.complete_parent;
          if (this.actual != null) dir += this.actual;
          lista_.push({
            from_directory: dir,
            target_element: element,
            username: this.name,
            type: 'file',
          });
        });
        let resultado = { items: lista_ };
        this._sharedService.delete(resultado).subscribe({
          next: (res: any) => {
            window.location.reload();
            this.cargarArchivos();
          },
          error: (errors) => {
            let str: string = errors.error;
            let msg: string = str.slice(str.indexOf('[') + 2, str.length - 3);
            this.toastr.error(msg, 'ERROR');
          },
        });
      }
    });
  }

  openDialogMove(): void {
    const dialogRef = this.dialog.open(MoveComponent, {
      width: '60vh',
      data: {
        user: this.name,
        name: this.actual,
        type: 'directorio',
        a_type: 'dir',
        actual_dir: this.complete_parent,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        window.location.reload();
      }
    });
  }

  openDialogShare(): void {
    let dir = this.complete_parent;
    if (this.complete_parent != null && this.complete_parent.endsWith('/'))
      dir = this.complete_parent.substring(0, this.complete_parent.length - 1);
    const dialogRef = this.dialog.open(ShareComponent, {
      width: '100vh',
      data: {
        from_directory: dir,
        target_element: this.actual,
        username: this.name,
        target_username: '',
        type: 'dir',
      },
    });
  }

  openDialogCopy(): void {
    const dialogRef = this.dialog.open(CopyComponent, {
      width: '60vh',
      data: {
        user: this.name,
        name: this.actual,
        type: 'directorio',
        a_type: 'dir',
        actual_dir: this.complete_parent,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        window.location.reload();
      }
    });
  }

  chooseImg(): void {
    this.imglist = [];
    let cont = 3;
    for (let index = 0; index < this.DATA.length; index++) {
      this.imglist.push('../../../assets/img/' + cont.toString() + '.png');
      cont++;
      cont > 6 ? (cont = 3) : true;
    }
    console.log(this.imglist);
  }
  async upload(files: File[]) {
    const user = localStorage.getItem('username');

    const actual = localStorage.getItem('actual');
    const complete_parent = localStorage.getItem('complete_parent');
    let target;
    if (actual != null && complete_parent != null) {
      target = complete_parent + actual;
    }

    const current_file: any = files[0];
    const dateFile = new Date(current_file.lastModifiedDate);
    const formattedDate = this.datepipe.transform(dateFile, 'medium');
    let re = /(\w+)\.(\w+)/;
    const res = current_file.name.match(re);
    const content = await current_file.text();
    if (res[2] != 'txt') {
      return;
    }
    if (user && target != null) {
      console.log('pepito');
      let file_upload: createFile_ = {
        username: user,
        size: current_file.size,
        name: current_file.name,
        ext: res[2],
        date_created: formattedDate,
        date_modified: formattedDate,
        target_dir: target,
        content: content,
      };
      this._fileService.createFile(file_upload).subscribe({
        next: (result: any) => {
          this.toastr.success('Archivo subido correctamente', 'Éxito');
          this.nameEventHander(null);
        },
        error: (error: any) => {
          this.toastr.error(error, 'Error');
        },
      });
    }
  }
}
