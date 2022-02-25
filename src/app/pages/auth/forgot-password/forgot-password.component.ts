import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TableService } from '@app/shared/services/table.service';
import { NbToastrService } from '@nebular/theme';
import { AuthService } from '@shared/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../login/login.component.scss','./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit , OnDestroy{

  loading = false;
  forgotPasswordForm: FormGroup;
  emailStatus = "";
  emailResponse = "";
  showFlashMessage = false;
  configs = {};
  logoURL;
  loginLogoSubscription:Subscription;

  constructor(private formBuilder: FormBuilder, private router: Router,
    private authService: AuthService,
    private toastrService: NbToastrService,
    private titleService:Title,
    private tableService: TableService) {

    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    })

    this.loginLogoSubscription = tableService.loginLogo.subscribe(count =>{
      this.logoURL = count;
    })
  }

  ngOnInit(): void {
    var element = document.getElementById("main_body");
    element.classList.add("login_body");
    this.tableService.getSystemConfig().subscribe((configs) => {
      this.configs = configs;
      this.titleService.setTitle(configs['Company Name']);
    });
  }

  onFormSubmit(){
    this.loading = true;
    this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe((res) => {
      this.loading = false;
      if (res.statusCode === 200) {
        //this.toastrService.success(`${res.message}`, 'Email Sent');
        this.forgotPasswordForm.setValue({email: ''});
        this.emailStatus = 'success';
        this.emailResponse = res.message;
      } else {
        //this.toastrService.danger(`${res.message}`, 'Forgot Password');
        this.emailStatus = 'danger';
        this.emailResponse = res.message;
      }
      this.showFlashMessage = true;
    }, (error) => {
      this.toastrService.danger(`${error.error && error.error.message}`, 'Forgot Password');
      this.loading = false;
    });
  }

  redirectToLogin(){
    this.router.navigate(['/auth/login']);
  }

  onClose(){
    this.showFlashMessage = false;
  }

  ngOnDestroy(){
    if(this.loginLogoSubscription){
      this.loginLogoSubscription.unsubscribe();
    }
  }
}
