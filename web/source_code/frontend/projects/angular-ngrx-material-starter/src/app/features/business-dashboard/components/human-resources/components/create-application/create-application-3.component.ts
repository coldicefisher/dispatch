import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../../core/core.state';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CustomValidators } from '../../../../../../core/core.module';

import { 
  actionCreateApplicationFormNavigatePrevious,
  actionProcessCreateApplicationForm3,
  actionResetCreateApplication
} from '../../../../../../core/forms/actions';

import { actionNavigateDashboard } from '../../../../../../core/business/actions';
import { ApplicationTemplate } from '../../../../../../core/forms/state';
import { selectCreateApplication } from '../../../../../../core/forms/selectors';

@Component({
  selector: 'CreateApplication3',
  templateUrl: './create-application-3.component.html',
  styleUrls: ['./create-application-3.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateApplication3Component implements OnInit {
  public createApplication$: Observable<ApplicationTemplate>;
  public createApplication: ApplicationTemplate;
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
  ) 
  {
    this.createApplication$ = this.store.pipe(select(selectCreateApplication));
    this.createApplication$.subscribe(res => this.createApplication = res);
    this.history.get('addressHistoryDisclaimerCtrl').setValue(this.createApplication.addressHistoryDisclaimer);
    if (this.createApplication.addressHistoryAllowGaps == true){ this.history.get('addressHistoryAllowGapsCtrl').setValue("Yes") }
    else { this.history.get('addressHistoryAllowGapsCtrl').setValue("No") };
    this.history.get('addressHistoryLookbackCtrl').setValue(this.createApplication.addressHistoryLookback);

    // this.history.get('workHistoryDisclaimerCtrl').setValue(this.createApplication.workHistoryDisclaimer);
    // if (this.createApplication.workHistoryAllowGaps == true){ this.history.get('workHistoryAllowGapsCtrl').setValue("Yes")}
    // else {this.history.get('workHistoryAllowGapsCtrl').setValue("No")};
    // this.history.get('workHistoryLookbackCtrl').setValue(this.createApplication.workHistoryLookback);
    
    if (this.createApplication.educationHistoryInclude == true){this.history.get('educationHistoryIncludeCtrl').setValue("Yes")}
    else {this.history.get("educationHistoryIncludeCtrl").setValue("No")};
    
    if (this.createApplication.employmentHistoryAllowGaps == true) {this.history.get('employmentHistoryAllowGapsCtrl').setValue("Yes")}
    else {this.history.get('employmentHistoryAllowGapsCtrl').setValue("No")};
    this.history.get('employmentHistoryDisclaimerCtrl').setValue(this.createApplication.employmentHistoryDisclaimer);
    this.history.get('employmentHistoryLookbackCtrl').setValue(this.createApplication.employmentHistoryLookback);
  }

  ngOnInit(): void {
    
  }

  history = this.fb.group({
    // workHistoryLookbackCtrl: [undefined, Validators.compose([
    //   Validators.required,
    //   CustomValidators.patternValidator(RegExp(/^\d+$/), 
    //   {numericError: true})      
    // ])],
    // workHistoryAllowGapsCtrl: ['No', [Validators.required]],
    // workHistoryDisclaimerCtrl: [undefined, []],
    
    addressHistoryAllowGapsCtrl: ['No', [Validators.required]],
    addressHistoryLookbackCtrl: [undefined, Validators.compose([
      Validators.required,
      CustomValidators.patternValidator(RegExp(/^\d+$/), 
      {numericError: true})      
    ])],
    addressHistoryDisclaimerCtrl: [undefined, []],
    
    educationHistoryIncludeCtrl: ['Yes', [Validators.required]],

    employmentHistoryAllowGapsCtrl: ['No', [Validators.required]],
    employmentHistoryLookbackCtrl: [undefined, Validators.compose([
      Validators.required,
      CustomValidators.patternValidator(RegExp(/^\d+$/), 
      {numericError: true})      
    ])],
    employmentHistoryDisclaimerCtrl: [undefined, []],

  })

  onContinueClick(): void {
    // let whAllowGaps = true;
    let ahAllowGaps = true;
    let ehAllowGaps = true;
    let educationHistoryInclude = true;
    // let whLookback = this.history.get('workHistoryLookbackCtrl').value;
    let ahLookback = this.history.get('addressHistoryLookbackCtrl').value;
    let ehLookback = this.history.get('employmentHistoryLookbackCtrl').value;
    // if (this.history.get('workHistoryAllowGapsCtrl').value == "No") { whAllowGaps = false };
    if (this.history.get('addressHistoryAllowGapsCtrl').value == "No") { ahAllowGaps = false };
    if (this.history.get('employmentHistoryAllowGapsCtrl').value == "No") { ehAllowGaps = false };
    if (this.history.get('educationHistoryIncludeCtrl').value == "No") {educationHistoryInclude = false };

    let payload = {
      page: 4,
      previousPage: 3,
    //   workHistoryLookback: Number(whLookback),
    //   workHistoryAllowGaps: whAllowGaps,
    //   workHistoryDisclaimer: this.history.get('workHistoryDisclaimerCtrl').value,
      
      addressHistoryLookback: Number(ahLookback),
      addressHistoryAllowGaps: ahAllowGaps,
      addressHistoryDisclaimer: this.history.get('addressHistoryDisclaimerCtrl').value,
      
      educationHistoryInclude: educationHistoryInclude,
      
      employmentHistoryLookback: ehLookback,
      employmentHistoryAllowGaps: ehAllowGaps,
      employmentHistoryDisclaimer: this.history.get('employmentHistoryDisclaimerCtrl').value,
      
    }
    this.store.dispatch(actionProcessCreateApplicationForm3(payload));

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
