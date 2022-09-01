import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../../core/core.state';
import { Observable } from 'rxjs';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { actionProcessCreateApplicationForm1, actionResetCreateApplication } from '../../../../../../core/forms/actions';
import { actionNavigateDashboard } from '../../../../../../core/business/actions';

import { selectCreateApplication } from '../../../../../../core/forms/selectors';
import { ApplicationTemplate } from '../../../../../../core/forms/state';

@Component({
  selector: 'CreateApplication1',
  templateUrl: './create-application-1.component.html',
  styleUrls: ['./create-application-1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateApplication1Component implements OnInit {
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
    this.system.get('nameCtrl').setValue(this.createApplication.applicationName);
    this.system.get('visibilityCtrl').setValue(this.createApplication.visibility);
    this.system.get('descriptionCtrl').setValue(this.createApplication.description);
  }

  system = this.fb.group({
    nameCtrl: [undefined, [Validators.required]],
    visibilityCtrl: [undefined, [Validators.required]],
    descriptionCtrl: [undefined, []]
  })

  onContinueClick(): void {
    let payload = {
      page: 2,
      previousPage: 1,
      name: this.system.get('nameCtrl').value,
      visibility: this.system.get('visibilityCtrl').value,
      description: this.system.get('descriptionCtrl').value
      
    }
    this.store.dispatch(actionProcessCreateApplicationForm1(payload));

  }

  onNoClick(): void {
    this.store.dispatch(actionNavigateDashboard({route: 'human-resources'}));
  }

  onResetClick(): void {
    this.store.dispatch(actionResetCreateApplication());
    this.store.dispatch(actionNavigateDashboard({route: 'human-resources'}));
  }

}
