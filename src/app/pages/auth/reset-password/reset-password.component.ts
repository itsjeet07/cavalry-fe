import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { AuthService } from '@shared/services';

@Component({
  selector: 'ngx-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../login/login.component.scss','./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  loading = false;
  resetPasswordForm: FormGroup;
  isPasswordNotMatch = false;
  token:any = '';
  showFlashMessage = false;
  emailStatus = "";
  emailResponse = "";

  constructor(private formBuilder: FormBuilder, private router: Router,
    private authService: AuthService,
    private toastrService: NbToastrService,private activatedRoute:ActivatedRoute) {

    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.params.id;
    var element = document.getElementById("main_body");
    element.classList.add("login_body");
    this.validateToken();
  }

  onConfirmPasswordChange(){

    if(this.resetPasswordForm.value.password != this.resetPasswordForm.value.confirmPassword){
      this.toastrService.danger('Passwords are not matching.', 'Reset Password');
      this.isPasswordNotMatch = true;
    } else {
      this.isPasswordNotMatch = false;
    }
  }

  validateToken(){
    this.authService.validateToken(this.token).subscribe((res) => {
      if (res.statusCode !== 200) {
        this.emailStatus = 'danger';
        this.emailResponse = res.message;
        this.showFlashMessage = true;
      }
    }, (error) => {
    });
  }

  fireRequest(){

    this.authService.resetPassword(this.resetPasswordForm.value,this.token).subscribe((res) => {
      if (res.statusCode === 200) {
        this.toastrService.success(`${res.message}`, 'Reset Password');
        this.router.navigate(['/auth/login']);
        this.loading = false;
        this.emailStatus = 'success';
        this.emailResponse = res.message;
      } else {
        this.emailStatus = 'danger';
        this.emailResponse = res.message;
        this.toastrService.danger(`${res.message}`, 'Reset Password');
        this.loading = false;
      }
    }, (error) => {
      this.toastrService.danger(`${error.error && error.error.message}`, 'Reset Password');
      this.loading = false;
    });
  }

  onFormSubmit(){
    if(this.resetPasswordForm.invalid){
      this.toastrService.danger('Please enter password and confirm it.', 'Reset Password');
      return;
    }
    if(this.isPasswordNotMatch){
      this.toastrService.danger('Passwords are not matching.', 'Reset Password');
      return;
    }
    this.loading = true;
    this.fireRequest();
  }
  redirectToLogin(){
    this.router.navigate(['/auth/login']);
  }


  onClose(){
    this.showFlashMessage = false;
  }

}
