import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../../core/core.state';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CustomValidators } from '../../../../../../core/core.module';

import { 
  actionCreateApplicationFormNavigatePrevious,
  actionProcessCreateApplicationForm5,
  actionResetCreateApplication
} from '../../../../../../core/forms/actions';

import { actionNavigateDashboard } from '../../../../../../core/business/actions';
import { ApplicationTemplate } from '../../../../../../core/forms/state';
import { selectCreateApplication } from '../../../../../../core/forms/selectors';

@Component({
  selector: 'CreateApplication5',
  templateUrl: './create-application-5.component.html',
  styleUrls: ['./create-application-5.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateApplication5Component implements OnInit {
  public createApplication$: Observable<ApplicationTemplate>;
  public createApplication: ApplicationTemplate;
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
  ) 
  {
    this.createApplication$ = this.store.pipe(select(selectCreateApplication));
    this.createApplication$.subscribe(res => this.createApplication = res);
    this.final.get('applicationDisclaimerCtrl').setValue(this.createApplication.applicationDisclaimer);

  }

  ngOnInit(): void {
    
  }

  final = this.fb.group({
    applicationDisclaimerCtrl: [undefined, []],
    
  })

  onContinueClick(): void {
    
    let payload = {
      page: 6,
      previousPage: 5,
      applicationDisclaimer: this.final.get('applicationDisclaimerCtrl').value
      
    }
    this.store.dispatch(actionProcessCreateApplicationForm5(payload));

  }

    onNoClick(): void {
      this.store.dispatch(actionNavigateDashboard({route: 'human-resources'}))
  }

  
  onResetClick(): void {
    this.store.dispatch(actionResetCreateApplication());
    this.store.dispatch(actionNavigateDashboard({route: 'human-resources'}));
  }

  onPreviousClick(): void {
    this.store.dispatch(actionCreateApplicationFormNavigatePrevious());  
  }


}
