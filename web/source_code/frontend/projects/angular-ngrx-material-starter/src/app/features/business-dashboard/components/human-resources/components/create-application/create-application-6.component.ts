import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../../core/core.state';
import { Observable } from 'rxjs';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { actionCommitCreateApplicationForm, actionProcessCreateApplicationForm4 } from '../../../../../../core/forms/actions';
import { actionNavigateDashboard } from '../../../../../../core/business/actions';

import { selectCreateApplication } from '../../../../../../core/forms/selectors';
import { ApplicationTemplate } from '../../../../../../core/forms/state';
import { actionCreateApplicationFormNavigatePrevious, actionResetCreateApplication } from '../../../../../../core/forms/actions';

@Component({
  selector: 'CreateApplication6',
  templateUrl: './create-application-6.component.html',
  styleUrls: ['./create-application-6.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateApplication6Component implements OnInit {
  public createApplication$: Observable<ApplicationTemplate>;
  public createApplication: ApplicationTemplate;
  
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
  ) 
  {
    this.createApplication$ = this.store.pipe(select(selectCreateApplication));
    this.createApplication$.subscribe(res => this.createApplication = res);
  }

  ngOnInit(): void {
  }

  system = this.fb.group({

  })

  onContinueClick(): void {
    this.store.dispatch(actionCommitCreateApplicationForm());
  }


  onPreviousClick(): void {
    this.store.dispatch(actionCreateApplicationFormNavigatePrevious());  
  }


  onResetClick(): void {
    this.store.dispatch(actionResetCreateApplication());
    this.store.dispatch(actionNavigateDashboard({route: 'human-resources'}));
  }

  onNoClick(): void {
    this.store.dispatch(actionNavigateDashboard({route: 'human-resources'}))
  }

}
