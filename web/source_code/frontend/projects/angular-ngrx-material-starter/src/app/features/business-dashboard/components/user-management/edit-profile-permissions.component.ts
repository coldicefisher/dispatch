import { 
  Component, 
  OnInit, 
  ChangeDetectionStrategy, 
  AfterContentInit, 
  Inject 
} from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { AppState } from '../../../../core/core.module';
import { Store, select } from '@ngrx/store';

import { NotificationService } from '../../../../core/core.module';
import { 
  selectBusiness,
  selectBusinessProfileById
} from '../../../../core/business/selectors';

import { CustomValidators } from '../../../../core/core.module';

import { BusinessUser } from '../../../../core/business/state';
import { actionReplaceUserPermissions } from '../../../../core/business/actions';

export interface EditProfileDialogData {
  profileId: string,
  isDisabled: boolean
}


@Component({
  selector: 'bizniz-edit-profile-permissions',
  templateUrl: './edit-profile-permissions.component.html',
  styleUrls: ['./edit-profile-permissions.component.scss'],

})
export class EditProfilePermissionsComponent implements OnInit {
  profile: BusinessUser;
  profile$: Observable<BusinessUser>;
  isDriver: boolean;
  isEmployee: boolean;
  isHr: boolean;
  isDispatching: boolean;
  isAssets: boolean;
  isAdmin: boolean;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<EditProfilePermissionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditProfileDialogData,  
  ) 
  { 
    dialogRef.disableClose = true;
    this.profile$ = this.store.pipe(select(selectBusinessProfileById(data.profileId)));
    this.profile$.subscribe(res => this.profile = res);
    if (this.profile.permissions.includes('Driver')) { this.editPermissions.get('driverCtrl').setValue(true) };
    if (this.profile.permissions.includes('Employee')) { this.editPermissions.get('employeeCtrl').setValue(true) } ;
    if (this.profile.permissions.includes('Human Resources')) { this.editPermissions.get('hrCtrl').setValue(true) };
    if (this.profile.permissions.includes('Dispatching')) { this.editPermissions.get('dispatchingCtrl').setValue(true) };
    if (this.profile.permissions.includes('Assets')) { this.editPermissions.get('assetsCtrl').setValue(true) };
    if (this.profile.permissions.includes('Administrator')) { this.editPermissions.get('adminCtrl').setValue(true) };
  }

  ngOnInit(): void {
  }

  editPermissions = this.fb.group({
    driverCtrl: [undefined],
    employeeCtrl: [undefined],
    dispatchingCtrl: [undefined],
    hrCtrl: [undefined],
    assetsCtrl: [undefined],
    adminCtrl: [undefined]

  })

  onNoClick(): void {
    this.dialogRef.close();
  }

  onEditPermissionsClick(): void {
    let alterPerm: string[] = [];
    if (this.editPermissions.get('driverCtrl').value) {alterPerm.push('Driver') }
    if (this.editPermissions.get('employeeCtrl').value) {alterPerm.push('Employee') }
    if (this.editPermissions.get('hrCtrl').value) {alterPerm.push('Human Resources') }
    if (this.editPermissions.get('dispatchingCtrl').value) {alterPerm.push('Dispatching') }
    if (this.editPermissions.get('assetsCtrl').value) {alterPerm.push('Assets') }
    if (this.editPermissions.get('adminCtrl').value) {alterPerm.push('Administrator') }
    if (this.profile.permissions.includes('Owner')) {alterPerm.push('Owner') }
    let payload = {
      profileId: this.profile.profileId,
      permissions: alterPerm
    }
    this.store.dispatch(actionReplaceUserPermissions(payload));
    this.dialogRef.close();
  }
}
