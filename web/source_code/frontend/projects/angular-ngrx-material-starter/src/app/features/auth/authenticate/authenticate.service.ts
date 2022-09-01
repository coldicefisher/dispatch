import { Injectable } from '@angular/core';

import { ComponentItem } from './component-item';

import { AddAddressComponent } from '../add-address/components/add-address.component';
import { CheckDeviceComponent } from '../check-device/components/check-device.component';
import { LoginComponent } from '../login/components/login.component';
import { OtpOptionsComponent } from '../otp-options/components/otp-options.component';
import { OtpVerifyComponent } from '../otp-verify/components/otp-verify.component';
import { ResetUsernameComponent } from '../reset-username/components/reset-username.component';


@Injectable()
export class AuthenticateService {
  getAds() {
    return [
      new ComponentItem(AddAddressComponent, {}),
      new ComponentItem(CheckDeviceComponent, {}),
      new ComponentItem(LoginComponent, {}),
      new ComponentItem(OtpOptionsComponent, {}),
      new ComponentItem(OtpVerifyComponent, {}),
      new ComponentItem(ResetUsernameComponent, {}),
    ];
  }
}