import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {
  @Output() onFileDropped = new EventEmitter<any>();
  @Output() onFileDragged = new EventEmitter<boolean>();

  // @HostBinding('style.background-color') private background = '#f5fcff'
  // @HostBinding('style.opacity') private opacity = '1'


  //Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    // this.background = '#9ecbec';
    // this.opacity = '0.8'
    this.onFileDragged.emit(true);
  }
  //Dragleave listener
  @HostListener('window:dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    // this.background = '#f5fcff'
    // this.opacity = '1'
    this.onFileDragged.emit(false);
  }
  //Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    this.onFileDragged.emit(false);
    evt.preventDefault();
    evt.stopPropagation();
    // this.background = '#f5fcff'
    // this.opacity = '1'
    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files)
    }
  }

}
