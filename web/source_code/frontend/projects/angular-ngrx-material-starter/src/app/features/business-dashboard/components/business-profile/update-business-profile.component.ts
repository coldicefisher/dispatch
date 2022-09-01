import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Inject } from '@angular/core';
import { AppState } from '../../../../core/core.state';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { 
  FormBuilder, 
  FormControl,
  Validators
} from '@angular/forms';


import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../../../../core/data/date-formats';
import { DatePipe } from '@angular/common';

import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


import { NotificationService } from '../../../../core/core.module';

import { actionCommitBusinessProfile, actionUpdateBusinessProfileField } from '../../../../core/business/actions';
import { selectBusiness } from '../../../../core/business/selectors';
// Holds the information that is passed to the update dialog component
export interface DialogData {
  id: number,
  fieldName: string
  fieldValue: string,
}


@Component({
  selector: 'bizniz-update-business-profile',
  templateUrl: './update-business-profile.component.html',
  styleUrls: ['./update-business-profile.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe,
    ]
})

export class UpdateBusinessProfileComponent {
  business$: Observable<any>;
  business: any;
  filteredGenders: Observable<any[]>;
  genderCtrl: FormControl;
  public isDirty: boolean;
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private datePipe: DatePipe,  
    public dialogRef: MatDialogRef<UpdateBusinessProfileComponent>,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    
  ) 
  {
    this.business$ = this.store.pipe(select(selectBusiness));
    this.business$.subscribe(res => this.business = res);
  }
  
    
  form = this.fb.group({
    newValue: [undefined, Validators.compose([
      // Validators.required
      ])
    ],
    dateCtrl: [undefined, Validators.compose([
      // Validators.required
      ])
    ],
    
  });
  
  onNoClick(): void {
    this.dialogRef.close({ 'isDirty': false });
  }


  onUpdate(): void {
    let myVal = undefined;
    if (this.data.fieldName == 'gender') {
      myVal = this.genderCtrl.value;
    }
    
    else {
      myVal = this.form.get('newValue').value;
    }
    
    let isDirty = false;
    if (this.data.fieldValue != myVal) { isDirty = true };
    this.dialogRef.close({'isDirty': isDirty});
    this.store.dispatch(actionUpdateBusinessProfileField({fieldName: this.data.fieldName, fieldValue: myVal}));
    this.store.dispatch(actionCommitBusinessProfile());
  }
}