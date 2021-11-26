import {
  Directive,
  Output,
  Input,
  EventEmitter,
  HostBinding,
  HostListener,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
@Directive({
  selector: '[appDnd]',
})
export class DndDirective {
  constructor(public dialog: MatDialog, private toastr: ToastrService) {}

  @HostBinding('class.fileover') fileOver: any;
  @Output() fileDropped = new EventEmitter<any>();

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;

    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      console.log(files[0]);
      this.toastr.success('asd', 'Exito');
      this.fileDropped.emit(files);
    }
  }
}
