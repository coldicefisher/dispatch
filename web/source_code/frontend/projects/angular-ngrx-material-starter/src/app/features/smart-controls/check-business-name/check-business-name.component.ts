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

import { actionCheckBusinessName } from '../../../core/business/actions';
import { selectBusinessNameValid } from '../../../core/forms/selectors';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'CheckBusinessName',
  templateUrl: './check-business-name.component.html',
  styleUrls: ['./check-business-name.component.scss'],
  providers: [
    
    ]
})

export class CheckBusinessNameComponent implements OnInit {
  @Output() setBusinessName: EventEmitter<any> = new EventEmitter();
  nameValid$: Observable<boolean>;
  nameExistsError: boolean | undefined;
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
  ) 
  {
    this.nameValid$ = this.store.pipe(select(selectBusinessNameValid));
    this.nameValid$.subscribe(res => this.nameExistsError = res);
  }

  ngOnInit(): void { 
    this.form.get('nameCtrl').valueChanges
      .pipe(
        debounceTime(500))
        .subscribe(res => {
          this.store.dispatch(actionCheckBusinessName({ name: res }));
          this.checkName();
      })
      
    //   )
    //   let hasError = res;
    //   if (this.form.get('nameCtrl').hasError('required')) { hasError = true };
    //   this.invokeEvent({
    //     businessName: this.form.get('nameCtrl').value,
    //     exists: res,
    //     empty: this.form.get('nameCtrl').hasError('required'),
    //     hasError: hasError,
    //   });
    // })
  }

  form = this.fb.group({
    nameCtrl: [undefined, Validators.compose([
      Validators.required
    ])
  ],

  })

  invokeEvent(nameValid: Object) {
    this.setBusinessName.emit(nameValid);
  }

  checkName() {
    let val = this.form.get('nameCtrl').value;
      let hasError = this.nameExistsError;
      if (this.form.get('nameCtrl').hasError('required')) { hasError = true };
      this.invokeEvent({
        businessName: this.form.get('nameCtrl').value,
        exists: this.nameExistsError,
        empty: this.form.get('nameCtrl').hasError('required'),
        hasError: hasError,
      });
    
  }
  
}

