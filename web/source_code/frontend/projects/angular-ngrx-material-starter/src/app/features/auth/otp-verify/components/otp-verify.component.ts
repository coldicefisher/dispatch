import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../../../../core/core.module';
import { actionOtpVerify, actionBeginAddAddress } from '../../../../core/auth/auth/actions';
import { selectAuth } from '../../../../core/auth/auth/selectors';


import {
  ROUTE_ANIMATIONS_ELEMENTS,
} from '../../../../core/core.module';


@Component({
  selector: 'bizniz-otp-verify',
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./otp-verify.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtpVerifyComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,

  ) { }

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  authState$: Observable<any>;
  infoMessage: string | undefined;
  username: string | undefined;
  address: string | undefined;
  
  trustThis: boolean = true;
  
  form = this.fb.group({
    otpCode: ['', [Validators.required]],
    trustThis: [true],
  });
  
  ngOnInit() {
  
    this.authState$ = this.store.pipe(select(selectAuth));
    this.authState$.subscribe((state) => {
      this.username = state.username;
      this.address = state.address;
    });

    if (this.address.includes('@')) {
      this.infoMessage = "Email delivery can be delayed. Check your spam folder. If you have not received your authentication code in 3 minutes, try adding another email address or phone number for verification."
    }
  }

  onCheck(): void {
    const payload = {
      otpCode: this.form.get('otpCode').value,
      username: this.username,
      address: this.address,
      trustThis: String(this.form.get('trustThis').value),
    }
    this.store.dispatch(actionOtpVerify(payload));
       
  }
  onAdd(): void {
    this.store.dispatch(actionBeginAddAddress());
  }
}
