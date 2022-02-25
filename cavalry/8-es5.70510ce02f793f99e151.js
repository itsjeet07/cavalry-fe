!function(){function t(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}function n(t,n){for(var e=0;e<n.length;e++){var o=n[e];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function e(t,e,o){return e&&n(t.prototype,e),o&&n(t,o),t}function o(t,n){return(o=Object.setPrototypeOf||function(t,n){return t.__proto__=n,t})(t,n)}function i(t){var n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var e,o=a(t);if(n){var i=a(this).constructor;e=Reflect.construct(o,arguments,i)}else e=o.apply(this,arguments);return r(this,e)}}function r(t,n){return!n||"object"!=typeof n&&"function"!=typeof n?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):n}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{lBUW:function(n,r,a){"use strict";a.r(r),a.d(r,"AuthModule",(function(){return z}));var s=a("ofXK"),l=a("McNs"),c=a("tyNb"),g=a("3Pt+"),d=a("ZF+8"),b=a("1ua0"),m=a("yFR0"),p=a("QLLi"),u=a("mLsC"),f=a("fXoL"),h=a("aceb"),_=a("jhN1");function x(t,n){if(1&t&&(f.Wb(0,"div",29),f.Wb(1,"div",30),f.Rb(2,"img",31),f.Vb(),f.Wb(3,"div",32),f.Wb(4,"span",33),f.ad(5,"Successful"),f.Vb(),f.Wb(6,"span",34),f.ad(7),f.Vb(),f.Vb(),f.Vb()),2&t){var e=f.lc();f.Db(7),f.bd(e.textDisplay)}}var y,P=((y=function(n){!function(t,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(n&&n.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),n&&o(t,n)}(a,n);var r=i(a);function a(n,e,o,i,s,l,c,g,d,b,m,p){var u;return t(this,a),(u=r.call(this,i,{},s,l)).formBuilder=n,u.authService=e,u.toastrService=o,u.socketService=c,u.dialogService=g,u.messageService=d,u.tableService=b,u.titleService=m,u.route=p,u.loading=!1,u.configs={},localStorage.getItem("userToken")&&u.router.navigate(["pages"]),u.initForms(),u}return e(a,[{key:"ngOnInit",value:function(){var t=this;document.getElementById("main_body").classList.add("login_body"),this.tableService.getSystemConfig().subscribe((function(n){t.configs=n,t.titleService.setTitle(n["Company Name"])}))}},{key:"initForms",value:function(){this.loginForm=this.formBuilder.group({email:["",g.J.required],password:["",g.J.required]}),this.registrationForm=this.formBuilder.group({firstName:["",g.J.required],lastName:[""],mobileNumber:["",g.J.required],email:["",[g.J.required,g.J.email]],password:["",g.J.required],privacy:["",g.J.required]})}},{key:"openPrivacyPolicy",value:function(){this.dialogService.open(b.a,{context:{title:"PRIVACY POLICY",body:"<br>".concat(this.configs["Privacy Policy"],"<br>"),button:{text:"Ok"}}})}},{key:"openTermsCondition",value:function(){this.dialogService.open(b.a,{context:{title:"Terms and Condition",body:"<br>"+this.configs["Terms and Conditions"],button:{text:"Ok"}}})}},{key:"onFormSubmit",value:function(t){var n=this;"login"===t?(this.loading=!0,this.authService.loginUser(this.loginForm.value).subscribe((function(t){201===t.statusCode?(localStorage.setItem("userToken",t.data.token),localStorage.setItem("userData",JSON.stringify(t.data.user)),n.toastrService.success(""+t.message,"SignIn"),n.loading=!1,setTimeout((function(){n.socketService.emit("user_status_change",{id:t.data.user._id,status:"Online"});var e=n.route.snapshot.paramMap.get("redirectURL");e?(e=e.substring(1),n.router.navigate([e])):n.router.navigate(["pages"]),localStorage.setItem("isFirstTime","true")}))):403===t.statusCode?(n.toastrService.danger(t.message,"SignIn"),n.loading=!1):(n.toastrService.danger("Something went wrong while sign in","SignIn"),n.loading=!1)}),(function(t){n.toastrService.danger(""+(t.error&&t.error.message),"SignIn"),n.loading=!1}))):"registration"===t&&this.authService.registerUser(this.registrationForm.value).subscribe((function(t){201===t.statusCode?(n.textDisplay=t.message,n.loading=!1,n.initForms()):(n.toastrService.danger(""+t.message,"SignUp"),n.loading=!1)}),(function(t){n.toastrService.danger(""+(t.error&&t.error.message),"SignUp"),n.loading=!1}))}},{key:"redirectForgotPassword",value:function(){this.router.navigate(["/auth/forgot-password"])}}]),a}(l.e)).\u0275fac=function(t){return new(t||y)(f.Qb(g.i),f.Qb(d.a),f.Qb(h.bc),f.Qb(l.c),f.Qb(f.h),f.Qb(c.c),f.Qb(m.a),f.Qb(h.R),f.Qb(p.a),f.Qb(u.a),f.Qb(_.c),f.Qb(c.a))},y.\u0275cmp=f.Kb({type:y,selectors:[["ngx-login"]],features:[f.Ab],decls:46,vars:8,consts:[["class","message_Box",4,"ngIf"],[1,"h-100","d-flex","justify-content-center","align-items-center"],[1,"example-card","shadow-lg","bg-white"],[1,"layout_logo"],[1,"logo"],["width","40",3,"src"],[1,"card-body"],["nbSpinnerSize","large","nbSpinnerStatus","primary",1,"scroller",3,"nbSpinner"],["fullWidth",""],["tabTitle","SIGN IN"],["src","assets/images/user.png","alt","user","width","30"],[1,"mt-1",3,"formGroup","ngSubmit"],["formControlName","email","placeholder","login","type","email",1,"form-control","shadow-none","p-3","mb-2","h-25","bg-light","rounded"],["formControlName","password","placeholder","password","type","password",1,"form-control","shadow-none","p-3","mb-2","h-25","bg-light","rounded"],["type","submit",1,"btn","btn-primary","btn-lg","w-50","mb-1",3,"disabled"],[1,"forgot-password","shadow-none","p-3","bg-light","w-100",2,"margin-top","15px"],["type","button",1,"btn","btn-link",3,"click"],["tabTitle","SIGN UP"],["formControlName","firstName","placeholder","First Name","type","text",1,"form-control","shadow-none","p-3","mb-2","h-25","bg-light","rounded"],["formControlName","lastName","placeholder","Last Name","type","text",1,"form-control","shadow-none","p-3","mb-2","h-25","bg-light","rounded"],["formControlName","mobileNumber","placeholder","Mobile Number","type","tel",1,"form-control","shadow-none","p-3","mb-2","h-25","bg-light","rounded"],["formControlName","email","placeholder","Email","type","email",1,"form-control","shadow-none","p-3","mb-2","h-25","bg-light","rounded"],["formControlName","password","placeholder","Password","type","password",1,"form-control","shadow-none","p-3","mb-2","h-25","bg-light","rounded"],[1,"d-flex","flex-column","align-items-center"],[1,"d-flex","flex-row","align-items-center"],["type","checkbox","required","","formControlName","privacy"],[1,"ml-2","font-s"],["type","button",1,"btn","btn-link","btn-sm",3,"click"],[1,"font-s"],[1,"message_Box"],[1,"icon_image"],["src","assets/images/pending-check.png"],[1,"message_Box1"],[1,"success"],[1,"message_boxtext"]],template:function(t,n){1&t&&(f.Yc(0,x,8,1,"div",0),f.Wb(1,"div",1),f.Wb(2,"div",2),f.Wb(3,"div",3),f.Wb(4,"span",4),f.Rb(5,"img",5),f.Vb(),f.Vb(),f.Wb(6,"div",6),f.Wb(7,"nb-card",7),f.Wb(8,"nb-tabset",8),f.Wb(9,"nb-tab",9),f.Wb(10,"span"),f.Rb(11,"img",10),f.Vb(),f.Wb(12,"form",11),f.hc("ngSubmit",(function(){return n.onFormSubmit("login")})),f.Rb(13,"input",12),f.Rb(14,"input",13),f.Wb(15,"button",14),f.ad(16," LOG IN "),f.Vb(),f.Wb(17,"div",15),f.Wb(18,"button",16),f.hc("click",(function(){return n.redirectForgotPassword()})),f.ad(19,"Forgot Password?"),f.Vb(),f.Vb(),f.Vb(),f.Vb(),f.Wb(20,"nb-tab",17),f.Wb(21,"span"),f.Rb(22,"img",10),f.Vb(),f.Wb(23,"form",11),f.hc("ngSubmit",(function(){return n.onFormSubmit("registration")})),f.Rb(24,"input",18),f.Rb(25,"input",19),f.Rb(26,"input",20),f.Rb(27,"input",21),f.Rb(28,"input",22),f.Wb(29,"div",23),f.Wb(30,"div",24),f.Rb(31,"input",25),f.Wb(32,"small",26),f.ad(33),f.Vb(),f.Vb(),f.Wb(34,"span",24),f.Wb(35,"button",27),f.hc("click",(function(){return n.openTermsCondition()})),f.Wb(36,"small",28),f.ad(37,"Terms&Condition"),f.Vb(),f.Vb(),f.Wb(38,"small",28),f.ad(39," and "),f.Vb(),f.Wb(40,"button",27),f.hc("click",(function(){return n.openPrivacyPolicy()})),f.Wb(41,"small",28),f.ad(42,"Privacy Policy"),f.Vb(),f.Vb(),f.Vb(),f.Vb(),f.Rb(43,"br"),f.Wb(44,"button",14),f.ad(45," Sign Up "),f.Vb(),f.Vb(),f.Vb(),f.Vb(),f.Vb(),f.Vb(),f.Vb(),f.Vb()),2&t&&(f.uc("ngIf",n.textDisplay),f.Db(5),f.vc("src",n.configs["Login Logo URL"],f.Pc),f.Db(2),f.uc("nbSpinner",n.loading),f.Db(5),f.uc("formGroup",n.loginForm),f.Db(3),f.uc("disabled",!n.loginForm.valid),f.Db(8),f.uc("formGroup",n.registrationForm),f.Db(10),f.cd("By signing up, you agree to ",n.configs["App Name"]||"Synccos's",""),f.Db(11),f.uc("disabled",!n.registrationForm.valid))},directives:[s.u,h.C,h.Nb,h.Wb,h.Vb,g.L,g.w,g.n,g.e,g.v,g.l,g.c,g.b],styles:[".nb-theme-default.login_body nb-card-header{display:none!important}  .nb-theme-default.login_body nb-layout-column{background:#55b9ec!important;padding:0!important}  .nb-theme-default.login_body nb-card{border:none;background-color:inherit!important;display:block!important;flex-direction:unset!important;height:auto!important;position:relative;top:50%;left:50%;transform:translate(-50%,-50%)}  .nb-theme-default.login_body ngx-login nb-card{margin-bottom:0!important;top:0;left:0;transform:none}  .nb-theme-default.login_body nb-dialog-container nb-card-header{display:block!important}  .nb-theme-default.login_body nb-dialog-container nb-card{display:flex!important;flex-direction:column!important;background-color:#fff!important;border:.0625rem solid #e4e9f2!important;height:auto!important;position:unset!important;top:0;left:0;transform:translate(0)}.example-card[_ngcontent-%COMP%]{width:450px;border-radius:10px}.scroller[_ngcontent-%COMP%]{height:100vh;overflow:auto}  .login_body nb-tabset .tabset{height:100%;display:flex;flex-direction:column;border-bottom:none!important;justify-content:center!important}  .login_body nb-tab{text-align:center;padding:10px!important}[_nghost-%COMP%]     .login_body ngx-tab1, [_nghost-%COMP%]     .login_body ngx-tab2{display:block;padding:1rem 2rem}[_ngcontent-%COMP%]::-webkit-input-placeholder{text-align:center}[_ngcontent-%COMP%]:-moz-placeholder, [_ngcontent-%COMP%]::-moz-placeholder{text-align:center}[_ngcontent-%COMP%]:-ms-input-placeholder{text-align:center}.login_body[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%]{background-color:#55b9ec;border-color:#55b9ec;font-size:small;padding:12px}.forgot-password[_ngcontent-%COMP%]{bottom:0;height:80px;background-color:#f6f6f6!important;text-align:center;border-top:2px solid #edeef0;border-bottom-left-radius:10px;border-bottom-right-radius:10px}.forgot-password[_ngcontent-%COMP%]   .btn-link[_ngcontent-%COMP%]{color:#b8c5d2}.btn-link[_ngcontent-%COMP%]:focus{box-shadow:none}input[_ngcontent-%COMP%]{border:none;background:#f6f6f6!important}.welcome-message[_ngcontent-%COMP%]{text-align:center}.layout_logo[_ngcontent-%COMP%]{display:flex;justify-content:center;margin-top:12px}.layout_logo[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{width:150px;height:110px;display:block}.layout_logo[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block}.font-s[_ngcontent-%COMP%]{font-size:small}.message_Box[_ngcontent-%COMP%]{width:450px;margin:10px auto;background-color:#00d68f;padding:10px;font-size:16px;display:flex;flex-direction:row;border-radius:10px;align-items:center}.message_Box[_ngcontent-%COMP%]   .icon_image[_ngcontent-%COMP%]{width:40px;height:40px;display:block}.message_Box[_ngcontent-%COMP%]   .icon_image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:flex-start;width:85%;margin-left:15px}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]   .success[_ngcontent-%COMP%]{font-size:18px;line-height:22px;color:#fff;font-weight:600}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]   .message_boxtext[_ngcontent-%COMP%]{font-size:14px;line-height:20px;color:#fff;font-weight:500}"]}),y);function C(t,n){if(1&t){var e=f.Xb();f.Wb(0,"nb-alert",16),f.hc("close",(function(){return f.Mc(e),f.lc(2).onClose()})),f.ad(1),f.Vb()}if(2&t){var o=f.lc(2);f.uc("status",o.emailStatus),f.Db(1),f.cd(" ",o.emailResponse," ")}}function O(t,n){if(1&t&&(f.Wb(0,"div",0),f.Wb(1,"nb-card-body",14),f.Yc(2,C,2,2,"nb-alert",15),f.Vb(),f.Vb()),2&t){var e=f.lc();f.Db(2),f.uc("ngIf",e.emailStatus)}}function M(t,n){if(1&t){var e=f.Xb();f.Wb(0,"nb-alert",17),f.hc("close",(function(){return f.Mc(e),f.lc(2).onClose()})),f.ad(1),f.Vb()}if(2&t){var o=f.lc(2);f.uc("status",o.emailStatus),f.Db(1),f.cd(" ",o.emailResponse," ")}}function w(t,n){if(1&t&&(f.Wb(0,"div",0),f.Wb(1,"nb-card-body",15),f.Yc(2,M,2,2,"nb-alert",16),f.Vb(),f.Vb()),2&t){var e=f.lc();f.Db(2),f.uc("ngIf",e.emailStatus)}}var v,k,S,B,V=[{path:"",component:l.a,children:[{path:"",component:P},{path:"login",component:P},{path:"logout",component:P},{path:"forgot-password",component:(k=function(){function n(e,o,i,r,a,s){t(this,n),this.formBuilder=e,this.router=o,this.authService=i,this.toastrService=r,this.titleService=a,this.tableService=s,this.loading=!1,this.emailStatus="",this.emailResponse="",this.showFlashMessage=!1,this.configs={},this.forgotPasswordForm=this.formBuilder.group({email:["",[g.J.required,g.J.email]]})}return e(n,[{key:"ngOnInit",value:function(){var t=this;document.getElementById("main_body").classList.add("login_body"),this.tableService.getSystemConfig().subscribe((function(n){t.configs=n,t.titleService.setTitle(n["Company Name"])}))}},{key:"onFormSubmit",value:function(){var t=this;this.loading=!0,this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe((function(n){t.loading=!1,200===n.statusCode?(t.forgotPasswordForm.setValue({email:""}),t.emailStatus="success",t.emailResponse=n.message):(t.emailStatus="danger",t.emailResponse=n.message),t.showFlashMessage=!0}),(function(n){t.toastrService.danger(""+(n.error&&n.error.message),"Forgot Password"),t.loading=!1}))}},{key:"redirectToLogin",value:function(){this.router.navigate(["/auth/login"])}},{key:"onClose",value:function(){this.showFlashMessage=!1}}]),n}(),k.\u0275fac=function(t){return new(t||k)(f.Qb(g.i),f.Qb(c.c),f.Qb(d.a),f.Qb(h.bc),f.Qb(_.c),f.Qb(u.a))},k.\u0275cmp=f.Kb({type:k,selectors:[["ngx-forgot-password"]],decls:17,vars:5,consts:[[1,"h-100","d-flex","justify-content-center","align-items-center"],[1,"example-card","shadow-lg","bg-white"],[1,"layout_logo"],[1,"logo"],["width","40",3,"src"],[1,"card-body"],["class","h-100 d-flex justify-content-center align-items-center",4,"ngIf"],["nbSpinnerSize","large","nbSpinnerStatus","primary",1,"scroller",3,"nbSpinner"],["src","assets/images/user.png","alt","user","width","30"],[1,"mt-1",3,"formGroup","ngSubmit"],["formControlName","email","placeholder","Email","type","email",1,"form-control","shadow-none","p-3","mb-2","h-25","bg-light","rounded"],["type","submit",1,"btn","btn-primary","btn-lg","w-50","mb-1",3,"disabled"],[1,"forgot-password","shadow-none","p-3","bg-light","w-100",2,"margin-top","15px"],["type","button",1,"btn","btn-link",3,"click"],[1,"example-last-child-no-b-margin"],["closable","",3,"status","close",4,"ngIf"],["closable","",3,"status","close"]],template:function(t,n){1&t&&(f.Wb(0,"div",0),f.Wb(1,"div",1),f.Wb(2,"div",2),f.Wb(3,"span",3),f.Rb(4,"img",4),f.Vb(),f.Vb(),f.Wb(5,"div",5),f.Yc(6,O,3,1,"div",6),f.Wb(7,"nb-card",7),f.Wb(8,"span"),f.Rb(9,"img",8),f.Vb(),f.Wb(10,"form",9),f.hc("ngSubmit",(function(){return n.onFormSubmit()})),f.Rb(11,"input",10),f.Wb(12,"button",11),f.ad(13," SUBMIT "),f.Vb(),f.Wb(14,"div",12),f.Wb(15,"button",13),f.hc("click",(function(){return n.redirectToLogin()})),f.ad(16,"LOG IN"),f.Vb(),f.Vb(),f.Vb(),f.Vb(),f.Vb(),f.Vb(),f.Vb()),2&t&&(f.Db(4),f.vc("src",n.configs["Login Logo URL"],f.Pc),f.Db(2),f.uc("ngIf",n.showFlashMessage),f.Db(1),f.uc("nbSpinner",n.loading),f.Db(3),f.uc("formGroup",n.forgotPasswordForm),f.Db(2),f.uc("disabled",n.forgotPasswordForm.invalid))},directives:[s.u,h.C,h.Nb,g.L,g.w,g.n,g.e,g.v,g.l,h.B,h.o],styles:[".nb-theme-default.login_body nb-card-header{display:none!important}  .nb-theme-default.login_body nb-layout-column{background:#55b9ec!important;padding:0!important}  .nb-theme-default.login_body nb-card{border:none;background-color:inherit!important;display:block!important;flex-direction:unset!important;height:auto!important;position:relative;top:50%;left:50%;transform:translate(-50%,-50%)}  .nb-theme-default.login_body ngx-login nb-card{margin-bottom:0!important;top:0;left:0;transform:none}  .nb-theme-default.login_body nb-dialog-container nb-card-header{display:block!important}  .nb-theme-default.login_body nb-dialog-container nb-card{display:flex!important;flex-direction:column!important;background-color:#fff!important;border:.0625rem solid #e4e9f2!important;height:auto!important;position:unset!important;top:0;left:0;transform:translate(0)}.example-card[_ngcontent-%COMP%]{width:450px;border-radius:10px}.scroller[_ngcontent-%COMP%]{height:100vh;overflow:auto}  .login_body nb-tabset .tabset{height:100%;display:flex;flex-direction:column;border-bottom:none!important;justify-content:center!important}  .login_body nb-tab{text-align:center;padding:10px!important}[_nghost-%COMP%]     .login_body ngx-tab1, [_nghost-%COMP%]     .login_body ngx-tab2{display:block;padding:1rem 2rem}[_ngcontent-%COMP%]::-webkit-input-placeholder{text-align:center}[_ngcontent-%COMP%]:-moz-placeholder, [_ngcontent-%COMP%]::-moz-placeholder{text-align:center}[_ngcontent-%COMP%]:-ms-input-placeholder{text-align:center}.login_body[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%]{background-color:#55b9ec;border-color:#55b9ec;font-size:small;padding:12px}.forgot-password[_ngcontent-%COMP%]{bottom:0;height:80px;background-color:#f6f6f6!important;text-align:center;border-top:2px solid #edeef0;border-bottom-left-radius:10px;border-bottom-right-radius:10px}.forgot-password[_ngcontent-%COMP%]   .btn-link[_ngcontent-%COMP%]{color:#b8c5d2}.btn-link[_ngcontent-%COMP%]:focus{box-shadow:none}input[_ngcontent-%COMP%]{border:none;background:#f6f6f6!important}.welcome-message[_ngcontent-%COMP%]{text-align:center}.layout_logo[_ngcontent-%COMP%]{display:flex;justify-content:center;margin-top:12px}.layout_logo[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{width:150px;height:110px;display:block}.layout_logo[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block}.font-s[_ngcontent-%COMP%]{font-size:small}.message_Box[_ngcontent-%COMP%]{width:450px;margin:10px auto;background-color:#00d68f;padding:10px;font-size:16px;display:flex;flex-direction:row;border-radius:10px;align-items:center}.message_Box[_ngcontent-%COMP%]   .icon_image[_ngcontent-%COMP%]{width:40px;height:40px;display:block}.message_Box[_ngcontent-%COMP%]   .icon_image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:flex-start;width:85%;margin-left:15px}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]   .success[_ngcontent-%COMP%]{font-size:18px;line-height:22px;color:#fff;font-weight:600}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]   .message_boxtext[_ngcontent-%COMP%]{font-size:14px;line-height:20px;color:#fff;font-weight:500}",".nb-theme-default.login_body nb-card-header{display:none!important}  .nb-theme-default.login_body nb-layout-column{background:#55b9ec!important;padding:0!important}  .nb-theme-default.login_body nb-card{border:none;background-color:inherit!important;display:block!important;flex-direction:unset!important;height:auto!important;position:relative;top:50%;left:50%;transform:translate(-50%,-50%)}  .nb-theme-default.login_body ngx-login nb-card{margin-bottom:0!important;top:0;left:0;transform:none}  .forgot-card{margin-bottom:0!important;top:0!important;left:0!important;transform:none!important}  .nb-theme-default.login_body nb-dialog-container nb-card-header{display:block!important}  .nb-theme-default.login_body nb-dialog-container nb-card{display:flex!important;flex-direction:column!important;background-color:#fff!important;border:.0625rem solid #e4e9f2!important;height:auto!important;position:unset!important;top:0;left:0;transform:translate(0)}.example-card[_ngcontent-%COMP%]{width:450px;border-radius:10px}.scroller[_ngcontent-%COMP%]{height:100vh;overflow:auto}  .login_body nb-tabset .tabset{height:100%;display:flex;flex-direction:column;border-bottom:none!important;justify-content:center!important}  .login_body nb-tab{text-align:center;padding:10px!important}[_nghost-%COMP%]     .login_body ngx-tab1, [_nghost-%COMP%]     .login_body ngx-tab2{display:block;padding:1rem 2rem}[_ngcontent-%COMP%]::-webkit-input-placeholder{text-align:center}[_ngcontent-%COMP%]:-moz-placeholder, [_ngcontent-%COMP%]::-moz-placeholder{text-align:center}[_ngcontent-%COMP%]:-ms-input-placeholder{text-align:center}.login_body[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%]{background-color:#55b9ec;border-color:#55b9ec;font-size:small;padding:12px}.forgot-password[_ngcontent-%COMP%]{bottom:0;height:80px;background-color:#f6f6f6!important;text-align:center;border-top:2px solid #edeef0;border-bottom-left-radius:10px;border-bottom-right-radius:10px}.forgot-password[_ngcontent-%COMP%]   .btn-link[_ngcontent-%COMP%]{color:#b8c5d2}.btn-link[_ngcontent-%COMP%]:focus{box-shadow:none}input[_ngcontent-%COMP%]{border:none;background:#f6f6f6!important}.welcome-message[_ngcontent-%COMP%]{text-align:center}.layout_logo[_ngcontent-%COMP%]{display:flex;justify-content:center;margin-top:12px}.layout_logo[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{width:150px;height:110px;display:block}.layout_logo[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block}.font-s[_ngcontent-%COMP%]{font-size:small}.message_Box[_ngcontent-%COMP%]{width:450px;margin:10px auto;background-color:#00d68f;padding:10px;font-size:16px;display:flex;flex-direction:row;border-radius:10px;align-items:center}.message_Box[_ngcontent-%COMP%]   .icon_image[_ngcontent-%COMP%]{width:40px;height:40px;display:block}.message_Box[_ngcontent-%COMP%]   .icon_image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:flex-start;width:85%;margin-left:15px}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]   .success[_ngcontent-%COMP%]{font-size:18px;line-height:22px;color:#fff;font-weight:600}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]   .message_boxtext[_ngcontent-%COMP%]{font-size:14px;line-height:20px;color:#fff;font-weight:500}.scroller[_ngcontent-%COMP%]{margin-bottom:0!important;top:0!important;left:0!important;transform:none!important;border:none;text-align:center;height:auto}"]}),k)},{path:"reset-password/:id",component:(v=function(){function n(e,o,i,r,a){t(this,n),this.formBuilder=e,this.router=o,this.authService=i,this.toastrService=r,this.activatedRoute=a,this.loading=!1,this.isPasswordNotMatch=!1,this.token="",this.showFlashMessage=!1,this.emailStatus="",this.emailResponse="",this.resetPasswordForm=this.formBuilder.group({password:["",[g.J.required]],confirmPassword:["",[g.J.required]]})}return e(n,[{key:"ngOnInit",value:function(){this.token=this.activatedRoute.snapshot.params.id,document.getElementById("main_body").classList.add("login_body"),this.validateToken()}},{key:"onConfirmPasswordChange",value:function(){this.resetPasswordForm.value.password!=this.resetPasswordForm.value.confirmPassword?(this.toastrService.danger("Passwords are not matching.","Reset Password"),this.isPasswordNotMatch=!0):this.isPasswordNotMatch=!1}},{key:"validateToken",value:function(){var t=this;this.authService.validateToken(this.token).subscribe((function(n){200!==n.statusCode&&(t.emailStatus="danger",t.emailResponse=n.message,t.showFlashMessage=!0)}),(function(t){}))}},{key:"fireRequest",value:function(){var t=this;this.authService.resetPassword(this.resetPasswordForm.value,this.token).subscribe((function(n){200===n.statusCode?(t.toastrService.success(""+n.message,"Reset Password"),t.router.navigate(["/auth/login"]),t.loading=!1,t.emailStatus="success",t.emailResponse=n.message):(t.emailStatus="danger",t.emailResponse=n.message,t.toastrService.danger(""+n.message,"Reset Password"),t.loading=!1)}),(function(n){t.toastrService.danger(""+(n.error&&n.error.message),"Reset Password"),t.loading=!1}))}},{key:"onFormSubmit",value:function(){this.resetPasswordForm.invalid?this.toastrService.danger("Please enter password and confirm it.","Reset Password"):this.isPasswordNotMatch?this.toastrService.danger("Passwords are not matching.","Reset Password"):(this.loading=!0,this.fireRequest())}},{key:"redirectToLogin",value:function(){this.router.navigate(["/auth/login"])}},{key:"onClose",value:function(){this.showFlashMessage=!1}}]),n}(),v.\u0275fac=function(t){return new(t||v)(f.Qb(g.i),f.Qb(c.c),f.Qb(d.a),f.Qb(h.bc),f.Qb(c.a))},v.\u0275cmp=f.Kb({type:v,selectors:[["ngx-reset-password"]],decls:18,vars:3,consts:[[1,"h-100","d-flex","justify-content-center","align-items-center"],[1,"example-card","shadow-lg","bg-white"],[1,"layout_logo"],[1,"logo"],["src","assets/images/cavalry-signin.png","width","40"],[1,"card-body"],["class","h-100 d-flex justify-content-center align-items-center",4,"ngIf"],["nbSpinnerSize","large","nbSpinnerStatus","primary",1,"scroller",3,"nbSpinner"],["src","assets/images/user.png","alt","user","width","30"],[1,"mt-1",3,"formGroup","ngSubmit"],["formControlName","password","placeholder","Password","type","password",1,"form-control","shadow-none","p-3","mb-2","h-25","bg-light","rounded"],["formControlName","confirmPassword","placeholder","Confirm Password","type","password",1,"form-control","shadow-none","p-3","mb-2","h-25","bg-light","rounded",3,"blur"],["type","submit",1,"btn","btn-primary","btn-lg","w-50","mb-1"],[1,"forgot-password","shadow-none","p-3","bg-light","w-100",2,"margin-top","15px"],["type","button",1,"btn","btn-link",3,"click"],[1,"example-last-child-no-b-margin"],["closable","",3,"status","close",4,"ngIf"],["closable","",3,"status","close"]],template:function(t,n){1&t&&(f.Wb(0,"div",0),f.Wb(1,"div",1),f.Wb(2,"div",2),f.Wb(3,"span",3),f.Rb(4,"img",4),f.Vb(),f.Vb(),f.Wb(5,"div",5),f.Yc(6,w,3,1,"div",6),f.Wb(7,"nb-card",7),f.Wb(8,"span"),f.Rb(9,"img",8),f.Vb(),f.Wb(10,"form",9),f.hc("ngSubmit",(function(){return n.onFormSubmit()})),f.Rb(11,"input",10),f.Wb(12,"input",11),f.hc("blur",(function(){return n.onConfirmPasswordChange()})),f.Vb(),f.Wb(13,"button",12),f.ad(14," SUBMIT "),f.Vb(),f.Wb(15,"div",13),f.Wb(16,"button",14),f.hc("click",(function(){return n.redirectToLogin()})),f.ad(17,"LOG IN"),f.Vb(),f.Vb(),f.Vb(),f.Vb(),f.Vb(),f.Vb(),f.Vb()),2&t&&(f.Db(6),f.uc("ngIf",n.showFlashMessage),f.Db(1),f.uc("nbSpinner",n.loading),f.Db(3),f.uc("formGroup",n.resetPasswordForm))},directives:[s.u,h.C,h.Nb,g.L,g.w,g.n,g.e,g.v,g.l,h.B,h.o],styles:[".nb-theme-default.login_body nb-card-header{display:none!important}  .nb-theme-default.login_body nb-layout-column{background:#55b9ec!important;padding:0!important}  .nb-theme-default.login_body nb-card{border:none;background-color:inherit!important;display:block!important;flex-direction:unset!important;height:auto!important;position:relative;top:50%;left:50%;transform:translate(-50%,-50%)}  .nb-theme-default.login_body ngx-login nb-card{margin-bottom:0!important;top:0;left:0;transform:none}  .nb-theme-default.login_body nb-dialog-container nb-card-header{display:block!important}  .nb-theme-default.login_body nb-dialog-container nb-card{display:flex!important;flex-direction:column!important;background-color:#fff!important;border:.0625rem solid #e4e9f2!important;height:auto!important;position:unset!important;top:0;left:0;transform:translate(0)}.example-card[_ngcontent-%COMP%]{width:450px;border-radius:10px}.scroller[_ngcontent-%COMP%]{height:100vh;overflow:auto}  .login_body nb-tabset .tabset{height:100%;display:flex;flex-direction:column;border-bottom:none!important;justify-content:center!important}  .login_body nb-tab{text-align:center;padding:10px!important}[_nghost-%COMP%]     .login_body ngx-tab1, [_nghost-%COMP%]     .login_body ngx-tab2{display:block;padding:1rem 2rem}[_ngcontent-%COMP%]::-webkit-input-placeholder{text-align:center}[_ngcontent-%COMP%]:-moz-placeholder, [_ngcontent-%COMP%]::-moz-placeholder{text-align:center}[_ngcontent-%COMP%]:-ms-input-placeholder{text-align:center}.login_body[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%]{background-color:#55b9ec;border-color:#55b9ec;font-size:small;padding:12px}.forgot-password[_ngcontent-%COMP%]{bottom:0;height:80px;background-color:#f6f6f6!important;text-align:center;border-top:2px solid #edeef0;border-bottom-left-radius:10px;border-bottom-right-radius:10px}.forgot-password[_ngcontent-%COMP%]   .btn-link[_ngcontent-%COMP%]{color:#b8c5d2}.btn-link[_ngcontent-%COMP%]:focus{box-shadow:none}input[_ngcontent-%COMP%]{border:none;background:#f6f6f6!important}.welcome-message[_ngcontent-%COMP%]{text-align:center}.layout_logo[_ngcontent-%COMP%]{display:flex;justify-content:center;margin-top:12px}.layout_logo[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{width:150px;height:110px;display:block}.layout_logo[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block}.font-s[_ngcontent-%COMP%]{font-size:small}.message_Box[_ngcontent-%COMP%]{width:450px;margin:10px auto;background-color:#00d68f;padding:10px;font-size:16px;display:flex;flex-direction:row;border-radius:10px;align-items:center}.message_Box[_ngcontent-%COMP%]   .icon_image[_ngcontent-%COMP%]{width:40px;height:40px;display:block}.message_Box[_ngcontent-%COMP%]   .icon_image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:flex-start;width:85%;margin-left:15px}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]   .success[_ngcontent-%COMP%]{font-size:18px;line-height:22px;color:#fff;font-weight:600}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]   .message_boxtext[_ngcontent-%COMP%]{font-size:14px;line-height:20px;color:#fff;font-weight:500}",".nb-theme-default.login_body nb-card-header{display:none!important}  .nb-theme-default.login_body nb-layout-column{background:#55b9ec!important;padding:0!important}  .nb-theme-default.login_body nb-card{border:none;background-color:inherit!important;display:block!important;flex-direction:unset!important;height:auto!important;position:relative;top:50%;left:50%;transform:translate(-50%,-50%)}  .nb-theme-default.login_body ngx-login nb-card{margin-bottom:0!important;top:0;left:0;transform:none}  .nb-theme-default.login_body nb-dialog-container nb-card-header{display:block!important}  .nb-theme-default.login_body nb-dialog-container nb-card{display:flex!important;flex-direction:column!important;background-color:#fff!important;border:.0625rem solid #e4e9f2!important;height:auto!important;position:unset!important;top:0;left:0;transform:translate(0)}.example-card[_ngcontent-%COMP%]{width:450px;border-radius:10px}.scroller[_ngcontent-%COMP%]{height:100vh;overflow:auto}  .login_body nb-tabset .tabset{height:100%;display:flex;flex-direction:column;border-bottom:none!important;justify-content:center!important}  .login_body nb-tab{text-align:center;padding:10px!important}[_nghost-%COMP%]     .login_body ngx-tab1, [_nghost-%COMP%]     .login_body ngx-tab2{display:block;padding:1rem 2rem}[_ngcontent-%COMP%]::-webkit-input-placeholder{text-align:center}[_ngcontent-%COMP%]:-moz-placeholder, [_ngcontent-%COMP%]::-moz-placeholder{text-align:center}[_ngcontent-%COMP%]:-ms-input-placeholder{text-align:center}.login_body[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%]{background-color:#55b9ec;border-color:#55b9ec;font-size:small;padding:12px}.forgot-password[_ngcontent-%COMP%]{bottom:0;height:80px;background-color:#f6f6f6!important;text-align:center;border-top:2px solid #edeef0;border-bottom-left-radius:10px;border-bottom-right-radius:10px}.forgot-password[_ngcontent-%COMP%]   .btn-link[_ngcontent-%COMP%]{color:#b8c5d2}.btn-link[_ngcontent-%COMP%]:focus{box-shadow:none}input[_ngcontent-%COMP%]{border:none;background:#f6f6f6!important}.welcome-message[_ngcontent-%COMP%]{text-align:center}.layout_logo[_ngcontent-%COMP%]{display:flex;justify-content:center;margin-top:12px}.layout_logo[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{width:150px;height:110px;display:block}.layout_logo[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block}.font-s[_ngcontent-%COMP%]{font-size:small}.message_Box[_ngcontent-%COMP%]{width:450px;margin:10px auto;background-color:#00d68f;padding:10px;font-size:16px;display:flex;flex-direction:row;border-radius:10px;align-items:center}.message_Box[_ngcontent-%COMP%]   .icon_image[_ngcontent-%COMP%]{width:40px;height:40px;display:block}.message_Box[_ngcontent-%COMP%]   .icon_image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%;height:100%;display:block}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:flex-start;width:85%;margin-left:15px}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]   .success[_ngcontent-%COMP%]{font-size:18px;line-height:22px;color:#fff;font-weight:600}.message_Box[_ngcontent-%COMP%]   .message_Box1[_ngcontent-%COMP%]   .message_boxtext[_ngcontent-%COMP%]{font-size:14px;line-height:20px;color:#fff;font-weight:500}.scroller[_ngcontent-%COMP%]{margin-bottom:0!important;top:0!important;left:0!important;transform:none!important;border:none;text-align:center;height:auto}"]}),v)}]}],W=((S=function n(){t(this,n)}).\u0275mod=f.Ob({type:S}),S.\u0275inj=f.Nb({factory:function(t){return new(t||S)},imports:[[c.g.forChild(V)],c.g]}),S),R=a("PCNd"),F=a("tk/3"),N=a("eMGG"),z=((B=function n(){t(this,n)}).\u0275mod=f.Ob({type:B}),B.\u0275inj=f.Nb({factory:function(t){return new(t||B)},providers:[{provide:F.a,useClass:N.a,multi:!0}],imports:[[s.c,W,R.a,l.b,h.p]]}),B)}}])}();