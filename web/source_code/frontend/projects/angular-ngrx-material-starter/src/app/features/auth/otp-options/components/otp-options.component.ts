
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { actionSendCode } from '../../../../core/auth/auth/actions';
import { AppState } from '../../../../core/core.module';
import { selectAuth, selectOtpOptions } from '../../../../core/auth/auth/selectors';

import {
  ROUTE_ANIMATIONS_ELEMENTS,
  NotificationService
} from '../../../../core/core.module';

import { OtpOption } from '../../../../core/auth/auth/state';


@Component({
  selector: 'bizniz-otp-options',
  templateUrl: './otp-options.component.html',
  styleUrls: ['./otp-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class OtpOptionsComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,

  ) { }
    routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
    authState$: Observable<any>;
    infoMessage: Observable<string>;
    
    
    trustThis: boolean = true;
    isAuthenticated$: Observable<boolean> | undefined;
    // user: User = new User();
    loginStatus: string | undefined;
    otpOptionsStr: string | undefined;
    otpOptions$: Observable<OtpOption[]>;
    username: string | undefined; 
    selectedAddress: string | undefined;
    // isAuthenticated$: Observable<boolean> | undefined;


  form = this.fb.group({
    selectedAddress: undefined,
    addOption: undefined
    
  });

  ngOnInit() {
    
    this.authState$ = this.store.pipe(select(selectAuth));
    this.otpOptions$ = this.store.pipe(select(selectOtpOptions));
    this.authState$.subscribe((state) => {
      this.infoMessage = state.infoMessage;
      this.username = state.username;
      this.loginStatus = state.loginStatus;
      this.otpOptionsStr = state.otpOptions;
      // try {
      //   this.otpOptions = new Map(Object.entries(JSON.parse(this.otpOptionsStr)));
      // }
      // catch {
      //   this.otpOptions = undefined;
      // }
      
    });

    
  }

  onSubmit(): void {
    const payload = {
      username: this.username,
      address: this.form.get('selectedAddress').value
    }
    
    this.store.dispatch(actionSendCode(payload));
    
  }

  onAdd(): void {
    
  }
}
