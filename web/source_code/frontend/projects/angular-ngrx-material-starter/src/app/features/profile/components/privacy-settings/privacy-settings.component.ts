import { 
  Component, 
  OnInit, 
  ChangeDetectionStrategy, 
  Inject, 
  Output,
  EventEmitter
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/core.module';

import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { 
  CustomValidators,
  ROUTE_ANIMATIONS_ELEMENTS,

} from '../../../../core/core.module';

import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { selectProfile } from '../../../../core/profile/selectors';

import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NotificationService } from '../../../../core/core.module';
import { ApplicationDataService } from '../../../../core/data/application-data.service';

import { actionUpdateProfileField } from '../../../../core/profile/actions';

@Component({
  selector: 'bizniz-privacy-settings',
  templateUrl: './privacy-settings.component.html',
  styleUrls: ['./privacy-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PrivacySettingsComponent implements OnInit {
  @Output() isDirtyEvent = new EventEmitter<boolean>();
  profile$: Observable<any>;
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private dialog: MatDialog,

  ) 
  {
    this.profile$ = this.store.pipe(select(selectProfile));

  }

  

  ngOnInit(): void {

  }
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  form = this.fb.group(
    {
    },
    // {
    //   validators: [CustomValidators.match('pwd', 'pwdConfirm')]
    //   //validators: [CustomValidators.passwordMatchValidator(]
    // },
    
  ); // End form


  sendMessage(newVal: boolean) {
    
    this.isDirtyEvent.emit(newVal);
  }

  openUpdatePrivacySettingsDialog(fieldName: string, fieldValue: string): void {
  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    let data = {
      fieldName: fieldName,
      fieldValue: fieldValue
      
    }
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = 500;
    dialogConfig.maxHeight = 300;
    dialogConfig.width = "90%";
    dialogConfig.height = "90%";
    dialogConfig.disableClose = true;
    dialogConfig.data = data;
    
    const dialogRef = this.dialog.open(UpdatePrivacySettingsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result.isDirty) {
        this.sendMessage(true);
      }
    });
  }


}

interface DialogData {
  id: number,
  fieldName: string
  fieldValue: string,
}

@Component({
  selector: 'bizniz-update-privacy-settings',
  templateUrl: './update-privacy-settings.component.html',
  styleUrls: ['./update-privacy-settings.component.scss'],
  providers: [],
})

export class UpdatePrivacySettingsComponent {
  
  filteredPrivacyStatus: Observable<any[]>;
  filteredSeekingStatus: Observable<any[]>;
  privacyStatusCtrl: FormControl;
  seekingStatusCtrl: FormControl;
  
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<UpdatePrivacySettingsComponent>,
    private applicationDataService: ApplicationDataService,    
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    
  ) 
  {
    this.privacyStatusCtrl = new FormControl();
    this.seekingStatusCtrl = new FormControl();

    this.filteredPrivacyStatus = this.privacyStatusCtrl.valueChanges
    .pipe(
      startWith(''),
      map(type => type ? this.filterPrivacyStatus(type) : this.applicationDataService.privacyStatus.slice())
    );
    this.filteredSeekingStatus = this.seekingStatusCtrl.valueChanges
    .pipe(
      startWith(''),
      map(type => type ? this.filterSeekingStatus(type) : this.applicationDataService.seekingStatus.slice())
    );
   }
  

  filterPrivacyStatus(type: string) {
    return this.applicationDataService.privacyStatus.filter(type =>
      type.display.toLowerCase().indexOf(type.display.toLowerCase()) === 0);    
  }
  filterSeekingStatus(type: string) {
    return this.applicationDataService.seekingStatus.filter(type =>
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
    
  });
  
  onNoClick(): void {
    this.dialogRef.close({ 'isDirty': false });
  }


  onUpdate(): void {
    let myVal = undefined;
    if (this.data.fieldName == 'privacyStatus') {
      myVal = this.privacyStatusCtrl.value;
    }
    else if (this.data.fieldName == 'seekingStatus') {
      myVal = this.seekingStatusCtrl.value;
    }
    else {
      myVal = this.form.get('newValue').value;
    }
    // Custom data validation on first and last name
    
    if (this.data.fieldName === 'privacyStatus' && myVal === null) {
      this.notificationService.error('Your privacy status cannot be blank!');
      return
    }
    if (this.data.fieldName === 'seekingStatus' && myVal === null) {
      this.notificationService.error('Your seeking status cannot be blank!');
      return
    }

    this.store.dispatch(actionUpdateProfileField({ fieldName: this.data.fieldName, fieldValue: myVal }));
    let isDirty = false;
    if (this.data.fieldValue != myVal) { isDirty = true };
    this.dialogRef.close({'isDirty': isDirty});
  }
}