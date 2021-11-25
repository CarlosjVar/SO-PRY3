import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {  MatTreeFlatDataSource,  MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { DirectoriesService } from 'src/app/services/directories.service';
import { Router } from '@angular/router';
import { Directory } from 'src/app/models/directories.model';
import { MatDialog } from '@angular/material/dialog';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { CreateFileComponent } from '../../files/create-file/create-file.component';
import { CreateDirComponent } from '../../directories/create-dir/create-dir.component';
import { FilesService } from 'src/app/services/files.service';
import { DatePipe } from '@angular/common';

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [DatePipe],
})
export class SidebarComponent implements OnInit {
  @Output() nameEvent = new EventEmitter<string>();
  user = localStorage.getItem('username');
  name: string = this.user !== null ? this.user : '';
  TREE_DATA!: Directory[];
  parent: string = '';
  actual: string = '';
  complete_parent: string = '';
  myDate: Date | undefined;
  max_size: string | null  = "";
  actual_size: string | null = "";
  result: number = 0;

  private _transformer = (node: Directory, level: number) => {
    return {
      expandable: !!node.directories && node.directories.length > 0,
      name: node.virtual_route,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.directories
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  constructor(
    private _dirService: DirectoriesService,
    private _fileService: FilesService,
    private datePipe: DatePipe,
    private router: Router,
    public dialog: MatDialog
  ) {
    this._dirService.geDirectories(this.name).subscribe({
      complete: () => {
        this.dataSource.data = this.TREE_DATA;
        this.max_size = localStorage.getItem('max_drive_size');
        this.calculateSpace();
        console.log(this.result)
      },
      next: (res) => {
        this.TREE_DATA = res.directories;
        this.actual_size = res.size;
        localStorage.setItem('actual_size',res.size);
        console.log(res)
      },
      error: (errors: Error) => {
        console.log(errors);
      },
    });
  }


  calculateSpace() {
    if(this.max_size!=null && this.actual_size!=null){
      let total_s = parseInt(this.max_size);
      let actual_s = parseInt(this.actual_size);
      console.log(this.actual_size)
      console.log(actual_s)
      this.result = (actual_s*100)/total_s;
    }
  }

  ngOnInit(): void {}

  cargar(nombre: string) {
    this.dataSource.data.forEach((x) => {
      if (x.virtual_route === nombre) {
        this.complete_parent = x.parent;
        this.checkCompleteParent();
        this.parent = this.actual;
        this.actual = nombre;
        localStorage.setItem('actual', this.actual);
        localStorage.setItem('complete_parent', this.complete_parent);
        localStorage.setItem('parent', this.parent);
        this.onNameChange ();
      }
    });
    this._dirService
      .getInside(this.name, this.complete_parent + nombre)
      .subscribe({
        complete: () => {
          /*this.dataSource.data = this.TREE_DATA;*/
        },
        next: (res) => {
          this.TREE_DATA = res.directories;
          this.dataSource.data = this.TREE_DATA;
        },
        error: (errors: Error) => {
          console.log(errors);
        },
      });
  }

  volver() {
    if (this.complete_parent.endsWith('/')) {
      this.complete_parent = this.complete_parent.slice(0, -1);
    }
    this._dirService.getInside(this.name, this.complete_parent).subscribe({
      complete: () => {
        let lastOcurr = this.complete_parent.lastIndexOf('/');
        if (lastOcurr === undefined) {
          this.complete_parent = '';
        } else {
          this.complete_parent = this.complete_parent.substring(0, lastOcurr);
        }
        this.actual = this.parent;
        this.parent = this.complete_parent;
        this.checkCompleteParent();
        this.dataSource.data = this.TREE_DATA;
        this.onNameChange ();
      },
      next: (res) => {
        this.TREE_DATA = res.directories;
      },
      error: (errors: Error) => {
        console.log(errors);
      },
    });
  }

  actualizar(path_: string, name_: string): void {
    this._dirService.getInside(this.name, path_ + '/' + name_).subscribe({
      complete: () => {
        this.dataSource.data = this.TREE_DATA;
        let lastOcurr = path_.lastIndexOf('/');
        if (lastOcurr === undefined) {
          this.parent = '';
        } else {
          this.parent = path_.substring(lastOcurr + 1, path_.length);
        }
        this.actual = name_;
        this.complete_parent = path_;
        this.checkCompleteParent();
        this.onNameChange ();
      },
      next: (res) => {
        this.TREE_DATA = res.directories;
      },
      error: (errors: Error) => {
        console.log(errors);
      },
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PopUpComponent, {
      width: '60vh',
      data: { name: this.actual, type: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 1) {
        this.openDialogDir();
      } else if (result == 2) {
        this.openDialogFile();
      }
    });
  }

  openDialogFile() {
    const dR = this.dialog.open(CreateFileComponent, {
      width: '60vh',
      data: { username: this.actual },
    });
    dR.afterClosed().subscribe((result) => {
      let lastOcurr = result.name.lastIndexOf('.');
      let ext = '';
      if (lastOcurr !== undefined) {
        ext = result.name.substring(lastOcurr + 1, result.name.length);
      }
      this.myDate = new Date();
      let date = this.datePipe.transform(Date.now(), 'medium');
      this._fileService
        .createFile({
          username: this.name,
          name: result.name,
          ext: ext,
          date_created: date,
          date_modified: date,
          content: result.content,
          target_dir: this.complete_parent + this.actual,
          size: unescape(encodeURIComponent(result.content)).length.toString(),
        })
        .subscribe({
          next: (res) => {
            this.onNameChange ();
          },
          error: (err) => {
            console.log(err);
          },
        });
    });
  }

  openDialogDir() {
    const dR = this.dialog.open(CreateDirComponent, {
      width: '60vh',
      data: { username: this.actual },
    });
    dR.afterClosed().subscribe((result) => {
      this._dirService
        .createDirectory({
          username: this.name,
          name: result,
          target_dir: this.complete_parent + this.actual,
        })
        .subscribe({
          next: (res) => {
            this.actualizar(this.complete_parent + this.actual, result);
          },
          error: (err) => {
            console.log(err);
          },
        });
    });
  }

  onNameChange () {
    localStorage.setItem('actual', this.actual);
    localStorage.setItem('complete_parent', this.complete_parent);
    localStorage.setItem('parent', this.parent);
    this.nameEvent.emit(this.actual);
  }

  checkCompleteParent(){
    if(this.complete_parent!= null && this.complete_parent!=""){
      if (!this.complete_parent.endsWith('/')) {
        this.complete_parent = this.complete_parent+"/";
      }
    }
  }

}
