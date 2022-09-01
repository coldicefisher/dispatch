import { 
  Component, 
  OnInit, 
  OnDestroy, 
  ChangeDetectionStrategy, 
  Output,
  Inject,
  EventEmitter

} from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { startWith, map } from 'rxjs/operators';
import { Validators, FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { AppState } from '../../../../core/core.module';

import { SocketService } from '../../../../core/socket/socket.service';
import { 
    
    actionUpdateProfileAddressHistoryField, 
    actionInsertProfileAddressHistory,
    actionDeleteProfileAddressHistory, 
    actionGetProfile 
} from '../../../../core/profile/actions';

import { 
  profileAddressState, 
  ProfileState
} from '../../../../core/profile/state';

import { 
  selectSortedAddressHistories,
  selectProfile, 
} from '../../../../core/profile/selectors';

import { PlacesService } from '../../../../core/data/places.service';
import { ApplicationDataService } from '../../../../core/data/application-data.service';

import {
  ROUTE_ANIMATIONS_ELEMENTS,
} from '../../../../core/core.module';

import { CustomValidators } from '../../../../core/core.module';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../../../../core/data/date-formats';
import { DatePipe } from '@angular/common';



// Holds the information that is passed to the update dialog component
export interface DialogData {
  id: number,
  fieldName: string
  fieldValue: string,
}

var stateChangedBackend: boolean = false;


@Component({
  selector: 'bizniz-profile-address-history',
  templateUrl: './address-history.component.html',
  styleUrls: ['./address-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddressHistoryComponent implements OnInit, OnDestroy {
  message: boolean = false;
  @Output() isDirtyEvent = new EventEmitter<boolean>();
  constructor(
    public dialog: MatDialog,
    private socketService: SocketService,
    private store: Store<AppState>,
    private fb: FormBuilder,
    
    
  ) { }
  sortedAddressHistories$: Observable<profileAddressState[]>;
  profile$: Observable<ProfileState>;
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  

  form = this.fb.group({
    
  });

  ngOnInit(): void {
    this.sortedAddressHistories$ = this.store.pipe(select(selectSortedAddressHistories));
    this.profile$ = this.store.pipe(select(selectProfile));

  }

  ngOnDestroy(): void {
    
  }
  
  sendMessage(newVal: boolean) {
    
    this.isDirtyEvent.emit(newVal);
  }
  onSend(): void {
    // let ah = [];
    // let ahSub = this.sortedAddressHistories$.subscribe( res => ah = res );
    // let payload = {
    //   middleName: 'Jamey',
    //   gender: 'Male',
    //   suffix: 'Jr',
    //   addresses: ah,
    //   workHistories: [],
    // }
    // ahSub.unsubscribe();    
  }

  openUpdateAddressHistoryDialog(id: number, fieldName: string, fieldValue: string): void {
  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    let data = {
      id: id,
      fieldName: fieldName,
      fieldValue: fieldValue
      
    }
    dialogConfig.maxWidth = 500;
    dialogConfig.maxHeight = 300;
    dialogConfig.width = "90%";
    dialogConfig.height = "90%";
    dialogConfig.disableClose = true;
    dialogConfig.data = data;
    
    const dialogRef = this.dialog.open(UpdateAddressHistoryComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result.isDirty) {
        this.sendMessage(true);
      }
    });
  }

  openInsertAddressHistoryDialog(): void {
  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = '100vh';
    dialogConfig.maxWidth = 800;
    dialogConfig.width = "90%";
    dialogConfig.height = "90%";
    dialogConfig.disableClose = true;
    
    const dialogRef = this.dialog.open(InsertAddressHistoryComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      
      this.sendMessage(true);
    });
  }

  onDeleteAddressHistory(id: number): void {
    this.store.dispatch(actionDeleteProfileAddressHistory( {id: id }));
    this.sendMessage(true);
  }
}

@Component({
  selector: 'bizniz-update-address-history',
  templateUrl: './update-address-history.component.html',
  styleUrls: ['./update-address-history.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe,
    ]
})
export class UpdateAddressHistoryComponent {
  
  filteredStates: Observable<any[]>;
  stateCtrl: FormControl;

  filteredAddressTypes: Observable<any[]>;
  addressTypeCtrl: FormControl;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private placesService: PlacesService,
    private applicationDataService: ApplicationDataService,
    private datePipe: DatePipe,  
    public dialogRef: MatDialogRef<UpdateAddressHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) 
  { 
    
    this.stateCtrl = new FormControl();
    this.stateCtrl.addValidators(Validators.required);
    this.filteredStates = this.stateCtrl.valueChanges
    .pipe(
      startWith(''),
      map(state => state ? this.filterStates(state) : this.placesService.states.slice())
    );
  
    this.addressTypeCtrl = new FormControl();
    this.addressTypeCtrl.addValidators(Validators.required);
    this.filteredAddressTypes = this.addressTypeCtrl.valueChanges
    .pipe(
      startWith(''),
      map(type => type ? this.filterAddressTypes(type) : this.applicationDataService.addressTypes.slice())
    );
  
  }
  
  
  filterStates(name: string) {
    return this.placesService.states.filter(state =>
      state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  filterAddressTypes(type: string) {
    return this.applicationDataService.addressTypes.filter(type =>
      type.display.toLowerCase().indexOf(type.display.toLowerCase()) === 0);    
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
    phoneCtrl: [undefined, Validators.compose([
    
      CustomValidators.phoneValidator({ validPhone: true })
      ])
    ],
    
  });
  
  onNoClick(): void {
    this.dialogRef.close({ 'isDirty': false });
  }

  onUpdate(): void {
    let myVal = undefined;
    if (this.data.fieldName == 'state') {
      myVal = this.stateCtrl.value;
    
    }
    else if (this.data.fieldName == 'startDate' || this.data.fieldName == 'endDate') {
      myVal = this.datePipe.transform(this.form.get('dateCtrl').value, "MM/dd/YYYY");
    }
    else {
      myVal = this.form.get('newValue').value;
    }

    this.store.dispatch(actionUpdateProfileAddressHistoryField({ id: this.data.id, fieldName: this.data.fieldName, fieldValue: myVal }));
    let isDirty = false;
    if (this.data.fieldValue != myVal) { isDirty = true };
    this.dialogRef.close({ 'isDirty': isDirty});
  }
}

@Component({
  selector: 'bizniz-insert-address-history',
  templateUrl: './insert-address-history.component.html',
  styleUrls: ['./insert-address-history.component.scss'],
  providers: [DatePipe],
})
export class InsertAddressHistoryComponent {

  filteredStates: Observable<any[]>;
  stateCtrl: FormControl;

  filteredAddressTypes: Observable<any[]>;
  addressTypeCtrl: FormControl;

  
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private placesService: PlacesService,
    private applicationDataService: ApplicationDataService,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<InsertAddressHistoryComponent>,

  ) 
  { 
    dialogRef.disableClose = true;

    this.stateCtrl = new FormControl();
    this.stateCtrl.addValidators(Validators.required)
    this.filteredStates = this.stateCtrl.valueChanges
    .pipe(
      startWith(''),
      map(state => state ? this.filterStates(state) : this.placesService.states.slice())
    );

    this.stateCtrl = new FormControl();
    this.filteredStates = this.stateCtrl.valueChanges
    .pipe(
      startWith(''),
      map(state => state ? this.filterStates(state) : this.placesService.states.slice())
    );

    this.addressTypeCtrl = new FormControl();
    this.addressTypeCtrl.addValidators(Validators.required);
    this.filteredAddressTypes = this.addressTypeCtrl.valueChanges
    .pipe(
      startWith(''),
      map(type => type ? this.filterAddressTypes(type) : this.applicationDataService.addressTypes.slice())
    );

  }
  
  filterStates(name: string) {
    return this.placesService.states.filter(state =>
      state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  filterAddressTypes(type: string) {
    return this.applicationDataService.addressTypes.filter(type =>
      type.display.toLowerCase().indexOf(type.display.toLowerCase()) === 0);    
  }

  form = this.fb.group({
    
    address1: [undefined, Validators.compose([
      Validators.required
      ])
    ],
    address2: [undefined, Validators.compose([
      
      ])
    ],
    city: [undefined, Validators.compose([
      Validators.required
      ])
    ],
    zip: [undefined, Validators.compose([
      Validators.required
      ])
    ],
    startDate: [undefined, Validators.compose([
      Validators.required
      ]),
    ],
    endDate: [undefined, Validators.compose([
      // Validators.required
      ]),
    ],
  
  });
  
  onNoClick(): void {
    this.dialogRef.close({ 'isDirty': false });
  }

  onAddAddressHistory(): void {

    let payload = {
      startDate: this.datePipe.transform(this.form.get('startDate').value, "MM/dd/YYYY"),
      endDate: this.datePipe.transform(this.form.get('endDate').value, "MM/dd/YYYY"),
      addressType: this.addressTypeCtrl.value,
      address1: this.form.get('address1').value,
      address2: this.form.get('address2').value,
      city: this.form.get('city').value,
      state: this.stateCtrl.value,
      zip: this.form.get('zip').value,
      
    }

    this.store.dispatch(actionInsertProfileAddressHistory(payload));
    //updateStateChange(true);

    this.dialogRef.close({ 'isDirty': true });
  }

  getAddress($event) {
    var [street, city, stateAndZip, ...rest] = $event.formatted_address.split(",");
    var [empty, state, zip] = stateAndZip.split(" ");
    this.form.get('address1').setValue(street);
    this.form.get('city').setValue(city);
    this.stateCtrl.setValue(state);
    this.form.get('zip').setValue(zip);
    
  }

}
