import { Component, OnInit, ChangeDetectionStrategy, NgZone, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState, NotificationService } from '../../../../core/core.module';
import { actionResetPasswordSendCode } from '../../../../core/auth/auth/actions';

import { selectAuth } from '../../../../core/core.module';
import { CustomValidators } from '../../../../core/validators/custom-validators';

import {
  ROUTE_ANIMATIONS_ELEMENTS,
} from '../../../../core/core.module';


@Component({
  selector: 'bizniz-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class ResetPasswordComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private zone: NgZone,
    private notificationService: NotificationService

  ) { }

  authState$: Observable<any>;
  username: string | undefined;
  loginStatus: string | undefined;
  
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  form = this.fb.group({
    username: [null, Validators.required],
    address: [null, Validators.compose([
        CustomValidators.emailOrPhoneValidator({
          validAddress: true
        }),        
        Validators.required
      ])
    ]
  });
  
  ngOnInit() {
    this.authState$ = this.store.pipe(select(selectAuth));
    this.authState$.subscribe((state) => {
    this.loginStatus = state.loginStatus;
    });

    
    
  }

  onSendOtp() {
    this.store.dispatch(actionResetPasswordSendCode({ loginStatus: this.loginStatus, address: this.form.get('address').value, username: this.form.get('username').value }));
  }
  

}
