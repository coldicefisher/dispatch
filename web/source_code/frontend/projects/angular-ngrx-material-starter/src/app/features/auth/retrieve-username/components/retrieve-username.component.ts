import { Component, OnInit, ChangeDetectionStrategy, NgZone, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState, NotificationService, selectUsername } from '../../../../core/core.module';
import { actionAddAddress, actionRetrieveUsernameSendCode } from '../../../../core/auth/auth/actions';

import { selectAuth } from '../../../../core/core.module';
import { CustomValidators } from '../../../../core/validators/custom-validators';

import {
  ROUTE_ANIMATIONS_ELEMENTS,
} from '../../../../core/core.module';


@Component({
  selector: 'bizniz-retrieve-username',
  templateUrl: './retrieve-username.component.html',
  styleUrls: ['./retrieve-username.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class RetrieveUsernameComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private zone: NgZone,
    private notificationService: NotificationService

  ) { }

  authState$: Observable<any>;
  username: string | undefined
  
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  form = this.fb.group({
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
    });

    
    
  }

  onSendOtp() {
    console.debug(this.form.get('address').value);
    this.store.dispatch(actionRetrieveUsernameSendCode({address: this.form.get('address').value, login_status: 'retrieve_username_start' }));
  }
  

}
