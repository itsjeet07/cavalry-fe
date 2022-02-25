import { Directive, ElementRef, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appResizable]' // Attribute selector
})

export class ResizableDirective implements OnInit {


  @Input() resizableGrabWidth = 8;
  @Input() resizableMinWidth = 10;
  @Output() widthResize = new EventEmitter()
  dragging = false;

  constructor(private el: ElementRef) {

    const self = this;

    function preventGlobalMouseEvents() {
      document.body.style['pointer-events'] = 'none';
    }

    function restoreGlobalMouseEvents() {
      document.body.style['pointer-events'] = 'auto';
    }


    const newWidth = (wid) => {
      const newWidth = Math.max(this.resizableMinWidth, wid);
      el.nativeElement.style.cursor = 'col-resize';
      el.nativeElement.style.minWidth = (newWidth) + 'px';
      el.nativeElement.scrollLeft = newWidth;
      this.widthResize.emit(el.nativeElement.style.minWidth);
    };


    const mouseMoveG = (evt) => {
      if (!this.dragging) {
        return;
      }
      if (evt.clientX - el.nativeElement.offsetLeft - 320 > 0) {
        newWidth(evt.clientX - el.nativeElement.offsetLeft - 320);
      } else {
        newWidth((evt.clientX - el.nativeElement.offsetLeft) - 150);
      }

      evt.stopPropagation();
    };

    const dragMoveG = (evt) => {
      if (!this.dragging) {
        return;
      }
      const newWidth = Math.max(this.resizableMinWidth, (evt.clientX - el.nativeElement.offsetLeft)) + "px";
      el.nativeElement.style.width = (evt.clientX - el.nativeElement.offsetLeft) + "px";
      evt.stopPropagation();
    };

    const mouseUpG = (evt) => {
      if (!this.dragging) {
        return;
      }
      restoreGlobalMouseEvents();
      this.dragging = false;
      evt.stopPropagation();
    };

    const mouseDown = (evt) => {
      if (this.inDragRegion(evt)) {
        this.dragging = true;
        // preventGlobalMouseEvents();
        evt.stopPropagation();
      }
    };


    const mouseMove = (evt) => {
      if (this.inDragRegion(evt) || this.dragging) {
        el.nativeElement.style.cursor = 'col-resize';
      } else {
        el.nativeElement.style.cursor = 'default';
      }
    }


    document.addEventListener('mousemove', mouseMoveG, true);
    document.addEventListener('mouseup', mouseUpG, true);
    el.nativeElement.addEventListener('mousedown', mouseDown, true);
    el.nativeElement.addEventListener('mousemove', mouseMove, true);
  }

  ngOnInit(): void { }

  inDragRegion(evt) {
    const { right } = this.el.nativeElement
      .closest('th')
      .getBoundingClientRect();

    return right - evt.clientX < 10;
  }

  @HostListener('dblclick', ['$event']) onColumnReset() {
    const ele = this.el.nativeElement;
    if(ele.style.cursor == 'col-resize'){
      ele.style.minWidth = '150px';
      ele.style.cursor = 'default';
    }
  }

}
