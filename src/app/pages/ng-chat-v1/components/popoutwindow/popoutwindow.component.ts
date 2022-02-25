import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver, EventEmitter,
  Injector, Input,
  OnDestroy,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import { CdkPortal, DomPortalOutlet } from '@angular/cdk/portal';

@Component({
  selector: 'ngx-popoutwindow',
  templateUrl: './popoutwindow.component.html'
})
export class PopoutwindowComponent implements OnInit, OnDestroy {
  @ViewChild(CdkPortal, {static: true} ) portal: CdkPortal;
  @Input() isOpenPopOutWindow: boolean;
  @Input() windowsUser: { unreadCount: number, displayName: string };
  externalWindow = null;
  @Output() popemitValue = new EventEmitter<{isOpenWindow?: boolean, popUpClose?: boolean}>();
  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private applicationRef: ApplicationRef,
              private injector: Injector) { }

  ngOnInit(): void {
    this.popemitValue.emit({ isOpenWindow: true });
    this.externalWindow = window.open('', '', 'width=350,height=400,left=200,top=200');
    this.externalWindow.onbeforeunload = () => {
      this.popemitValue.emit({ popUpClose: false });
    };
    this.externalWindow.document.title = 'Chatting with ' +
    this.windowsUser?.displayName + ( this.windowsUser?.unreadCount ? ' - ' + this.windowsUser?.unreadCount : '' );
    document.querySelectorAll('link, style').forEach(htmlElement => {
      this.externalWindow.document.head.appendChild(htmlElement.cloneNode(true));
    });
    const host = new DomPortalOutlet(
      this.externalWindow.document.body,
      this.componentFactoryResolver,
      this.applicationRef,
      this.injector,
    );
    host.attach(this.portal);
  }

  ngOnDestroy() {
    this.externalWindow.close();
  }

}
