import { Component, OnInit, ChangeDetectionStrategy, AfterContentInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { AppState } from '../../../../core/core.module';
import { Store, select } from '@ngrx/store';

import { NotificationService } from '../../../../core/core.module';
import { 
  selectBusiness,
  selectBusinessUsers
} from '../../../../core/business/selectors';

import { CustomValidators } from '../../../../core/core.module';
import { actionAddProfileToBusiness, actionCreateUnassociatedProfile, actionGetBusinessUsers, actionNavigateDashboard } from '../../../../core/business/actions';
import { selectHasAdministratorPermission } from '../../../../core/profile/selectors';
import { selectBusinessUsersIds} from '../../../../core/business/selectors';


@Component({
  selector: 'bizniz-add-business-profile',
  templateUrl: './add-business-profile.component.html',
  styleUrls: ['./add-business-profile.component.scss'],

})
export class AddBusinessProfileComponent implements OnInit {
  addStatus: string = "start";
  profileId: string = '';
  fullName: string = '';
  firstName: string = '';
  middleName: string = '';
  lastName: string = '';
  suffix: string = '';
  email: string = '';
  emailError: boolean = true;
  isExisting: boolean = false;
  existingIds$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<AddBusinessProfileComponent>,
    
  ) 
  { 
    dialogRef.disableClose = true;
    
  }

  ngOnInit(): void {
    this.existingIds$ = this.store.pipe(select(selectBusinessUsersIds));
  }

  addUser = this.fb.group({
    firstNameCtrl: ['', Validators.required],
    middleNameCtrl: ['', ],
    lastNameCtrl: ['', [Validators.required]],
    suffixCtrl: ['', []],
    
  });

  setPermissions = this.fb.group({
    driverCtrl: [false],
    employeeCtrl: [true],
    adminCtrl: [false],
    dispatchingCtrl: [false],
    hrCtrl: [false],
    assetsCtrl: [false]
    
  })

  getProfile($event) {
    this.profileId = $event.profileId;
    this.firstName = $event.firstName;
    this.middleName = $event.middleName;
    this.lastName = $event.lastName;
    this.fullName = $event.fullName;
    this.suffix = $event.suffix;
    this.isExisting = true;

    this.addStatus = 'setPermissions';
  }

  onContinueNewUserClick(): void {
    this.addStatus = 'setPermissions';
    this.firstName = this.addUser.get('firstNameCtrl').value;
    this.middleName = this.addUser.get('middleNameCtrl').value;
    this.lastName = this.addUser.get('lastNameCtrl').value;
    this.suffix = this.addUser.get('suffixCtrl').value;
    // this.email = this.addUser.get('emailCtrl').value;
  }

  onAddUserClick(): void {
    //Build permissions
    let permissions = [];
    if (this.setPermissions.get('employeeCtrl').value){ permissions.push('Employee') }
    if (this.setPermissions.get('driverCtrl').value){ permissions.push('Driver') }
    if (this.setPermissions.get('hrCtrl').value){ permissions.push('Human Resources') }
    if (this.setPermissions.get('dispatchingCtrl').value){ permissions.push('Dispatching') }
    if (this.setPermissions.get('adminCtrl').value){ permissions.push('Administrator') }
    if (this.setPermissions.get('assetsCtrl').value){ permissions.push('Assets') }
    this.fullName = this.firstName;
    if (this.middleName.length > 0) { this.fullName += ' ' + this.middleName };
    this.fullName += ' ' + this.lastName;
    if (this.suffix.length > 0) { this.fullName += ' ' + this.suffix };

    if (this.isExisting) {
      this.store.dispatch(actionAddProfileToBusiness({profileId: this.profileId, permissions: permissions, firstName: this.firstName, middleName: this.middleName, lastName: this.lastName, suffix: this.suffix }))
    } else {
      this.store.dispatch(actionCreateUnassociatedProfile({firstName: this.firstName, middleName: this.middleName, lastName: this.lastName, suffix: this.suffix, permissions: permissions, email: this.email }))
    }
    this.dialogRef.close();
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  getEmail($event) {
    console.log($event);
    this.email = $event.email;
    this.emailError = $event.hasError;
    console.log('Vairables:::::::::::::::::::::::::::');
    
  }
}
