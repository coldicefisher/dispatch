import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../../core/core.module';
import { select } from '@ngrx/store';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { selectCreateApplicationPageStatus } from '../../../../../../core/forms/selectors';

@Component({
  selector: 'CreateApplication',
  templateUrl: './create-application.component.html',
  styleUrls: ['./create-application.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateApplicationComponent implements OnInit {
  pageStatus$: Observable<number>;
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
  ) 
  {  
    this.pageStatus$ = this.store.pipe(select(selectCreateApplicationPageStatus));
  }

  ngOnInit(): void {
  }


}
