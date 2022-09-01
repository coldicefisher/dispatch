import { Component, OnInit, ChangeDetectionStrategy, NgZone, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState, NotificationService, selectUsername } from '../../../../core/core.module';
import { actionResetPasswordResetPassword } from '../../../../core/auth/auth/actions';

import { selectAuth } from '../../../../core/core.module';
import { CustomValidators } from '../../../../core/validators/custom-validators';

import {
  ROUTE_ANIMATIONS_ELEMENTS,
} from '../../../../core/core.module';


@Component({
  selector: 'bizniz-reset-password-set',
  templateUrl: './reset-password-set.component.html',
  styleUrls: ['./reset-password-set.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class ResetPasswordSetComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private zone: NgZone,
    private notificationService: NotificationService

  ) { }

  authState$: Observable<any>;
  username: string | undefined;
  address: string | undefined;

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  form = this.fb.group({
    otpCode: [null, 
      Validators.required
    ],
    pwd: [null, Validators.compose([
      Validators.required,
      // check whether the entered password has a number
      CustomValidators.patternValidator(/\d/, {
        hasNumber: true
      }),
      // check whether the entered password has upper case letter
      CustomValidators.patternValidator(/[A-Z]/, {
        hasCapitalCase: true
      }),
      // check whether the entered password has a lower case letter
      CustomValidators.patternValidator(/[a-z]/, {
        hasSmallCase: true
      }),
      // check whether the entered password has a special character
      CustomValidators.patternValidator(
        /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        {
          hasSpecialCharacters: true
        }
      ),
      Validators.minLength(12)

      ])
    ],
    pwdConfirm: [null, Validators.compose([
      Validators.required,
      ])
    ],

  },
  {
    validators: [CustomValidators.match('pwd', 'pwdConfirm')]
  },
  );
  
  ngOnInit() {
    this.authState$ = this.store.pipe(select(selectAuth));
    this.authState$.subscribe((state) => {
      this.address = state.address;
      this.username = state.username;
    });

    
    
  }

  onReset() {
    this.store.dispatch(actionResetPasswordResetPassword({address: this.address, loginStatus: 'reset_password_set', password: this.form.get('pwd').value, otpCode: this.form.get('otpCode').value, username: this.username }));
  }
  

}
