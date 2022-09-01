import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../../core/core.state';
import { Observable } from 'rxjs';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CustomValidators, NotificationService } from '../../../../../../core/core.module';


import { 
  actionCreateApplicationFormNavigatePrevious,
  actionIncludeDrivingHistoryForCreateApplicationForm,
  actionIncludeAccidentHistoryForCreateApplicationForm,
  actionIncludeEquipmentExperienceForCreateApplicationForm,
  actionProcessCreateApplicationForm4,
  actionAddEquipmentTypeToCreateApplication,
  actionRemoveEquipmentTypeFromCreateApplication,
  actionResetCreateApplication,
} from '../../../../../../core/forms/actions';

import { actionNavigateDashboard } from '../../../../../../core/business/actions';
import { selectCreateApplication } from '../../../../../../core/forms/selectors';

@Component({
  selector: 'CreateApplication4',
  templateUrl: './create-application-4.component.html',
  styleUrls: ['./create-application-4.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateApplication4Component implements OnInit {
  createApplication$: Observable<any>;
  createApplication: any;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private notificationService: NotificationService,
  ) 
  {  
    this.createApplication$ = this.store.pipe(select(selectCreateApplication));
    this.createApplication$.subscribe(res => this.createApplication = res);
  }

  ngOnInit(): void {
    if (this.createApplication.drivingHistoryInclude == true){
      this.driving.get('drivingHistoryIncludeCtrl').setValue("Yes");
    }else {
      this.driving.get('drivingHistoryIncludeCtrl').setValue("No");
    }
    
    this.driving.get('licenseHistoryLookbackCtrl').setValue(this.createApplication.licenseHistoryLookback);
    this.driving.get('licenseHistoryDisclaimerCtrl').setValue(this.createApplication.licenseHistoryDisclaimer);
    
    if (this.createApplication.accidentHistoryInclude == true){
      this.driving.get('accidentHistoryIncludeCtrl').setValue("Yes");
    } else {
      this.driving.get('accidentHistoryIncludeCtrl').setValue("No");
    }
    
    this.driving.get('accidentHistoryLookbackCtrl').setValue(this.createApplication.accidentHistoryLookback);
    this.driving.get('accidentHistoryDisclaimerCtrl').setValue(this.createApplication.accidentHistoryDisclaimer);

    if (this.createApplication.equipmentExperienceInclude == true){ this.driving.get('equipmentExperienceIncludeCtrl').setValue("Yes")}
    else {this.driving.get('equipmentExperienceIncludeCtrl').setValue('No')}
  }

  driving = this.fb.group({
    drivingHistoryIncludeCtrl: [undefined, [Validators.required]],
    licenseHistoryLookbackCtrl:[365, Validators.compose([
      CustomValidators.patternValidator(RegExp(/^\d+$/), 
      {numericError: true})      
    ])],
    licenseHistoryDisclaimerCtrl: [undefined, []],
    equipmentExperienceIncludeCtrl: [undefined, []],
    equipmentTypeCtrl: [undefined, []],
    accidentHistoryIncludeCtrl: [undefined, []],
    accidentHistoryLookbackCtrl: [undefined, [
      CustomValidators.patternValidator(RegExp(/^\d+$/), 
      {numericError: true})      

    ]],
    accidentHistoryDisclaimerCtrl: [undefined, []],

  })

  onContinueClick(): void {
    let payload = {
      page: 5,
      previousPage: 4,
      licenseHistoryLookback: Number(this.driving.get('licenseHistoryLookbackCtrl').value),
      licenseHistoryDisclaimer: this.driving.get('licenseHistoryDisclaimerCtrl').value,
      accidentHistoryLookback: Number(this.driving.get('accidentHistoryLookbackCtrl').value),
      accidentHistoryDisclaimer: this.driving.get('accidentHistoryDisclaimerCtrl').value

    }
    this.store.dispatch(actionProcessCreateApplicationForm4(payload));

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

  onSelectDrivingHistory(): void {
    let include = true;
    if (this.driving.get('drivingHistoryIncludeCtrl').value == "No") { 
      include = false;
      this.driving.get('licenseHistoryLookbackCtrl').addValidators(Validators.required);
    } else {
      include = true;
      this.driving.get('licenseHistoryLookbackCtrl').removeValidators(Validators.required);
    }
    this.store.dispatch(actionIncludeDrivingHistoryForCreateApplicationForm({include: include}));
    
      
  }

  onSelectAccidentHistory(): void {
    let include = true;
    if (this.driving.get('accidentHistoryIncludeCtrl').value == "No") { 
      include = false;
      this.driving.get('accidentHistoryLookbackCtrl').addValidators(Validators.required);
    } else {
      include = true;
      this.driving.get('accidentHistoryLookbackCtrl').removeValidators(Validators.required);
    }
    this.store.dispatch(actionIncludeAccidentHistoryForCreateApplicationForm({ include: include }));
  }

  onSelectEquipmentExperience(): void {
    let include = true;
    if (this.driving.get('equipmentExperienceIncludeCtrl').value == "No") { include = false };
    this.store.dispatch(actionIncludeEquipmentExperienceForCreateApplicationForm({include: include}));
  }

  onAddEquipmentTypeClick(): void {
    if (this.driving.get('equipmentTypeCtrl').value == '' || this.driving.get('equipmentTypeCtrl').value == undefined) {return};
    if (this.createApplication.equipmentTypes.findIndex(x => x == this.driving.get('equipmentTypeCtrl').value) == -1) {
      this.notificationService.success(`${this.driving.get('equipmentTypeCtrl').value} successfully added`);
    }
    else{
      this.notificationService.error(`${this.driving.get('equipmentTypeCtrl').value} already exists`);
    }
    this.store.dispatch(actionAddEquipmentTypeToCreateApplication({ equipmentType: this.driving.get('equipmentTypeCtrl').value}));
    this.driving.get('equipmentTypeCtrl').setValue('');
  }

  onRemoveEquipmentTypeClick(type: string): void {
    this.store.dispatch(actionRemoveEquipmentTypeFromCreateApplication({ equipmentType: type}));
  }
}
