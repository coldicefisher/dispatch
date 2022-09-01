import { Component, OnInit, ChangeDetectionStrategy, NgZone, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState, NotificationService } from '../../../../core/core.module';
import { actionRetrieveUsernameVerifyCode } from '../../../../core/auth/auth/actions';

import { selectAuth } from '../../../../core/core.module';

import {
  ROUTE_ANIMATIONS_ELEMENTS,
} from '../../../../core/core.module';


@Component({
  selector: 'bizniz-retrieve-username-otp-verify',
  templateUrl: './retrieve-username-otp-verify.component.html',
  styleUrls: ['./retrieve-username-otp-verify.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class RetrieveUsernameOtpVerifyComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private zone: NgZone,
    private notificationService: NotificationService

  ) { }

  authState$: Observable<any>;
  username: string | undefined;
  address: string | undefined;
  loginStatus: string | undefined;
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  form = this.fb.group({
    otpCode: [null, 
        Validators.required
    ]
  });
  
  ngOnInit() {
    this.authState$ = this.store.pipe(select(selectAuth));
    this.authState$.subscribe((state) => {
      this.address = state.address;
      this.loginStatus = state.loginStatus;
    });
    
  }


  onCheck(): void {
    const payload = {
      address: this.address,
      otpCode: this.form.get('otpCode').value,
      loginStatus: this.loginStatus,
    }
    this.store.dispatch(actionRetrieveUsernameVerifyCode(payload));
       
  }
  

}
