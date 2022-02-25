import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@app/shared/services';
import { debug } from 'console';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
    private authService: AuthService) { }
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot,
  // ): Observable<boolean> | Promise<boolean> | boolean {
  //   const token = localStorage.getItem('userToken');
  //   if (!token) {
  //     this.authService.checkTokenExpiration();
  //     this.router.navigate(['pages']);
  //     return false;
  //   }
  //   return true;
  // }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = localStorage.getItem('userToken');
    if (token) {
      this.authService.checkTokenExpiration();
      return true;
    }else{
      if (window.location.hash) {
        const redirectURL = decodeURIComponent(window.location.hash);
        this.router.navigate(['/auth/login', {redirectURL}]);
      } else {
        this.router.navigate(['/auth/login']);
      }
      return false;
    }
}
}
