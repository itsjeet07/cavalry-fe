import { Component, OnInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "@shared/services";
import { UserResponse } from "@shared/interfaces";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { ActivatedRoute, Router } from "@angular/router";
import { NbLoginComponent, NbAuthService } from "@nebular/auth";
import { ShowcaseDialogComponent } from "@shared/components";
import { SocketService } from "@app/shared/services/socket.service";
import { MessageService } from "@app/shared/services/message.service";
import { TableService } from "@app/shared/services/table.service";
import { Title } from "@angular/platform-browser";
import { InfoDialogComponent } from "@app/shared/components/dialog/info-dialog/info-dialog.component";
import { Subscription } from "rxjs";

@Component({
  selector: "ngx-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent extends NbLoginComponent implements OnInit,OnDestroy {
  registrationForm: FormGroup;
  loginForm: FormGroup;
  loading = false;
  textDisplay: string;
  configs = {};
  redirectUrl = "/dashboard";

  loginSubscription:Subscription;
  titleSubscription:Subscription;
  logoPathSubscription:Subscription;
  loginLogoSubscription:Subscription;
  appNameSubscription:Subscription;
  logoURL;
  appName;
  isEyeEnableSignIn: boolean = false;
  isEyeEnableSignUp: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastrService: NbToastrService,
    service: NbAuthService,
    cd: ChangeDetectorRef,
    router: Router,
    private socketService: SocketService,
    private dialogService: NbDialogService,
    private messageService: MessageService,
    private tableService: TableService,
    private titleService: Title,
    private route: ActivatedRoute
  ) {
    super(service, {}, cd, router);
    if (localStorage.getItem("userToken")) {
      this.router.navigate(["pages"]);
    }
    this.initForms();

    this.loginSubscription = tableService.login.subscribe(count=>{
      this.redirectUrl = count;
    });

    this.titleSubscription = tableService.title.subscribe(count=>{
      this.titleService.setTitle(count);
    });

    this.loginLogoSubscription = tableService.loginLogo.subscribe(count =>{
      this.logoURL = count;
    })

    this.appNameSubscription = tableService.appName.subscribe(count =>{
      this.appName = count;
    })
  }

  ngOnInit(): void {
    var element = document.getElementById("main_body");
    element.classList.add("login_body");
    this.tableService.getSystemConfig().subscribe((configs) => {
      this.configs = configs;
      //this.titleService.setTitle(configs["Company Name"]);
      // if(configs['Login Redirect']){
      //   this.redirectUrl = configs['Login Redirect'];
      // }
    });
  }

  initForms(): void {
    this.loginForm = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
    this.registrationForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: [""],
      mobileNumber: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      privacy: ["", Validators.required],
    });
  }
  openPrivacyPolicy() {
    this.dialogService.open(ShowcaseDialogComponent, {
      context: {
        title: "PRIVACY POLICY",
        body: `<br>${this.configs["Privacy Policy"]}<br>`,
        button: { text: "Ok" },
      },
    });
  }

  openTermsCondition() {
    this.dialogService.open(ShowcaseDialogComponent, {
      context: {
        title: "Terms and Condition",
        body: `<br>` + this.configs["Terms and Conditions"],
        button: { text: "Ok" },
      },
    });
  }

  onFormSubmit(type: string): void {
    if (type === "login") {
      this.loading = true;
      this.loginForm.value.email = this.loginForm.value.email.toLowerCase();
      this.authService.loginUser(this.loginForm.value).subscribe(
        (userLoginResponse: UserResponse) => {
          if (userLoginResponse.statusCode === 201) {
            localStorage.setItem("userToken", userLoginResponse.data.token);
            localStorage.setItem(
              "userData",
              JSON.stringify(userLoginResponse.data.user)
            );
            this.toastrService.success(
              `${userLoginResponse.message}`,
              "SignIn"
            );
            this.loading = false;
            setTimeout(() => {
              const data = {
                id: userLoginResponse.data.user._id,
                status: "Online",
              };
              // this.messageService.userStatusChange(data);

              this.socketService.emit("user_status_change", data);
              let redirectUrl = this.route.snapshot.paramMap.get("redirectURL");
              if (redirectUrl) {
                redirectUrl = redirectUrl.substring(1);
                this.router.navigate([redirectUrl]);
              } else {
                //this.router.navigate(["pages"]);
                this.router.navigate([this.redirectUrl])
              }

              localStorage.setItem('isFirstTime', 'true');
            });
          } else {
            if (userLoginResponse.statusCode === 403) {
              this.toastrService.danger(userLoginResponse.message, "SignIn");
              this.loading = false;
            } else {
              this.toastrService.danger(
                `Something went wrong while sign in`,
                "SignIn"
              );
              this.loading = false;
            }
          }
        },
        (error) => {
          this.toastrService.danger(
            `${error.error && error.error.message}`,
            "SignIn"
          );
          this.loading = false;
        }
      );
    } else if (type === "registration") {
      this.registrationForm.value.email = this.registrationForm.value.email.toLowerCase();
      this.authService.registerUser(this.registrationForm.value).subscribe(
        (userLoginResponse: UserResponse) => {
          if (userLoginResponse.statusCode === 201) {
            // this.toastrService.success(`${userLoginResponse.message}`, 'SignUp');
            this.textDisplay = userLoginResponse.message;
            this.loading = false;
            this.initForms();
          } else {
            this.toastrService.danger(`${userLoginResponse.message}`, "SignUp");
            this.loading = false;
          }
        },
        (error) => {
          this.toastrService.danger(
            `${error.error && error.error.message}`,
            "SignUp"
          );
          this.loading = false;
        }
      );
    }
  }

  redirectForgotPassword() {
    this.router.navigate(["/auth/forgot-password"]);
  }

  ngOnDestroy(){
    if(this.loginSubscription){
      this.loginSubscription.unsubscribe();
    }
    if(this.titleSubscription){
      this.titleSubscription.unsubscribe();
    }

    if(this.loginLogoSubscription){
      this.loginLogoSubscription.unsubscribe();
    }

    if(this.appNameSubscription){
      this.appNameSubscription.unsubscribe();
    }
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  alphabetOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 65 || charCode > 122)) {
      return false;
    }
    return true;

  }
}
