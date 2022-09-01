import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { CheckDeviceComponent } from './check-device/components/check-device.component';
import { CheckPwdComponent } from './check-pwd/components/check-pwd.component';
import { OtpOptionsComponent } from './otp-options/components/otp-options.component';
import { OtpVerifyComponent } from './otp-verify/components/otp-verify.component';

// import { HttpClient } from '@angular/common/http';

import { AuthRoutingModule } from './auth-routing.module';
import { SignUpComponent } from './sign-up/components/sign-up.component';
import { ComponentDirective } from './authenticate/component-item';
import { LoginComponent } from './login/components/login.component';
import { RetrieveUsernameComponent } from './retrieve-username/components/retrieve-username.component';
import { RegisterComponent } from './register/components/register.component';
import { RetrieveUsernameOtpVerifyComponent } from './retrieve-username-otp-verify/components/retrieve-username-otp-verify.component';
import { RetrieveUsernameQuestionsVerifyComponent } from './retrieve-username-questions-verify/components/retrieve-username-questions-verify.component';
import { ResetPasswordComponent } from './reset-password/components/reset-password.component';
import { ResetPasswordSetComponent } from './reset-password-set/components/reset-password-set.component';

import { SmartControlsModule } from '../smart-controls/smart-controls.module';

@NgModule({
    imports: [
      CommonModule, 
      SharedModule,
      RouterModule,
      FormsModule,
//      ReactiveFormsModule,
      AuthRoutingModule,
      //TranslateModule,
      // OtpOptionsComponent,
      SmartControlsModule,
    ],

    declarations: [
    CheckDeviceComponent, 
    CheckPwdComponent, 
    OtpOptionsComponent, 
    OtpVerifyComponent, 
    SignUpComponent, 
    LoginComponent, 
    ComponentDirective, 
    
    // ResetPasswordComponent, 
    RetrieveUsernameComponent, 
    RegisterComponent, 
    RetrieveUsernameOtpVerifyComponent, 
    RetrieveUsernameQuestionsVerifyComponent, 
    ResetPasswordSetComponent,
    ResetPasswordComponent,
    
    
    ],

    exports: [
      OtpOptionsComponent,
    ],

    // bootstrap: [AddAddressComponent, CheckDeviceComponent],
    bootstrap: [ ],
    //entryComponents: [ CheckDeviceComponent, CheckPwdComponent, ComponentDirective ]
    entryComponents: [ ]
})
export class AuthModule {
  constructor() {}
}
