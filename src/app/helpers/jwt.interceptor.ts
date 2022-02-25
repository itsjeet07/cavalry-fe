import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '@env/environment';
import { AuthService } from '@app/shared/services';
import { catchError, tap } from 'rxjs/operators';
import { Time } from '@angular/common';


@Injectable({
  providedIn: 'root',
})
export class JwtInterceptor implements HttpInterceptor {

  lastActivityTime = new Subject<Date>();

  constructor(
    private authService: AuthService,
    ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isLoggedIn = !!localStorage.getItem('userToken');
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (isLoggedIn && isApiUrl) {
      const token = localStorage.getItem('userToken');
      if (request.url.indexOf('RefreshToken') === -1) {
         this.authService.checkTokenExpiration();
      }
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {

          if(event instanceof HttpRequest){

            this.lastActivityTime.subscribe((res:any) => {
              let now:any = new Date();
            })

          }

          if (event instanceof HttpResponse) {

            // do stuff with response if you want

            let status = event.status;
            let str = "" + status;
            let firstLetterchar = str.charAt(0);

            if(firstLetterchar == '2'){
              let currentTime = new Date();
              this.lastActivityTime.next(currentTime);
            }
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 403) {
              // if(err.message){
              //   alert(err.message);
              // }
              this.authService.logout();
            }
          }
        }
      )
    );
  }
}

