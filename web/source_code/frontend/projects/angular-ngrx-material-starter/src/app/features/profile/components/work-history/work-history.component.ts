import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { startWith, map } from 'rxjs/operators';
import { Inject, EventEmitter } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { AppState } from '../../../../core/core.module';

import { SocketService } from '../../../../core/socket/socket.service';
import { actionDeleteProfileWorkHistory, actionGetProfile } from '../../../../core/profile/actions';
import { 
  actionUpdateProfileWorkHistoryField, 
  actionInsertProfileWorkHistory 
} from '../../../../core/profile/actions';

import { 
  profileAddressState, 
  ProfileState 
} from '../../../../core/profile/state';

import { 
  
  selectSortedWorkHistories,
  selectProfile, 
  selectProfileAddresses 
} from '../../../../core/profile/selectors';
import { PlacesService } from '../../../../core/data/places.service';

import {
  ROUTE_ANIMATIONS_ELEMENTS,
  
} from '../../../../core/core.module';

import { CustomValidators } from '../../../../core/core.module';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../../../../core/data/date-formats';
import { DatePipe } from '@angular/common';
import { format } from 'path';



// Holds the information that is passed to the update dialog component
export interface DialogData {
  id: number,
  fieldName: string
  fieldValue: string,
}

// var stateChangedBackend: boolean = false;


@Component({
  selector: 'bizniz-profile-work-history',
  templateUrl: './work-history.component.html',
  styleUrls: ['./work-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WorkHistoryComponent implements OnInit, OnDestroy {
  message: boolean = false;
  @Output() isDirtyEvent = new EventEmitter<boolean>();

  constructor(
    public dialog: MatDialog,
    private socketService: SocketService,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private placesService: PlacesService,

    
    
  ) { }
  sortedWorkHistories$: Observable<any>;
  //workHistory$: Observable<profileWorkHistoryState>;
  addresses$: Observable<profileAddressState[]>;
  profile$: Observable<ProfileState>;
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  

  
  ngOnInit(): void {
    this.sortedWorkHistories$ = this.store.pipe(select(selectSortedWorkHistories));
    this.addresses$ = this.store.pipe(select(selectProfileAddresses));
    this.profile$ = this.store.pipe(select(selectProfile));
    
  }
  
  ngOnDestroy(): void {

  }

  form = this.fb.group({
  });

  sendMessage(newVal: boolean) {
    this.isDirtyEvent.emit(newVal);
  }

  onSend(): void {
  //   let wh = [];
  //   let whSub = this.sortedWorkHistories$.subscribe( res => wh = res );
  //   let payload = {
  //     middleName: 'Jamey',
  //     gender: 'Male',
  //     suffix: 'Jr',
  //     addresses: [],
  //     workHistories: wh,
  //   }
  //   whSub.unsubscribe();    
  }

  openUpdateWorkHistoryDialog(id: number, fieldName: string, fieldValue: string): void {
  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    let data = {
      id: id,
      fieldName: fieldName,
      fieldValue: fieldValue
      
    }
    //dialogConfig.minHeight = 300;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = 500;
    dialogConfig.maxHeight = 300;
    dialogConfig.width = "90%";
    dialogConfig.height = "90%";
    dialogConfig.disableClose = true;
    dialogConfig.data = data;
    
    const dialogRef = this.dialog.open(UpdateWorkHistoryComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The update dialog was closed', result);
      if (result.isDirty) {
        // console.log('it was dirty!');
        this.sendMessage(true);
      }
    });
  }

  openInsertWorkHistoryDialog(): void {
  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = '100vh';
    dialogConfig.width = "90%";
    dialogConfig.height = "90%";
    dialogConfig.maxWidth = 800;
    dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(InsertWorkHistoryComponent, dialogConfig);
    
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The insert dialog was closed', result.isDirty);
      this.sendMessage(true);
    });
  }

  onDeleteWorkHistory(id: number): void {
    this.store.dispatch(actionDeleteProfileWorkHistory( {id: id }));
    this.sendMessage(true);
  }
}

@Component({
  selector: 'bizniz-update-work-history',
  templateUrl: './update-work-history.component.html',
  styleUrls: ['./update-work-history.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe,
    ]
})
export class UpdateWorkHistoryComponent {
  
  filteredStates: Observable<any[]>;
  stateCtrl: FormControl;
  emailCtrl: FormControl;
  phoneCtrl: FormControl;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private placesService: PlacesService,
    private datePipe: DatePipe,  
    public dialogRef: MatDialogRef<UpdateWorkHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    
  ) 
  { 
    
    this.stateCtrl = new FormControl('');
    this.stateCtrl.addValidators(Validators.required)
    this.filteredStates = this.stateCtrl.valueChanges
    .pipe(
      startWith(''),
      map(state => state ? this.filterStates(state) : this.placesService.states.slice())
    );
  
    this.emailCtrl = new FormControl();
    this.emailCtrl.addValidators(CustomValidators.emailValidator({ validEmail: true }));
    
    this.phoneCtrl = new FormControl();
    this.phoneCtrl.addValidators(CustomValidators.phoneValidator({ validPhone: true }));

  }
  
  filterStates(name: string) {
    return this.placesService.states.filter(state =>
      state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  form = this.fb.group({
    newValue: [undefined, Validators.compose([
      // Validators.required
      ])
    ],
    dateCtrl: [undefined, Validators.compose([
      Validators.required
      ])
    ],
    phoneCtrl: [undefined, Validators.compose([
      Validators.required,
      CustomValidators.phoneValidator({ validPhone: true })
      ])
    ],
  });
  
  onNoClick(): void {
    this.dialogRef.close({ 'isDirty': false });
  }

  onUpdate(): void {
    let myVal = undefined;
    if (this.data.fieldName == 'mailingState' || this.data.fieldName == 'physicalState') {
      myVal = this.stateCtrl.value;
      //this.store.dispatch(actionUpdateProfileWorkHistoryField({ id: this.data.id, fieldName: this.data.fieldName, fieldValue: this.stateCtrl.value }));  
    }
    else if (this.data.fieldName == 'startDate' || this.data.fieldName == 'endDate') {
      myVal = this.datePipe.transform(this.form.get('dateCtrl').value, "MM/dd/YYYY");
    }
    else if (this.data.fieldName == 'phoneNumber') {
      myVal = this.phoneCtrl.value;
    }
    else if (this.data.fieldName == 'email') {
      //myVal = this.form.get('emailCtrl').value;
      myVal = this.emailCtrl.value;
    }
    else {
      myVal = this.form.get('newValue').value;
    }
    this.store.dispatch(actionUpdateProfileWorkHistoryField({ id: this.data.id, fieldName: this.data.fieldName, fieldValue: myVal }));
    let isDirty = false;
    if (this.data.fieldValue != myVal) { isDirty = true };
    this.dialogRef.close({'isDirty': isDirty});
  }
}

@Component({
  selector: 'bizniz-insert-work-history',
  templateUrl: './insert-work-history.component.html',
  styleUrls: ['./insert-work-history.component.scss'],
  providers: [DatePipe],
})
export class InsertWorkHistoryComponent {

  filteredPhyStates: Observable<any[]>;
  filteredMailStates: Observable<any[]>;
  phyStateCtrl: FormControl;
  mailStateCtrl: FormControl;
  varMailingAddress1: undefined | string;
  varMailingAddress2: undefined | string;
  varMailingCity: undefined | string;
  varMailingState: undefined | string;
  varMailingZip: undefined | string;
  
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private placesService: PlacesService,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<InsertWorkHistoryComponent>,

  ) 
  { 
    dialogRef.disableClose = true;

    this.phyStateCtrl = new FormControl();
    this.phyStateCtrl.addValidators(Validators.required)
    this.filteredPhyStates = this.phyStateCtrl.valueChanges
    .pipe(
      startWith(''),
      map(state => state ? this.filterStates(state) : this.placesService.states.slice())
    );

    this.mailStateCtrl = new FormControl();
    this.filteredMailStates = this.mailStateCtrl.valueChanges
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
    businessName: [undefined, Validators.compose([
      Validators.required
      ])
    ],
    physicalAddress1: [undefined, Validators.compose([
      Validators.required
      ])
    ],
    physicalAddress2: [undefined, Validators.compose([
      
      ])
    ],
    physicalCity: [undefined, Validators.compose([
      Validators.required
      ])
    ],
    physicalZip: [undefined, Validators.compose([
      Validators.required
      ])
    ],
    mailingAddress1: [undefined, Validators.compose([
      ])
    ],
    mailingAddress2: [undefined, Validators.compose([
      ])
    ],
    mailingCity: [undefined, Validators.compose([
      ])
    ],
    mailingZip: [undefined, Validators.compose([
      ])
    ],
    positionsHeld: [undefined, Validators.compose([
        
      ])
    ],
    description: [undefined, Validators.compose([
        
      ]),
    ],
    startDate: [undefined, Validators.compose([
      Validators.required
      ]),
    ],
    endDate: [undefined, Validators.compose([
      // Validators.required
      ]),
    ],
    phoneNumber: [undefined, Validators.compose([
        CustomValidators.phoneValidator({ validPhone: true })
      ]),
    ],
    supervisor: [undefined, Validators.compose([

      ])
    ],
    email: [undefined, Validators.compose([
        CustomValidators.emailValidator({ validEmail: true })
      ])
    ],
    website: [undefined, Validators.compose([

      ])
    ],
  
  });
  
  onNoClick(): void {
    this.dialogRef.close({ 'isDirty': false });
  }

  onAddWorkHistory(): void {
    
    if (this.form.get('mailingAddress1').value == undefined && this.form.get('mailingAddress2').value == undefined && this.form.get('mailingCity').value == undefined && this.mailStateCtrl.value == undefined && this.form.get('mailingZip').value == undefined) {
      this.varMailingAddress1 = this.form.get('physicalAddress1').value;
      this.varMailingAddress2 = this.form.get('physicalAddress2').value;
      this.varMailingCity = this.form.get('physicalCity').value;
      this.varMailingState = this.phyStateCtrl.value;
      this.varMailingZip = this.form.get('physicalZip').value;
    } 
    else
    {
      this.varMailingAddress1 = this.form.get('mailingAddress1').value;
      this.varMailingAddress2 = this.form.get('mailingAddress2').value;
      this.varMailingCity = this.form.get('mailingCity').value;
      this.varMailingState = this.mailStateCtrl.value;
      this.varMailingZip = this.form.get('mailingZip').value;
    }

    let payload = {
      businessName: this.form.get('businessName').value,
      positionsHeld: this.form.get('positionsHeld').value,
      description: this.form.get('description').value,
      startDate: this.datePipe.transform(this.form.get('startDate').value, "MM/dd/YYYY"),
      endDate: this.datePipe.transform(this.form.get('endDate').value, "MM/dd/YYYY"),
      physicalAddress1: this.form.get('physicalAddress1').value,
      physicalAddress2: this.form.get('physicalAddress2').value,
      physicalCity: this.form.get('physicalCity').value,
      physicalState: this.phyStateCtrl.value,
      physicalZip: this.form.get('physicalZip').value,
      mailingAddress1: this.varMailingAddress1,
      mailingAddress2: this.varMailingAddress2,
      mailingCity: this.varMailingCity,
      mailingState: this.varMailingState,
      mailingZip: this.varMailingZip,
      supervisor: this.form.get('supervisor').value,
      phoneNumber: this.form.get('phoneNumber').value,
      email: this.form.get('email').value,
      website: this.form.get('website').value,
    }

    this.store.dispatch(actionInsertProfileWorkHistory(payload));
    //updateStateChange(true);
    this.dialogRef.close({ 'isDirty': true });
  }


  getAddress($event) {
    var [street, city, stateAndZip, ...rest] = $event.formatted_address.split(",");
    var [empty, state, zip] = stateAndZip.split(" ");
    this.form.get('physicalAddress1').setValue(street);
    this.form.get('mailingAddress1').setValue(street);
    this.form.get('physicalCity').setValue(city);
    this.form.get('mailingCity').setValue(city);
    this.phyStateCtrl.setValue(state);
    this.mailStateCtrl.setValue(state);
    this.form.get('physicalZip').setValue(zip);
    this.form.get('mailingZip').setValue(zip);
    
  }
}
