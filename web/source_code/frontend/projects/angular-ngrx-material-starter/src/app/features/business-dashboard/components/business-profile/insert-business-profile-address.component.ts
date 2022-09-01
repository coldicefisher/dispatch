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

import { PlacesService } from '../../../../core/data/places.service';

import { actionInsertBusinessProfileAddress } from '../../../../core/business/actions';

// Holds the information that is passed to the update dialog component
export interface DialogData {
  addressType: string
}


@Component({
  selector: 'bizniz-insert-business-profile-address',
  templateUrl: './insert-business-profile-address.component.html',
  styleUrls: ['./insert-business-profile-address.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe,
    ]
})

export class InsertBusinessProfileAddressComponent {
  business$: Observable<any>;
  business: any;
  public isDirty: boolean;

  filteredStates: Observable<any[]>;
  stateCtrl: FormControl;
  
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private datePipe: DatePipe,  
    public dialogRef: MatDialogRef<InsertBusinessProfileAddressComponent>,
    private notificationService: NotificationService,
    private placesService: PlacesService,

    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    
  ) 
  {
    this.business$ = this.store.pipe(select(selectBusiness));
    this.business$.subscribe(res => this.business = res);
        
    this.stateCtrl = new FormControl();
    this.stateCtrl.addValidators(Validators.required)
    this.filteredStates = this.stateCtrl.valueChanges
    .pipe(
      startWith(''),
      map(state => state ? this.filterStates(state) : this.placesService.states.slice())
    );

  }

  filterStates(name: string) {
    return this.placesService.states.filter(state =>
      state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

    
  form = this.fb.group({
    address1Ctrl: [undefined, [Validators.required]],
    address2Ctrl: [undefined, []],
    cityCtrl: [undefined, []],
    stateCtrl: [undefined, []],
    zipCtrl: [undefined, []]
    
  });
  
  onNoClick(): void {
    this.dialogRef.close({ 'isDirty': false });
  }


  onUpdate(): void {
    this.store.dispatch(actionInsertBusinessProfileAddress({
      addressType: this.data.addressType,
      address1: this.form.get('address1Ctrl').value,
      address2: this.form.get('address2Ctrl').value,
      city: this.form.get('cityCtrl').value,
      state: this.stateCtrl.value,
      zip: this.form.get('zipCtrl').value,    
    }));

    this.store.dispatch(actionCommitBusinessProfile());

    this.dialogRef.close();

  }


  getAddress($event) {
    var [street, city, stateAndZip, ...rest] = $event.formatted_address.split(",");
    var [empty, state, zip] = stateAndZip.split(" ");
    this.form.get('address1Ctrl').setValue(street);
    this.form.get('cityCtrl').setValue(city);
    this.stateCtrl.setValue(state);
    this.form.get('zipCtrl').setValue(zip);
    
  }
}