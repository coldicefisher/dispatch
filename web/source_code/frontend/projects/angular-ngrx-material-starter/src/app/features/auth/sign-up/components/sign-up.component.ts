import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from '../../../../core/core.module';
import { actionSignUp } from '../../../../core/auth/auth/actions';
import { selectAuth } from '../../../../core/auth/auth/selectors';

import { CustomValidators } from '../../../../core/validators/custom-validators';

import {
  ROUTE_ANIMATIONS_ELEMENTS,
  NotificationService
} from '../../../../core/core.module';


@Component({
  selector: 'bizniz-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
//    private translate: TranslateService,
//    private notificationService: NotificationService

  ) { }

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  emailVal: string | undefined;
  emailExists: boolean | undefined;
  emailWrongFormat: boolean | undefined;
  emailMissing: boolean = true;
  // user: User = new User();
  authState$: Observable<any>;
  errorMessage: string | null;
  
  trustThis: boolean = true;


  form = this.fb.group(
    {
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      // email: [null, Validators.compose([
      //   CustomValidators.emailValidator({
      //     validEmail: true
      //   }),
      //   Validators.required
      // ])],
      terms: [false, [Validators.requiredTrue]],
        
      
      phone: [null, Validators.compose([
        CustomValidators.phoneValidator({
          validPhone: true
        }),
        Validators.required
      ])],

      username: [null, [Validators.required]],
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
      // QUESTIONS //////////////////////////////////////
      q1: [null, [Validators.required]],
      a1: [null, [Validators.required]],
      q2: [null, [Validators.required]],
      a2: [null, [Validators.required]]
      // END QUESTIONS //////////////////////////////////
    },
    {
      validators: [CustomValidators.match('pwd', 'pwdConfirm')]
      //validators: [CustomValidators.passwordMatchValidator(]
    },
        
  );
  
  ngOnInit() {
  
    this.authState$ = this.store.pipe(select(selectAuth));
    this.authState$.subscribe((state) => {
      this.errorMessage = state.errorMessage;
          
      
    });

  }
  getEmail($event) {
    console.log($event);
    this.emailVal = $event.email;
    this.emailExists = $event.exists;
    this.emailMissing = $event.empty;
    this.emailWrongFormat = $event.wrongFormat;
  }

  onSignUp(): void {
    const payload = {
      username: this.form.get('username').value,
      password: this.form.get('pwd').value,
      //email: this.form.get('email').value,
      email: this.emailVal,
      phone: this.form.get('phone').value,
      firstName: this.form.get('firstname').value,
      lastName: this.form.get('lastname').value,
      
      // QUESTIONS //////////////////////////////
      q1: this.form.get('q1').value,
      a1: this.form.get('a1').value,
      q2: this.form.get('q2').value,
      a2: this.form.get('a2').value,
      // END QUESTIONS //////////////////////////
    }
    console.log(this.emailVal);
    this.store.dispatch(actionSignUp(payload));
  }


}
