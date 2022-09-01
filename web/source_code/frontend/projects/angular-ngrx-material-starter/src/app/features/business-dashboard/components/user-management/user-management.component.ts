import { Component, OnInit, ChangeDetectionStrategy, AfterContentInit, Inject } from '@angular/core';
// import { FormBuilder, Validators } from '@angular/forms';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { AppState } from '../../../../core/core.module';
import { Store, select } from '@ngrx/store';

import { NotificationService } from '../../../../core/core.module';
import { 
  selectBusiness,
  selectFilteredBusinessUsers,
  selectIsLoadingUsers
} from '../../../../core/business/selectors';

import { CustomValidators } from '../../../../core/core.module';
import { 
  actionAddProfileToBusiness, 
  actionCreateUnassociatedProfile, 
  actionGetBusinessUsers,
  actionDeleteBusinessProfile,
  actionNavigateDashboard 
} from '../../../../core/business/actions';

import { selectHasAdministratorPermission, 
    selectProfileFullName 
} from '../../../../core/profile/selectors';
import { 
  selectPendingAddBusinessUsers,
  selectPendingDeleteBusinessUsers
} from '../../../../core/business/selectors';

import { AddBusinessProfileComponent } from './add-business-profile.component';
import { EditProfilePermissionsComponent } from './edit-profile-permissions.component';

import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'bizniz-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger(
      'inOutAnimation', 
      [
        transition(
          ':enter', 
          [
            // style({ height: 0, opacity: 0 }),
            // style({ backgroundColor: 'transparent', opacity: 0 }),
            style({ backgroundColor: 'yellow', opacity: 0 }),
            animate('.5s ease-out', 
                    style({ backgroundColor: 'transparent', opacity: 1 }))
          ]
        ),
        transition(
          ':leave', 
          [
            // style({ height: 300, opacity: 1 }),
            style({ backgroundColor: 'green', opacity: 0 }),
            animate('.5s ease-out', 
                    style({ backgroundColor: 'transparent', opacity: 1 }))
          ]
        )
      ]
    )
  ]
})
export class UserManagementComponent implements OnInit, AfterContentInit {
  public business$: Observable<any>;
  public businessUsers$: Observable<any>;
  public pendingAddBusinessUsers$: Observable<any>;
  public pendingDeleteBusinessUsers$: Observable<any>;
  public adminPermission$: Observable<any>;
  public adminPermission: boolean | undefined;
  public isLoadingUsers: boolean | undefined;
  public isLoadingUsers$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private notificationService: NotificationService,    
    public dialog: MatDialog,
    private fb: FormBuilder,
  ) 
  { 
    this.adminPermission$ = this.store.pipe(select(selectHasAdministratorPermission));
    this.adminPermission$.subscribe(res => {
        if (!res) {
            this.store.dispatch(actionNavigateDashboard({route: 'dashboard-home'}));
            this.adminPermission = res;
        }
    })
    this.isLoadingUsers$ = this.store.pipe(select(selectIsLoadingUsers));
  }

  ngOnInit(): void {
    // Navigate home if no permission
    this.adminPermission$.subscribe(res => {
      if (!res){
        this.store.dispatch(actionNavigateDashboard({route: 'dashboard-home'}))
      }
    })
    let businessName = '';
    this.business$ = this.store.pipe(select(selectBusiness));
    this.businessUsers$ = this.store.pipe(select(selectFilteredBusinessUsers(this.userMgmtToolbar.get('selectFilter').value)));
    this.pendingAddBusinessUsers$ = this.store.pipe(select(selectPendingAddBusinessUsers));
    this.pendingDeleteBusinessUsers$ = this.store.pipe(select(selectPendingDeleteBusinessUsers));
    this.business$.subscribe(res => {
      businessName = res.name;
      // console.log(res.users)
    })
    if (businessName && businessName.length > 0 && this.adminPermission) {this.store.dispatch(actionGetBusinessUsers());}
  }

  ngAfterContentInit(): void {
      
  }

  userMgmtToolbar = this.fb.group({
    selectFilter: ["All",]
  })

  onAddProfile() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = '100vh';
    dialogConfig.width = "90%";
    dialogConfig.height = "90%";
    dialogConfig.maxWidth = 800;
    dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(AddBusinessProfileComponent, dialogConfig);
    
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The insert dialog was closed', result.isDirty);
      
    });

  }

  onDeleteProfileClick(profileId: string, firstName: string, middleName: string, lastName: string, suffix: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    
    //dialogConfig.minHeight = 300;
    dialogConfig.maxWidth = 500;
    dialogConfig.maxHeight = 300;
    dialogConfig.width = "90%";
    dialogConfig.height = "90%";
    dialogConfig.disableClose = true;
    dialogConfig.data = {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        suffix: suffix,
        profileId: profileId
    }

    const dialogRef = this.dialog.open(DeleteBusinessProfileComponent, dialogConfig);
  
  }

  onProfileClick(profileId: string, hasLogin: boolean, deleted: boolean): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = '100vh';
    dialogConfig.width = "90%";
    dialogConfig.height = "90%";
    dialogConfig.maxWidth = 800;
    dialogConfig.disableClose = true;
    let isDisabled: boolean;
    if (hasLogin == false || deleted == true) { isDisabled = true }
    else { isDisabled = false }
    let data = {
      profileId: profileId,
      isDisabled: isDisabled
    }
    dialogConfig.data = data;
    const dialogRef = this.dialog.open(EditProfilePermissionsComponent, dialogConfig);
    
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The insert dialog was closed', result.isDirty);
      
    });

  }
  
  onFilterChange($event) {
    
    this.businessUsers$ = this.store.pipe(select(selectFilteredBusinessUsers(this.userMgmtToolbar.get('selectFilter').value)));
  }
}


@Component({
    selector: 'bizniz-delete-business-profile',
    templateUrl: './delete-business-profile.component.html',
    styleUrls: ['./delete-business-profile.component.scss'],
    providers: []
  })
  
  export class DeleteBusinessProfileComponent implements OnInit {
    private business$: Observable<any>;
    private business: any;
    constructor(
      private dialogRef: MatDialogRef<DeleteBusinessProfileComponent>,
      private store: Store<AppState>,
      private fb: FormBuilder,
      
      @Inject(MAT_DIALOG_DATA) public data: any,
    
    ){
      this.business$ = this.store.pipe(select(selectBusiness));
      this.business$.subscribe(res => this.business = res);
    }
    
    ngOnInit(): void {
      
    }
      
    form = this.fb.group({
      
    });
  
    onConfirmDelete(): void {
      this.store.dispatch(actionDeleteBusinessProfile({ 
        profileId: this.data.profileId, 
        businessName: this.business.name, 
        firstName: this.data.firstName, 
        middleName: this.data.middleName, 
        lastName: this.data.lastName, 
        suffix: this.data.suffix 
      }));
      this.dialogRef.close({ 'isDirty': false });
    }
  
    
    onNoClick(): void {
      this.dialogRef.close({ 'isDirty': false });
    }
  
  }