import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState, NotificationService } from '../../../../../../core/core.module';
import { Observable } from 'rxjs';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { 
  actionAddDemographicsFieldValueToCreateApplicationForm, 
  actionRemoveDemographicsFieldValueFromCreateApplicationForm,
  actionRemoveDemographicsFieldFromCreateApplicationForm,
  actionProcessCreateApplicationForm2, 
  actionResetCreateApplication
} from '../../../../../../core/forms/actions';
import { actionNavigateDashboard } from '../../../../../../core/business/actions';

import { selectCreateApplication, selectCreateApplicationDemographicsFields } from '../../../../../../core/forms/selectors';
import { actionAddDemographicsFieldToCreateApplicationForm } from '../../../../../../core/forms/actions';
import { ApplicationTemplate } from '../../../../../../core/forms/state';

import { actionCreateApplicationFormNavigatePrevious } from '../../../../../../core/forms/actions';

@Component({
  selector: 'CreateApplication2',
  templateUrl: './create-application-2.component.html',
  styleUrls: ['./create-application-2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateApplication2Component implements OnInit {
  public demographicsFields$: Observable<any>;
  public createApplication$: Observable<ApplicationTemplate>;
  public createApplication: ApplicationTemplate
  // thisIsMyForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private notificationService: NotificationService,
  ) 
  {  
    this.demographicsFields$ = this.store.select(selectCreateApplicationDemographicsFields);
    // this.thisIsMyForm = new FormGroup({
    //   formArrayValue: this.fb.array([])
    // });
    this.createApplication$ = this.store.pipe(select(selectCreateApplication));
    this.createApplication$.subscribe(res => this.createApplication = res);
  }

  ngOnInit(): void {
    this.createApplication$ = this.store.pipe(select(selectCreateApplication));
    this.createApplication$.subscribe(res => this.createApplication = res);
    this.demographics.get('demographicsDisclaimerCtrl').setValue(this.createApplication.demographicsDisclaimer);
    
  }

  demographics = this.fb.group({
    fieldNameCtrl: [undefined, []],
    fieldTypeCtrl: ['Text', [Validators.required]],
    demographicsDisclaimerCtrl: [undefined, []]
    // fieldValuesCtrl: this.fb.array([]),
  })

  onAddFieldClick(): void {
    let index = this.createApplication.demographicsFields.findIndex(x => x.fieldName == this.demographics.get('fieldNameCtrl').value);
    if (index > -1) { this.notificationService.error(`${this.demographics.get('fieldNameCtrl').value} Already exists`)}
    else {
      this.store.dispatch(actionAddDemographicsFieldToCreateApplicationForm({ 
        fieldName: this.demographics.get('fieldNameCtrl').value, 
        fieldType: this.demographics.get('fieldTypeCtrl').value 
      }));
  
      this.notificationService.success(`${this.demographics.get('fieldNameCtrl').value} Successfully created`)
    }

    this.demographics.get('fieldNameCtrl').setValue('');
    this.demographics.get('fieldTypeCtrl').setValue('Text');
    this.demographics.get('demographicsDisclaimerCtrl').setValue(this.createApplication.demographicsDisclaimer);
  }

  onAddFieldValueClick(fieldName: string, fieldValue: string): void {
    var myVal = <HTMLInputElement>document.getElementById(fieldValue);
    let index = this.createApplication.demographicsFields.findIndex(x => x.fieldName === fieldName);
    if (index > -1) {
    let index2 = this.createApplication.demographicsFields[index].fieldValues.findIndex(x => x == myVal.value);
    if (index2 == -1) {
      this.notificationService.success(`Value: ${myVal.value} successfully added to ${fieldName}`);
    }
    else {
        this.notificationService.error(`Value: ${myVal.value} already exists for ${fieldName}`);
      }
    }
    this.store.dispatch(actionAddDemographicsFieldValueToCreateApplicationForm({fieldName: fieldName, fieldValue: myVal.value }))
  }

  onRemoveFieldValueClick(fieldName: string, fieldValue: string): void {
    this.store.dispatch(actionRemoveDemographicsFieldValueFromCreateApplicationForm({fieldName: fieldName, fieldValue: fieldValue}))
  }
  
  onRemoveFieldClick(fieldName: string): void {
    this.store.dispatch(actionRemoveDemographicsFieldFromCreateApplicationForm({ fieldName: fieldName }))
  }
  onContinueClick(): void {
    let payload = {
      page: 3,
      previousPage: 2,
      demographicsFields: this.createApplication.demographicsFields,
      demographicsDisclaimer: this.demographics.get('demographicsDisclaimerCtrl').value
    }

    this.store.dispatch(actionProcessCreateApplicationForm2(payload));

  }

    onNoClick(): void {
      this.store.dispatch(actionNavigateDashboard({route: 'human-resources'}));
  }

  
  onResetClick(): void {
    this.store.dispatch(actionResetCreateApplication());
    this.store.dispatch(actionNavigateDashboard({route: 'human-resources'}));
  }

  onPreviousClick(): void {
    this.store.dispatch(actionCreateApplicationFormNavigatePrevious());  
  }
}
