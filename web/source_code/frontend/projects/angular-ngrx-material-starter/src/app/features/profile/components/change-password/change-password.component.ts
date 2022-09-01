import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/core.module';

import { Validators, FormBuilder } from '@angular/forms';
import { 
  CustomValidators,
  ROUTE_ANIMATIONS_ELEMENTS,

} from '../../../../core/core.module';
import { actionUpdatePassword } from '../../../../core/profile/actions';

@Component({
  selector: 'bizniz-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent implements OnInit {

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,

  ) { }

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  ngOnInit(): void {
  }
  form = this.fb.group(
    {
      currentPwd: [null, Validators.compose([
          Validators.required
        ])
      ],
      pwdConfirm: [null, Validators.compose([
        Validators.required,
        //validator: CustomValidators.passwordMatchValidator
        //CustomValidators.match('pwd', 'pwdConfirm')
        ])
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
    },
    {
      validators: [CustomValidators.match('pwd', 'pwdConfirm')]
      //validators: [CustomValidators.passwordMatchValidator(]
    },
    
  ); // End form

  onUpdate(): void {
    this.store.dispatch(actionUpdatePassword({currentPassword: this.form.get('currentPwd').value, newPassword: this.form.get('pwd').value }));
  }
}
