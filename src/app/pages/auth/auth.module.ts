import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthModule } from '@nebular/auth';
import { AuthRoutingModule } from '@auth/auth-routing.module';
import { LoginComponent } from '@auth/login/login.component';
import { SharedModule } from '@shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '@app/helpers/jwt.interceptor';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NbAlertModule } from '@nebular/theme';
@NgModule({
  declarations: [LoginComponent, ForgotPasswordComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    NbAuthModule,
    NbAlertModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  ],
})
export class AuthModule {
}
