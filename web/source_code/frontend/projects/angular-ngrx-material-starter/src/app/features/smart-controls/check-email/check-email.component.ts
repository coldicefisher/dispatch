import { 
  FormBuilder, 
  Validators 
} from '@angular/forms';


import { 
  Component, 
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Inject,
  Output,
  EventEmitter

} from '@angular/core';

import { Observable } from "rxjs";

import { Store, select } from '@ngrx/store';
import { AppState } from '../../../core/core.module';

import { actionCheckEmail } from '../../../core/forms/actions';
import { selectEmailValid } from '../../../core/forms/selectors';
import { CustomValidators } from '../../../core/core.module';
import { debounceTime, startWith,tap } from 'rxjs/operators';
import { pipe } from 'rxjs';
@Component({
  selector: 'CheckEmail',
  templateUrl: './check-email.component.html',
  styleUrls: ['./check-email.component.scss'],
  providers: [
    
    ]
})

export class CheckEmailComponent implements OnInit {
  @Output() setEmail: EventEmitter<any> = new EventEmitter();
  emailValid$: Observable<boolean>;
  emailExistsError: boolean | undefined;
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
  ) 
  { 
    this.emailValid$ = this.store.pipe(select(selectEmailValid));
    this.emailValid$.subscribe(res => this.emailExistsError = res)
    
    this.form.get('emailCtrl').valueChanges
      .pipe(
        debounceTime(300))
      .subscribe(res => {
          console.log(res);
          //let val = this.form.get('emailCtrl').value;
          if (CustomValidators.stringValidateEmail(res)) {
            this.store.dispatch(actionCheckEmail({ email: res}));
            this.checkEmail();
          }      
      })
      
  }

  ngOnInit(): void { 
    
  }

  form = this.fb.group({
    emailCtrl: [undefined, Validators.compose([
      Validators.required,
      CustomValidators.emailValidator({
        validEmail: true
      }),
      
    ])
  ],

  })

  invokeEvent(emailValid: Object) {
    console.log(emailValid);
    this.setEmail.emit(emailValid);
  }

  checkEmail() {
    let hasError = this.emailExistsError;
    if (this.form.get('emailCtrl').hasError('validEmail')) { hasError = true }
    if (this.form.get('emailCtrl').hasError('required')) { hasError = true }

    this.invokeEvent({
      email: this.form.get('emailCtrl').value,
      exists: this.emailExistsError,
      wrongFormat: this.form.get('emailCtrl').hasError('validEmail'),
      empty: this.form.get('emailCtrl').hasError('required'),
      hasError: hasError,
    });
  }
  
}

