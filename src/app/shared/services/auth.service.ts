import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserLoginRequest, UserRegisterRequest, UserResponse } from '@shared/interfaces';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { SocketService } from './socket.service';
import { MessageService } from './message.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  userId = null;
  constructor(
    private http: HttpClient,
    private router: Router,
    private socketService: SocketService,
    private messageService:MessageService
  ) {
    if (JSON.parse(localStorage.getItem('userData'))) {
      this.userId = JSON.parse(localStorage.getItem('userData'))._id;
    }
  }

  loginUser(payload: UserLoginRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${environment.apiUrl}/user/login`, payload);
  }

  userDetail() {
    const apiUrl = `${environment.apiUrl}/user/me?id=${this.userId}`;
    return this.http.get(apiUrl);
  }

  checkTokenExpiration(): void {

    const helper = new JwtHelperService();

    if (localStorage.getItem('userToken')) {

      const token = localStorage.getItem('userToken');
      const decoded = helper.decodeToken(token);
      const current_time = new Date().getTime() / 1000;
      if (current_time > decoded.exp) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        this.router.navigate(['/auth/login']);
      }
    }
  }

  logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    this.router.navigate(['/auth/login']);
    const data = {
      id: this.userId,
      status: 'Offline'
    };
     this.socketService.emit('user_status_change', data);
   // this.messageService.userStatusChange(data);

    this.router.navigate(['/auth/login']).then(() => { window.location.reload(); });

  }

  // getRefreshToken()  {
  //   const authToken = JSON.parse(localStorage.getItem('userToken'));
  //   this.apiService.refreshToken(authToken).subscribe((res: any) => {
  //     if (res.result.token) {
  //       localStorage.setItem('userToken', JSON.stringify(res.result));
  //     }
  //   }, (err) => {
  //     this.logoutUser();
  //   });
  // }

  registerUser(payload: UserRegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${environment.apiUrl}/user`, payload);
  }

  forgotPassword(payload: UserRegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${environment.apiUrl}/user/forgotPassword`, payload);
  }

  resetPassword(payload: UserRegisterRequest,token): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${environment.apiUrl}/user/resetPassword?token=${token}`, payload);
  }

  validateToken(token){
    return this.http.get<any>(`${environment.apiUrl}/user/validateToken?token=${token}`);
  }

  getUser(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user`);
  }
}
