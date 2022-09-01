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

import { actionCheckUsername } from '../../../core/forms/actions';
// import { selectUsernameValid } from '../../../core/forms/selectors';

@Component({
  selector: 'CheckUsername',
  templateUrl: './check-username.component.html',
  styleUrls: ['./check-username.component.scss'],
  providers: [
    
    ]
})

export class CheckUsernameComponent implements OnInit {
  @Output() setUsername: EventEmitter<any> = new EventEmitter();
  usernameValid$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
  ) 
  { 
  }

  ngOnInit(): void { 
    // this.usernameValid$ = this.store.pipe(select(selectUsernameValid));
    this.usernameValid$.subscribe(res => {
      this.invokeEvent({
        username: this.form.get('usernameCtrl').value,
        exists: res,
        wrongFormat: this.form.get('usernameCtrl').hasError('validUsername'),
        empty: this.form.get('usernameCtrl').hasError('required'),
      });
    })
  }

  form = this.fb.group({
    usernameCtrl: [undefined, Validators.compose([
      Validators.required,
      
    ])
  ],

  })

  invokeEvent(usernameValid: Object) {
    this.setUsername.emit(usernameValid);
  }

  checkUsername() {
    let val = this.form.get('usernameCtrl').value;
    this.store.dispatch(actionCheckUsername({ username: val}));
    
  }
  
}

