import { Component, OnInit } from '@angular/core';
import { DirectoriesService } from 'src/app/services/directories.service';
import { createFile_ } from 'src/app/models/File.model';
import { MatDialog } from '@angular/material/dialog';
import { ReadFileComponent } from '../files/read-file/read-file.component';
import { DeleteComponent } from '../shared/delete/delete.component';
import { SharedService } from 'src/app/services/shared.service';
import { MoveComponent } from '../shared/move/move.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user = localStorage.getItem('username');
  name: string = this.user !== null ? this.user : '';
  actual: string | null;
  complete_parent: string | null;
  parent: string | null;
  public DATA!: createFile_[];

  constructor(
    private _dirService: DirectoriesService,
    public dialog: MatDialog,
    private _sharedService: SharedService
  ) {
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundAttachment = 'fixed';
    this.actual = '';
    this.complete_parent = '';
    this.parent = '';
    this.DATA=[];
  }

  cargarArchivos() {
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

  nameEventHander($event: any): void {
    this.actual = localStorage.getItem('actual');
    this.complete_parent = localStorage.getItem('complete_parent');
    this.parent = localStorage.getItem('parent');
    if (
      this.complete_parent != null &&
      this.complete_parent != '' &&
      !this.complete_parent.endsWith('/')
    ) {
      this.complete_parent += '/';
    }
    this.DATA = [];
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
    if (this.complete_parent != null && this.complete_parent.endsWith('/')) {
      this.complete_parent = this.complete_parent.substring(
        0,
        this.complete_parent.length - 1
      );
    }
  }

  ngOnInit(): void {}

  openDialog(file: any): void {
    const dialogRef = this.dialog.open(ReadFileComponent, {
      width: '100vh',
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
        console.log(this.complete_parent);
        console.log(this.actual);
        if (this.complete_parent != null && this.actual != null)
          this._sharedService
            .delete({items:[{
              from_directory: this.complete_parent,
              target_element: this.actual,
              username: this.name,
              type: 'dir',
            }]})
            .subscribe({
              next: (res: any) => {
                window.location.reload();
                localStorage.setItem('actual', '');
                localStorage.setItem('complete_parent', '');
                localStorage.setItem('parent', '');
                this.cargarArchivos();
              },
              error: (err: any) => {
                console.log(err);
              },
            });
      }
    });
  }

  openDialogDeleteFiles(): void {
    let lista_: string[] = [];
    this.DATA.filter(x => {lista_.push(x.name)})
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '60vh',
      data: { type: true, list : lista_ },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.value!=null) {
        let lista_: { from_directory: string | null; target_element: any; username: string; type: string; }[]=[]
        result.value.forEach((element: any) => {
          let dir = this.complete_parent;
          if(this.complete_parent!= null && !this.complete_parent.endsWith("/")) 
            dir+="/";
          if(this.actual!= null)
            dir+=this.actual
          lista_.push({
            from_directory: dir,
            target_element: element,
            username: this.name,
            type: 'file',
          })
        });
        let resultado = {items:lista_};
        this._sharedService
            .delete(resultado)
            .subscribe({
              next: (res: any) => {
                window.location.reload();
                this.cargarArchivos();
              },
              error: (err: any) => {
                console.log(err);
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

  getRandomImg() : string{
    const  min = Math.ceil(3);
    const  max = Math.floor(6);
    let res =  Math.floor(Math.random() * (max - min + 1)) + min; 
    let file = "../../../assets/img/"+res.toString()+".png"
    return file;
  }
}
