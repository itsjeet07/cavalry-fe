(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{lBUW:function(t,n,o){"use strict";o.r(n),o.d(n,"AuthModule",(function(){return v}));var e=o("ofXK"),i=o("McNs"),r=o("tyNb"),a=o("3Pt+"),s=o("ZF+8"),l=o("1ua0"),c=o("yFR0"),g=o("QLLi"),d=o("mLsC"),b=o("fXoL"),m=o("aceb"),p=o("jhN1");function h(t,n){if(1&t&&(b.Wb(0,"div",29),b.Wb(1,"div",30),b.Rb(2,"img",31),b.Vb(),b.Wb(3,"div",32),b.Wb(4,"span",33),b.ad(5,"Successful"),b.Vb(),b.Wb(6,"span",34),b.ad(7),b.Vb(),b.Vb(),b.Vb()),2&t){const t=b.lc();b.Db(7),b.bd(t.textDisplay)}}let u=(()=>{class t extends i.e{constructor(t,n,o,e,i,r,a,s,l,c,g,d){super(e,{},i,r),this.formBuilder=t,this.authService=n,this.toastrService=o,this.socketService=a,this.dialogService=s,this.messageService=l,this.tableService=c,this.titleService=g,this.route=d,this.loading=!1,this.configs={},localStorage.getItem("userToken")&&this.router.navigate(["pages"]),this.initForms()}ngOnInit(){document.getElementById("main_body").classList.add("login_body"),this.tableService.getSystemConfig().subscribe(t=>{this.configs=t,this.titleService.setTitle(t["Company Name"])})}initForms(){this.loginForm=this.formBuilder.group({email:["",a.J.required],password:["",a.J.required]}),this.registrationForm=this.formBuilder.group({firstName:["",a.J.required],lastName:[""],mobileNumber:["",a.J.required],email:["",[a.J.required,a.J.email]],password:["",a.J.required],privacy:["",a.J.required]})}openPrivacyPolicy(){this.dialogService.open(l.a,{context:{title:"PRIVACY POLICY",body:`<br>${this.configs["Privacy Policy"]}<br>`,button:{text:"Ok"}}})}openTermsCondition(){this.dialogService.open(l.a,{context:{title:"Terms and Condition",body:"<br>"+this.configs["Terms and Conditions"],button:{text:"Ok"}}})}onFormSubmit(t){"login"===t?(this.loading=!0,this.authService.loginUser(this.loginForm.value).subscribe(t=>{201===t.statusCode?(localStorage.setItem("userToken",t.data.token),localStorage.setItem("userData",JSON.stringify(t.data.user)),this.toastrService.success(""+t.message,"SignIn"),this.loading=!1,setTimeout(()=>{this.socketService.emit("user_status_change",{id:t.data.user._id,status:"Online"});let n=this.route.snapshot.paramMap.get("redirectURL");n?(n=n.substring(1),this.router.navigate([n])):this.router.navigate(["pages"]),localStorage.setItem("isFirstTime","true")})):403===t.statusCode?(this.toastrService.danger(t.message,"SignIn"),this.loading=!1):(this.toastrService.danger("Something went wrong while sign in","SignIn"),this.loading=!1)},t=>{this.toastrService.danger(""+(t.error&&t.error.message),"SignIn"),this.loading=!1})):"registration"===t&&this.authService.registerUser(this.registrationForm.value).subscribe(t=>{201===t.statusCode?(this.textDisplay=t.message,this.loading=!1,this.initForms()):(this.toastrService.danger(""+t.message,"SignUp"),this.loading=!1)},t=>{this.toastrService.danger(""+(t.error&&t.error.message),"SignUp"),this.loading=!1})}redirectForgotPassword(){this.router.navigate(["/auth/forgot-password"])}}return t.\u0275fac=function(n){return new(n||t)(b.Qb(a.i),b.Qb(s.a),b.Qb(m.bc),b.Qb(i.c),b.Qb(b.h),b.Qb(r.c),b.Qb(c.a),b.Qb(m.R),b.Qb(g.a),b.Qb(d.a),b.Qb(p.c),b.Qb(r.a))},t.\u0275cmp=b.Kb({type:t,selectors:[["ngx-login"]],features:[b.Ab],decls:46,vars:8,consts:[["class","message_Box",4,"ngIf"],[1,"h-100","d-flex","justify-content-center","align-items-center"],[1,"example-card","shadow-lg","bg-white"],[1,"layout_logo"],[1,"logo"],["width","40",3,"src"],[1,"card-body"],["nbSpinnerSize","large","nbSpinnerStatus","primary",1,"scroller",3,"nbSpinner"],["fullWidth",""],["tabTitle","SIGN IN"],["src","assets/images/user.png","alt","user","width","30"],[1,"mt-1",3,"formGroup","ngSubmit"],["formControlName","email","placeholder","login","type","email",1,"form-control","shadow-none","p-3","mb-2","h-25","bg-light","rounded"],["formControlName","password","placeholder","password","type","password",1,"form-control","shadow-none","p-3","mb-2","h-25","bg-light","rounded"],["type","submit",1,"btn","btn-primary","btn-lg","w-50","mb-1",3,"disabled"],[1,"forgot-password","shadow-none","p-3","bg-light","w-100",2,"margin-top","15px"],["type","button",1,"btn","btn-link",3,"click"],["tabTitle","SIGN UP"],["formControlName","firstName","placeholder","First Name","type","text",1,"form-control","shadow-none","p-3","mb-2","h-25","bg-light","rounded"],["formControlName","lastName","placeholder","Last Name","type","text",1,"form-control","shadow-none","p-3","mb-2","h-25","bg-light","rounded"],["formControlName","mobileNumber","placeholder","Mobile Number","type","tel",1,"form-control","shadow-none","p-3","mb-2","h-25","bg-light","rounded"],["formControlName","email","placeholder","Email","type","email",1,"form-control","shadow-none","p-3","mb-2","h-25","bg-light","rounded"],["formControlName","password","placeholder","Password","type","password",1,"form-control","shadow-none","p-3","mb-2","h-25","bg-light","rounded"],[1,"d-flex","flex-column","align-items-center"],[1,"d-flex","flex-row","align-items-center"],["type","checkbox","required","","formControlName","privacy"],[1,"ml-2","font-s"],["type","button",1,"btn","btn-link","btn-sm",3,"click"],[1,"font-s"],[1,"message_Box"],[1,"icon_image"],["src","assets/images/pending-check.png"],[1,"message_Box1"],[1,"success"],[1,"message_boxtext"]],template:function(t,n){1&t&&(b.Yc(0,h,8,1,"div",0),b.Wb(1,"div",1),b.Wb(2,"div",2),b.Wb(3,"div",3),b.Wb(4,"span",4),b.Rb(5,"img",5),b.Vb(),b.Vb(),b.Wb(6,"div",6),b.Wb(7,"nb-card",7),b.Wb(8,"nb-tabset",8),b.Wb(9,"nb-tab",9),b.Wb(10,"span"),b.Rb(11,"img",10),b.Vb(),b.Wb(12,"form",11),b.hc("ngSubmit",(function(){return n.onFormSubmit("login")})),b.Rb(13,"input",12),b.Rb(14,"input",13),b.Wb(15,"button",14),b.ad(16," LOG IN "),b.Vb(),b.Wb(17,"div",15),b.Wb(18,"button",16),b.hc("click",(function(){return n.redirectForgotPassword()})),b.ad(19,"Forgot Password?"),b.Vb(),b.Vb(),b.Vb(),b.Vb(),b.Wb(20,"nb-tab",17),b.Wb(21,"span"),b.Rb(22,"img",10),b.Vb(),b.Wb(23,"form",11),b.hc("ngSubmit",(function(){return n.onFormSubmit("registration")})),b.Rb(24,"input",18),b.Rb(25,"input",19),b.Rb(26,"input",20),b.Rb(27,"input",21),b.Rb(28,"input",22),b.Wb(29,"div",23),b.Wb(30,"div",24),b.Rb(31,"input",25),b.Wb(32,"small",26),b.ad(33),b.Vb(),b.Vb(),b.Wb(34,"span",24),b.Wb(35,"button",27),b.hc("click",(function(){return n.openTermsCondition()})),b.Wb(36,"small",28),b.ad(37,"Terms&Condition"),b.Vb(),b.Vb(),b.Wb(38,"small",28),b.ad(39," and "),b.Vb(),b.Wb(40,"button",27),b.hc("click",(function(){return n.openPrivacyPolicy()})),b.Wb(41,"small",28),b.ad(42,"Privacy Policy"),b.Vb(),b.Vb(),b.Vb(),b.Vb(),b.Rb(43,"br"),b.Wb(44,"button",14),b.ad(45," Sign Up "),b.Vb(),b.Vb(),b.Vb(),b.Vb(),b.Vb(),b.Vb(),b.Vb(),b.Vb()),2&t&&(b.uc("ngIf",n.textDisplay),b.Db(5),b.vc("src",n.configs["Login Logo URL"],b.Pc),b.Db(2),b.uc("nbSpinner",n.loading),b.Db(5),b.uc("formGroup",n.loginForm),b.Db(3),b.uc("disabled",!n.loginForm.valid),b.Db(8),b.uc("formGroup",n.registrationForm),b.Db(10),b.cd("By signing up, you agree to ",n.configs["App Name"]||"Synccos's",""),b.Db(11),b.uc("disabled",!n.registrationForm.valid))},directives:[e.u,m.C,m.Nb,m.Wb,m.Vb,a.L,a.w,a.n,a.e,a.v,a.l,a.c,a.b],styles:[".nb-theme-default.login_body nb-card-header{display:none!important}  .nb-theme-default.login_body nb-layout-column{background:#55b9ec!important;padding:0!important}  .nb-theme-default.login_body nb-card{border:none;background-color:inherit!important;display:block!important;flex-direction:unset!important;height:auto!important;position:relative;top:50%;left:50%;transform:translate(-50%,-50%)}  .nb-theme-default.login_body ngx-login nb-card{margin-bottom:0!important;top:0;left:0;transform:none}  .nb-theme-default.login_body nb-dialog-container nb-card-header{display:block!important}  .nb-theme-default.login_body nb-dialog-container nb-card{display:flex!important;flex-direction:column!important;background-color:#fff!important;border:.0625rem solid #e4e9f2!important;height:auto!important;position:unset!important;top:0;left:0;transform:translate(0)}.example-card[_ngcontent-%COMP%]{width:450px;border-radius:10px}.scroller[_ngcontent-%COMP%]{height:100vh;overflow:auto}  .login_body nb-tabset .tabset{height:100%;display:flex;flex-direction:column;border-bottom:none!important;justify-content:center!important}  .login_body nb-tab{text-align:center;padding:10px!important}[_nghost-%COMP%]     .login_body ngx-tab1, [_nghost-%COMP%]     .login_body ngx-tab2{display:block;padding:1rem 2rem}[_ngcontent-%COMP%]::-webkit-input-placeholder{text-align:center}[_ngcontent-%COMP%]:-moz-placeholder, [_ngcontent-%COMP%]::-moz-placeholder{text-align:center}[_ngcontent-%COMP%]:-ms-input-placeholder{text-align:center}.login_body[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%]{background-color:#55b9ec;border-color:#55b9ec;font-size:small;padding:12px}.forgot-password[_ngcontent-%COMP%]{bottom:0;height:80px;background-color:#f6f6f6!important;text-align:center;border-top:2px solid #edeef0;border-bottom-left-radius:10px;border-bottom-right-radius:10px}.forgot-password[_ngcontent-%COMP%]   .btn-link[_ngcontent-%COMP%]{color:#b8c5d2}.btn-link[_ngcontent-%COMP%]:focus{box-shadow:none}input[_ngcontent-%COMP%]{border:none;background:#f6f6f6!important}.welcome-message[_ngcontent-%COMP%]{text-align:center}.layout_logo[_ngcontent-%COMP%]{display:flex;justify-content:center;margin-top:12px}.layout_logo[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{width:150px;height:110px;display:block}.layout_logo[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block}.font-s[_ngcontent-%COMP%]{font-size:small}.message_Box[_ngcontent-%COMP%]{width:450px;margin:10px auto;background-color:#00d68f;padding:10px;font-size:16px;display:flex;flex-direction:row;border-radius:10px;align-items:center}.message_Box[_ngcontent-%COMP%]   .icon_image[_ngcontent-%COMP%]{width:40px;height:40px;display:block}.message_Box[_ngcontent-%COMP%]   .icon_image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:flex-start;width:85%;margin-left:15px}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]   .success[_ngcontent-%COMP%]{font-size:18px;line-height:22px;color:#fff;font-weight:600}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]   .message_boxtext[_ngcontent-%COMP%]{font-size:14px;line-height:20px;color:#fff;font-weight:500}"]}),t})();function f(t,n){if(1&t){const t=b.Xb();b.Wb(0,"nb-alert",16),b.hc("close",(function(){return b.Mc(t),b.lc(2).onClose()})),b.ad(1),b.Vb()}if(2&t){const t=b.lc(2);b.uc("status",t.emailStatus),b.Db(1),b.cd(" ",t.emailResponse," ")}}function _(t,n){if(1&t&&(b.Wb(0,"div",0),b.Wb(1,"nb-card-body",14),b.Yc(2,f,2,2,"nb-alert",15),b.Vb(),b.Vb()),2&t){const t=b.lc();b.Db(2),b.uc("ngIf",t.emailStatus)}}function x(t,n){if(1&t){const t=b.Xb();b.Wb(0,"nb-alert",17),b.hc("close",(function(){return b.Mc(t),b.lc(2).onClose()})),b.ad(1),b.Vb()}if(2&t){const t=b.lc(2);b.uc("status",t.emailStatus),b.Db(1),b.cd(" ",t.emailResponse," ")}}function y(t,n){if(1&t&&(b.Wb(0,"div",0),b.Wb(1,"nb-card-body",15),b.Yc(2,x,2,2,"nb-alert",16),b.Vb(),b.Vb()),2&t){const t=b.lc();b.Db(2),b.uc("ngIf",t.emailStatus)}}const P=[{path:"",component:i.a,children:[{path:"",component:u},{path:"login",component:u},{path:"logout",component:u},{path:"forgot-password",component:(()=>{class t{constructor(t,n,o,e,i,r){this.formBuilder=t,this.router=n,this.authService=o,this.toastrService=e,this.titleService=i,this.tableService=r,this.loading=!1,this.emailStatus="",this.emailResponse="",this.showFlashMessage=!1,this.configs={},this.forgotPasswordForm=this.formBuilder.group({email:["",[a.J.required,a.J.email]]})}ngOnInit(){document.getElementById("main_body").classList.add("login_body"),this.tableService.getSystemConfig().subscribe(t=>{this.configs=t,this.titleService.setTitle(t["Company Name"])})}onFormSubmit(){this.loading=!0,this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe(t=>{this.loading=!1,200===t.statusCode?(this.forgotPasswordForm.setValue({email:""}),this.emailStatus="success",this.emailResponse=t.message):(this.emailStatus="danger",this.emailResponse=t.message),this.showFlashMessage=!0},t=>{this.toastrService.danger(""+(t.error&&t.error.message),"Forgot Password"),this.loading=!1})}redirectToLogin(){this.router.navigate(["/auth/login"])}onClose(){this.showFlashMessage=!1}}return t.\u0275fac=function(n){return new(n||t)(b.Qb(a.i),b.Qb(r.c),b.Qb(s.a),b.Qb(m.bc),b.Qb(p.c),b.Qb(d.a))},t.\u0275cmp=b.Kb({type:t,selectors:[["ngx-forgot-password"]],decls:17,vars:5,consts:[[1,"h-100","d-flex","justify-content-center","align-items-center"],[1,"example-card","shadow-lg","bg-white"],[1,"layout_logo"],[1,"logo"],["width","40",3,"src"],[1,"card-body"],["class","h-100 d-flex justify-content-center align-items-center",4,"ngIf"],["nbSpinnerSize","large","nbSpinnerStatus","primary",1,"scroller",3,"nbSpinner"],["src","assets/images/user.png","alt","user","width","30"],[1,"mt-1",3,"formGroup","ngSubmit"],["formControlName","email","placeholder","Email","type","email",1,"form-control","shadow-none","p-3","mb-2","h-25","bg-light","rounded"],["type","submit",1,"btn","btn-primary","btn-lg","w-50","mb-1",3,"disabled"],[1,"forgot-password","shadow-none","p-3","bg-light","w-100",2,"margin-top","15px"],["type","button",1,"btn","btn-link",3,"click"],[1,"example-last-child-no-b-margin"],["closable","",3,"status","close",4,"ngIf"],["closable","",3,"status","close"]],template:function(t,n){1&t&&(b.Wb(0,"div",0),b.Wb(1,"div",1),b.Wb(2,"div",2),b.Wb(3,"span",3),b.Rb(4,"img",4),b.Vb(),b.Vb(),b.Wb(5,"div",5),b.Yc(6,_,3,1,"div",6),b.Wb(7,"nb-card",7),b.Wb(8,"span"),b.Rb(9,"img",8),b.Vb(),b.Wb(10,"form",9),b.hc("ngSubmit",(function(){return n.onFormSubmit()})),b.Rb(11,"input",10),b.Wb(12,"button",11),b.ad(13," SUBMIT "),b.Vb(),b.Wb(14,"div",12),b.Wb(15,"button",13),b.hc("click",(function(){return n.redirectToLogin()})),b.ad(16,"LOG IN"),b.Vb(),b.Vb(),b.Vb(),b.Vb(),b.Vb(),b.Vb(),b.Vb()),2&t&&(b.Db(4),b.vc("src",n.configs["Login Logo URL"],b.Pc),b.Db(2),b.uc("ngIf",n.showFlashMessage),b.Db(1),b.uc("nbSpinner",n.loading),b.Db(3),b.uc("formGroup",n.forgotPasswordForm),b.Db(2),b.uc("disabled",n.forgotPasswordForm.invalid))},directives:[e.u,m.C,m.Nb,a.L,a.w,a.n,a.e,a.v,a.l,m.B,m.o],styles:[".nb-theme-default.login_body nb-card-header{display:none!important}  .nb-theme-default.login_body nb-layout-column{background:#55b9ec!important;padding:0!important}  .nb-theme-default.login_body nb-card{border:none;background-color:inherit!important;display:block!important;flex-direction:unset!important;height:auto!important;position:relative;top:50%;left:50%;transform:translate(-50%,-50%)}  .nb-theme-default.login_body ngx-login nb-card{margin-bottom:0!important;top:0;left:0;transform:none}  .nb-theme-default.login_body nb-dialog-container nb-card-header{display:block!important}  .nb-theme-default.login_body nb-dialog-container nb-card{display:flex!important;flex-direction:column!important;background-color:#fff!important;border:.0625rem solid #e4e9f2!important;height:auto!important;position:unset!important;top:0;left:0;transform:translate(0)}.example-card[_ngcontent-%COMP%]{width:450px;border-radius:10px}.scroller[_ngcontent-%COMP%]{height:100vh;overflow:auto}  .login_body nb-tabset .tabset{height:100%;display:flex;flex-direction:column;border-bottom:none!important;justify-content:center!important}  .login_body nb-tab{text-align:center;padding:10px!important}[_nghost-%COMP%]     .login_body ngx-tab1, [_nghost-%COMP%]     .login_body ngx-tab2{display:block;padding:1rem 2rem}[_ngcontent-%COMP%]::-webkit-input-placeholder{text-align:center}[_ngcontent-%COMP%]:-moz-placeholder, [_ngcontent-%COMP%]::-moz-placeholder{text-align:center}[_ngcontent-%COMP%]:-ms-input-placeholder{text-align:center}.login_body[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%]{background-color:#55b9ec;border-color:#55b9ec;font-size:small;padding:12px}.forgot-password[_ngcontent-%COMP%]{bottom:0;height:80px;background-color:#f6f6f6!important;text-align:center;border-top:2px solid #edeef0;border-bottom-left-radius:10px;border-bottom-right-radius:10px}.forgot-password[_ngcontent-%COMP%]   .btn-link[_ngcontent-%COMP%]{color:#b8c5d2}.btn-link[_ngcontent-%COMP%]:focus{box-shadow:none}input[_ngcontent-%COMP%]{border:none;background:#f6f6f6!important}.welcome-message[_ngcontent-%COMP%]{text-align:center}.layout_logo[_ngcontent-%COMP%]{display:flex;justify-content:center;margin-top:12px}.layout_logo[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{width:150px;height:110px;display:block}.layout_logo[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block}.font-s[_ngcontent-%COMP%]{font-size:small}.message_Box[_ngcontent-%COMP%]{width:450px;margin:10px auto;background-color:#00d68f;padding:10px;font-size:16px;display:flex;flex-direction:row;border-radius:10px;align-items:center}.message_Box[_ngcontent-%COMP%]   .icon_image[_ngcontent-%COMP%]{width:40px;height:40px;display:block}.message_Box[_ngcontent-%COMP%]   .icon_image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:flex-start;width:85%;margin-left:15px}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]   .success[_ngcontent-%COMP%]{font-size:18px;line-height:22px;color:#fff;font-weight:600}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]   .message_boxtext[_ngcontent-%COMP%]{font-size:14px;line-height:20px;color:#fff;font-weight:500}",".nb-theme-default.login_body nb-card-header{display:none!important}  .nb-theme-default.login_body nb-layout-column{background:#55b9ec!important;padding:0!important}  .nb-theme-default.login_body nb-card{border:none;background-color:inherit!important;display:block!important;flex-direction:unset!important;height:auto!important;position:relative;top:50%;left:50%;transform:translate(-50%,-50%)}  .nb-theme-default.login_body ngx-login nb-card{margin-bottom:0!important;top:0;left:0;transform:none}  .forgot-card{margin-bottom:0!important;top:0!important;left:0!important;transform:none!important}  .nb-theme-default.login_body nb-dialog-container nb-card-header{display:block!important}  .nb-theme-default.login_body nb-dialog-container nb-card{display:flex!important;flex-direction:column!important;background-color:#fff!important;border:.0625rem solid #e4e9f2!important;height:auto!important;position:unset!important;top:0;left:0;transform:translate(0)}.example-card[_ngcontent-%COMP%]{width:450px;border-radius:10px}.scroller[_ngcontent-%COMP%]{height:100vh;overflow:auto}  .login_body nb-tabset .tabset{height:100%;display:flex;flex-direction:column;border-bottom:none!important;justify-content:center!important}  .login_body nb-tab{text-align:center;padding:10px!important}[_nghost-%COMP%]     .login_body ngx-tab1, [_nghost-%COMP%]     .login_body ngx-tab2{display:block;padding:1rem 2rem}[_ngcontent-%COMP%]::-webkit-input-placeholder{text-align:center}[_ngcontent-%COMP%]:-moz-placeholder, [_ngcontent-%COMP%]::-moz-placeholder{text-align:center}[_ngcontent-%COMP%]:-ms-input-placeholder{text-align:center}.login_body[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%]{background-color:#55b9ec;border-color:#55b9ec;font-size:small;padding:12px}.forgot-password[_ngcontent-%COMP%]{bottom:0;height:80px;background-color:#f6f6f6!important;text-align:center;border-top:2px solid #edeef0;border-bottom-left-radius:10px;border-bottom-right-radius:10px}.forgot-password[_ngcontent-%COMP%]   .btn-link[_ngcontent-%COMP%]{color:#b8c5d2}.btn-link[_ngcontent-%COMP%]:focus{box-shadow:none}input[_ngcontent-%COMP%]{border:none;background:#f6f6f6!important}.welcome-message[_ngcontent-%COMP%]{text-align:center}.layout_logo[_ngcontent-%COMP%]{display:flex;justify-content:center;margin-top:12px}.layout_logo[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{width:150px;height:110px;display:block}.layout_logo[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block}.font-s[_ngcontent-%COMP%]{font-size:small}.message_Box[_ngcontent-%COMP%]{width:450px;margin:10px auto;background-color:#00d68f;padding:10px;font-size:16px;display:flex;flex-direction:row;border-radius:10px;align-items:center}.message_Box[_ngcontent-%COMP%]   .icon_image[_ngcontent-%COMP%]{width:40px;height:40px;display:block}.message_Box[_ngcontent-%COMP%]   .icon_image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:flex-start;width:85%;margin-left:15px}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]   .success[_ngcontent-%COMP%]{font-size:18px;line-height:22px;color:#fff;font-weight:600}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]   .message_boxtext[_ngcontent-%COMP%]{font-size:14px;line-height:20px;color:#fff;font-weight:500}.scroller[_ngcontent-%COMP%]{margin-bottom:0!important;top:0!important;left:0!important;transform:none!important;border:none;text-align:center;height:auto}"]}),t})()},{path:"reset-password/:id",component:(()=>{class t{constructor(t,n,o,e,i){this.formBuilder=t,this.router=n,this.authService=o,this.toastrService=e,this.activatedRoute=i,this.loading=!1,this.isPasswordNotMatch=!1,this.token="",this.showFlashMessage=!1,this.emailStatus="",this.emailResponse="",this.resetPasswordForm=this.formBuilder.group({password:["",[a.J.required]],confirmPassword:["",[a.J.required]]})}ngOnInit(){this.token=this.activatedRoute.snapshot.params.id,document.getElementById("main_body").classList.add("login_body"),this.validateToken()}onConfirmPasswordChange(){this.resetPasswordForm.value.password!=this.resetPasswordForm.value.confirmPassword?(this.toastrService.danger("Passwords are not matching.","Reset Password"),this.isPasswordNotMatch=!0):this.isPasswordNotMatch=!1}validateToken(){this.authService.validateToken(this.token).subscribe(t=>{200!==t.statusCode&&(this.emailStatus="danger",this.emailResponse=t.message,this.showFlashMessage=!0)},t=>{})}fireRequest(){this.authService.resetPassword(this.resetPasswordForm.value,this.token).subscribe(t=>{200===t.statusCode?(this.toastrService.success(""+t.message,"Reset Password"),this.router.navigate(["/auth/login"]),this.loading=!1,this.emailStatus="success",this.emailResponse=t.message):(this.emailStatus="danger",this.emailResponse=t.message,this.toastrService.danger(""+t.message,"Reset Password"),this.loading=!1)},t=>{this.toastrService.danger(""+(t.error&&t.error.message),"Reset Password"),this.loading=!1})}onFormSubmit(){this.resetPasswordForm.invalid?this.toastrService.danger("Please enter password and confirm it.","Reset Password"):this.isPasswordNotMatch?this.toastrService.danger("Passwords are not matching.","Reset Password"):(this.loading=!0,this.fireRequest())}redirectToLogin(){this.router.navigate(["/auth/login"])}onClose(){this.showFlashMessage=!1}}return t.\u0275fac=function(n){return new(n||t)(b.Qb(a.i),b.Qb(r.c),b.Qb(s.a),b.Qb(m.bc),b.Qb(r.a))},t.\u0275cmp=b.Kb({type:t,selectors:[["ngx-reset-password"]],decls:18,vars:3,consts:[[1,"h-100","d-flex","justify-content-center","align-items-center"],[1,"example-card","shadow-lg","bg-white"],[1,"layout_logo"],[1,"logo"],["src","assets/images/cavalry-signin.png","width","40"],[1,"card-body"],["class","h-100 d-flex justify-content-center align-items-center",4,"ngIf"],["nbSpinnerSize","large","nbSpinnerStatus","primary",1,"scroller",3,"nbSpinner"],["src","assets/images/user.png","alt","user","width","30"],[1,"mt-1",3,"formGroup","ngSubmit"],["formControlName","password","placeholder","Password","type","password",1,"form-control","shadow-none","p-3","mb-2","h-25","bg-light","rounded"],["formControlName","confirmPassword","placeholder","Confirm Password","type","password",1,"form-control","shadow-none","p-3","mb-2","h-25","bg-light","rounded",3,"blur"],["type","submit",1,"btn","btn-primary","btn-lg","w-50","mb-1"],[1,"forgot-password","shadow-none","p-3","bg-light","w-100",2,"margin-top","15px"],["type","button",1,"btn","btn-link",3,"click"],[1,"example-last-child-no-b-margin"],["closable","",3,"status","close",4,"ngIf"],["closable","",3,"status","close"]],template:function(t,n){1&t&&(b.Wb(0,"div",0),b.Wb(1,"div",1),b.Wb(2,"div",2),b.Wb(3,"span",3),b.Rb(4,"img",4),b.Vb(),b.Vb(),b.Wb(5,"div",5),b.Yc(6,y,3,1,"div",6),b.Wb(7,"nb-card",7),b.Wb(8,"span"),b.Rb(9,"img",8),b.Vb(),b.Wb(10,"form",9),b.hc("ngSubmit",(function(){return n.onFormSubmit()})),b.Rb(11,"input",10),b.Wb(12,"input",11),b.hc("blur",(function(){return n.onConfirmPasswordChange()})),b.Vb(),b.Wb(13,"button",12),b.ad(14," SUBMIT "),b.Vb(),b.Wb(15,"div",13),b.Wb(16,"button",14),b.hc("click",(function(){return n.redirectToLogin()})),b.ad(17,"LOG IN"),b.Vb(),b.Vb(),b.Vb(),b.Vb(),b.Vb(),b.Vb(),b.Vb()),2&t&&(b.Db(6),b.uc("ngIf",n.showFlashMessage),b.Db(1),b.uc("nbSpinner",n.loading),b.Db(3),b.uc("formGroup",n.resetPasswordForm))},directives:[e.u,m.C,m.Nb,a.L,a.w,a.n,a.e,a.v,a.l,m.B,m.o],styles:[".nb-theme-default.login_body nb-card-header{display:none!important}  .nb-theme-default.login_body nb-layout-column{background:#55b9ec!important;padding:0!important}  .nb-theme-default.login_body nb-card{border:none;background-color:inherit!important;display:block!important;flex-direction:unset!important;height:auto!important;position:relative;top:50%;left:50%;transform:translate(-50%,-50%)}  .nb-theme-default.login_body ngx-login nb-card{margin-bottom:0!important;top:0;left:0;transform:none}  .nb-theme-default.login_body nb-dialog-container nb-card-header{display:block!important}  .nb-theme-default.login_body nb-dialog-container nb-card{display:flex!important;flex-direction:column!important;background-color:#fff!important;border:.0625rem solid #e4e9f2!important;height:auto!important;position:unset!important;top:0;left:0;transform:translate(0)}.example-card[_ngcontent-%COMP%]{width:450px;border-radius:10px}.scroller[_ngcontent-%COMP%]{height:100vh;overflow:auto}  .login_body nb-tabset .tabset{height:100%;display:flex;flex-direction:column;border-bottom:none!important;justify-content:center!important}  .login_body nb-tab{text-align:center;padding:10px!important}[_nghost-%COMP%]     .login_body ngx-tab1, [_nghost-%COMP%]     .login_body ngx-tab2{display:block;padding:1rem 2rem}[_ngcontent-%COMP%]::-webkit-input-placeholder{text-align:center}[_ngcontent-%COMP%]:-moz-placeholder, [_ngcontent-%COMP%]::-moz-placeholder{text-align:center}[_ngcontent-%COMP%]:-ms-input-placeholder{text-align:center}.login_body[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%]{background-color:#55b9ec;border-color:#55b9ec;font-size:small;padding:12px}.forgot-password[_ngcontent-%COMP%]{bottom:0;height:80px;background-color:#f6f6f6!important;text-align:center;border-top:2px solid #edeef0;border-bottom-left-radius:10px;border-bottom-right-radius:10px}.forgot-password[_ngcontent-%COMP%]   .btn-link[_ngcontent-%COMP%]{color:#b8c5d2}.btn-link[_ngcontent-%COMP%]:focus{box-shadow:none}input[_ngcontent-%COMP%]{border:none;background:#f6f6f6!important}.welcome-message[_ngcontent-%COMP%]{text-align:center}.layout_logo[_ngcontent-%COMP%]{display:flex;justify-content:center;margin-top:12px}.layout_logo[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{width:150px;height:110px;display:block}.layout_logo[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block}.font-s[_ngcontent-%COMP%]{font-size:small}.message_Box[_ngcontent-%COMP%]{width:450px;margin:10px auto;background-color:#00d68f;padding:10px;font-size:16px;display:flex;flex-direction:row;border-radius:10px;align-items:center}.message_Box[_ngcontent-%COMP%]   .icon_image[_ngcontent-%COMP%]{width:40px;height:40px;display:block}.message_Box[_ngcontent-%COMP%]   .icon_image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:flex-start;width:85%;margin-left:15px}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]   .success[_ngcontent-%COMP%]{font-size:18px;line-height:22px;color:#fff;font-weight:600}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]   .message_boxtext[_ngcontent-%COMP%]{font-size:14px;line-height:20px;color:#fff;font-weight:500}",".nb-theme-default.login_body nb-card-header{display:none!important}  .nb-theme-default.login_body nb-layout-column{background:#55b9ec!important;padding:0!important}  .nb-theme-default.login_body nb-card{border:none;background-color:inherit!important;display:block!important;flex-direction:unset!important;height:auto!important;position:relative;top:50%;left:50%;transform:translate(-50%,-50%)}  .nb-theme-default.login_body ngx-login nb-card{margin-bottom:0!important;top:0;left:0;transform:none}  .nb-theme-default.login_body nb-dialog-container nb-card-header{display:block!important}  .nb-theme-default.login_body nb-dialog-container nb-card{display:flex!important;flex-direction:column!important;background-color:#fff!important;border:.0625rem solid #e4e9f2!important;height:auto!important;position:unset!important;top:0;left:0;transform:translate(0)}.example-card[_ngcontent-%COMP%]{width:450px;border-radius:10px}.scroller[_ngcontent-%COMP%]{height:100vh;overflow:auto}  .login_body nb-tabset .tabset{height:100%;display:flex;flex-direction:column;border-bottom:none!important;justify-content:center!important}  .login_body nb-tab{text-align:center;padding:10px!important}[_nghost-%COMP%]     .login_body ngx-tab1, [_nghost-%COMP%]     .login_body ngx-tab2{display:block;padding:1rem 2rem}[_ngcontent-%COMP%]::-webkit-input-placeholder{text-align:center}[_ngcontent-%COMP%]:-moz-placeholder, [_ngcontent-%COMP%]::-moz-placeholder{text-align:center}[_ngcontent-%COMP%]:-ms-input-placeholder{text-align:center}.login_body[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%]{background-color:#55b9ec;border-color:#55b9ec;font-size:small;padding:12px}.forgot-password[_ngcontent-%COMP%]{bottom:0;height:80px;background-color:#f6f6f6!important;text-align:center;border-top:2px solid #edeef0;border-bottom-left-radius:10px;border-bottom-right-radius:10px}.forgot-password[_ngcontent-%COMP%]   .btn-link[_ngcontent-%COMP%]{color:#b8c5d2}.btn-link[_ngcontent-%COMP%]:focus{box-shadow:none}input[_ngcontent-%COMP%]{border:none;background:#f6f6f6!important}.welcome-message[_ngcontent-%COMP%]{text-align:center}.layout_logo[_ngcontent-%COMP%]{display:flex;justify-content:center;margin-top:12px}.layout_logo[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{width:150px;height:110px;display:block}.layout_logo[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block}.font-s[_ngcontent-%COMP%]{font-size:small}.message_Box[_ngcontent-%COMP%]{width:450px;margin:10px auto;background-color:#00d68f;padding:10px;font-size:16px;display:flex;flex-direction:row;border-radius:10px;align-items:center}.message_Box[_ngcontent-%COMP%]   .icon_image[_ngcontent-%COMP%]{width:40px;height:40px;display:block}.message_Box[_ngcontent-%COMP%]   .icon_image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:flex-start;width:85%;margin-left:15px}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]   .success[_ngcontent-%COMP%]{font-size:18px;line-height:22px;color:#fff;font-weight:600}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]   .message_boxtext[_ngcontent-%COMP%]{font-size:14px;line-height:20px;color:#fff;font-weight:500}.scroller[_ngcontent-%COMP%]{margin-bottom:0!important;top:0!important;left:0!important;transform:none!important;border:none;text-align:center;height:auto}"]}),t})()}]}];let C=(()=>{class t{}return t.\u0275mod=b.Ob({type:t}),t.\u0275inj=b.Nb({factory:function(n){return new(n||t)},imports:[[r.g.forChild(P)],r.g]}),t})();var M=o("PCNd"),O=o("tk/3"),w=o("eMGG");let v=(()=>{class t{}return t.\u0275mod=b.Ob({type:t}),t.\u0275inj=b.Nb({factory:function(n){return new(n||t)},providers:[{provide:O.a,useClass:w.a,multi:!0}],imports:[[e.c,C,M.a,i.b,m.p]]}),t})()}}]);