import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Inject } from '@angular/core';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { 
  FormBuilder, 
  FormControl,
  Validators
} from '@angular/forms';

import { AppState, selectUsername } from '../../../core/core.module';
import { SocketService } from '../../../core/socket/socket.service';

import { 
  selectProfileAddresses, 
  selectWorkHistories,
  selectProfile,
  selectActiveProfileImage,
  selectProfileImages,
} from '../../../core/profile/selectors';

import { actionGetOtpOptions } from '../../../core/auth/auth/actions';

import { 
  actionCommitProfile, 
  actionGetProfile ,
  actionUpdateProfileField,
  actionDeleteProfile,
} from '../../../core/profile/actions';

import {
  actionChangeActiveProfilePicture,
  actionRemoveActiveProfilePicture,
  actionProcessProfileImageInfoFromUploadCare,
} from '../../../core/images/actions';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../../../core/data/date-formats';
import { DatePipe } from '@angular/common';

import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CustomValidators } from '../../../core/core.module';

import { ApplicationDataService } from '../../../core/data/application-data.service';
import { ImageService } from '../../../core/images/image-service';

import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

import { 
  NotificationService, 
  ROUTE_ANIMATIONS_ELEMENTS,
} from '../../../core/core.module';

// Holds the information that is passed to the update dialog component
export interface DialogData {
  id: number,
  fieldName: string
  fieldValue: string,
}

class imageSnippet {
  pending: boolean = false;
  status: string = 'init';
  constructor(
    public src: string,
    public file: File,
  ){}
}

@Component({
  selector: 'bizniz-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfileComponent implements OnInit, OnDestroy {
  constructor(
    private socketService: SocketService,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private applicationDataService: ApplicationDataService,    
    private imageService: ImageService,
    
  ) 
  {
  
  }
  fileName = '';
  imagesOnly: boolean = true;
  username$: Observable<string>;
  authState$: Observable<any>;
  
  color = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  displayProgressSpinner = true;
  spinnerWithoutBackdrop = false;

  workHistoryCount$: Observable<number>;
  workHistories$: Observable<any>;
  addressHistories$: Observable<any>;
  profileImages$: Observable<any>;
  auth$: Observable<any>;
  profile$: Observable<any>;
  activeProfileImage$: Observable<any>;

  public imgProgressSub$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  imgProgress$: Observable<number>;

  
  isDirty: boolean = false;
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  
  ngOnInit(): void {
    
    this.workHistories$ = this.store.pipe(select(selectWorkHistories));
    this.addressHistories$ = this.store.pipe(select(selectProfileAddresses));
    this.profileImages$ = this.store.pipe(select(selectProfileImages));
    this.auth$ = this.store.pipe(select(selectUsername));
    this.profile$ = this.store.pipe(select(selectProfile));
    this.activeProfileImage$ = this.store.pipe(select(selectActiveProfileImage));
    
    let myAuth;
    let userSub = this.auth$.subscribe( res => myAuth = res )
    this.store.dispatch(actionGetOtpOptions({ username: myAuth.username, loginStatus: myAuth.loginStatus }));
    this.store.dispatch(actionGetProfile());
    userSub.unsubscribe();
    
    this.imgProgress$ = this.imgProgressSub$.asObservable();  
  }
  
  ngOnDestroy(): void {
    if (this.isDirty) {
      
      let wh = [];
      let ah = [];
      let il = [];
      let profile;
      // let whSub = this.workHistories$.subscribe( res => wh = res);
      // let ahSub = this.addressHistories$.subscribe( res => ah = res );
      // let ilSub = this.profileImages$.subscribe( res => il = res);
      let profileSub = this.profile$.subscribe( res => profile = res);
      let payload = {
        firstName: profile.firstName,
        middleName: profile.middleName,
        lastName: profile.lastName,
        suffix: profile.suffix,
        gender: profile.gender,
        addresses: profile.addresses,
        workHistories: profile.workHistories,
        images: profile.images,
        privacyStatus: profile.privacyStatus,
        seekingStatus: profile.seekingStatus
      }

      this.store.dispatch(actionCommitProfile(payload));

      // whSub.unsubscribe();
      // ahSub.unsubscribe();
      // ilSub.unsubscribe();
      this.imgProgressSub$.unsubscribe();
    }
  }

  onProfileImgUploadComplete(info) {
    
    this.imgProgressSub$.next(0);
    
    this.store.dispatch(actionProcessProfileImageInfoFromUploadCare({
      imageType: "profileActive",
      uuid: info.uuid,
      name: info.name,
      size: info.size,
      mimeType: info.mimeType,
      originalUrl: info.originalUrl,
      cdnUrl: info.cdnUrl
    }));
    
    this.store.dispatch(actionChangeActiveProfilePicture({ uuid: info.uuid }));
    
    this.isDirty = true;
  }

  onProfileImgProgress(progress) {
    this.imgProgressSub$.next(Number(progress.progress) * 100);
    if (Number(progress.progress) === 1) {
      this.imgProgressSub$.next(0);
    }
  }

  updateDirty($event): void {
    this.isDirty = $event;
  }

  openUpdateProfileDialog(fieldName: string, fieldValue: string): void {
  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    let data = {
      fieldName: fieldName,
      fieldValue: fieldValue
    }
    //dialogConfig.minHeight = 300;
    dialogConfig.maxWidth = 500;
    dialogConfig.maxHeight = 300;
    dialogConfig.width = "90%";
    dialogConfig.height = "90%";
    dialogConfig.disableClose = true;
    dialogConfig.data = data;
    
    const dialogRef = this.dialog.open(UpdateProfileComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result.isDirty) {
        this.isDirty = true;
        
      }
    });
  }

  onDelete(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    
    //dialogConfig.minHeight = 300;
    dialogConfig.maxWidth = 500;
    dialogConfig.maxHeight = 300;
    dialogConfig.width = "90%";
    dialogConfig.height = "90%";
    dialogConfig.disableClose = true;
    
    const dialogRef = this.dialog.open(DeleteProfileComponent, dialogConfig);
  
  }
}

@Component({
  selector: 'bizniz-delete-profile',
  templateUrl: './delete-profile.component.html',
  styleUrls: ['./delete-profile.component.scss'],
  providers: []
})

export class DeleteProfileComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteProfileComponent>,
    private store: Store<AppState>,
    private fb: FormBuilder,
  ){

  }

    
  form = this.fb.group({
    
  });

  onConfirmDelete(): void {
    this.store.dispatch(actionDeleteProfile());
    this.dialogRef.close({ 'isDirty': false });
  }

  
  onNoClick(): void {
    this.dialogRef.close({ 'isDirty': false });
  }

}

@Component({
  selector: 'bizniz-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe,
    ]
})

export class UpdateProfileComponent {
  
  filteredGenders: Observable<any[]>;
  genderCtrl: FormControl;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private datePipe: DatePipe,  
    public dialogRef: MatDialogRef<UpdateProfileComponent>,
    private applicationDataService: ApplicationDataService,    
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    
  ) 
  {
    this.genderCtrl = new FormControl();
    // this.genderCtrl.addValidators(Validators.required);
    this.filteredGenders = this.genderCtrl.valueChanges
    .pipe(
      startWith(''),
      map(type => type ? this.filterGenders(type) : this.applicationDataService.genders.slice())
    );

   }
  

  filterGenders(type: string) {
    return this.applicationDataService.genders.filter(type =>
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
    if (this.data.fieldName == 'gender') {
      myVal = this.genderCtrl.value;
    }
    
    else {
      myVal = this.form.get('newValue').value;
    }
    // Custom data validation on first and last name
    
    if (this.data.fieldName === 'firstName' && myVal === null) {
      this.notificationService.error('Your first name cannot be blank!');
      return
    }
    if (this.data.fieldName === 'lastName' && myVal === null) {
      this.notificationService.error('Your last name cannot be blank!');
      return
    }

    this.store.dispatch(actionUpdateProfileField({ fieldName: this.data.fieldName, fieldValue: myVal }));
    let isDirty = false;
    if (this.data.fieldValue != myVal) { isDirty = true };
    this.dialogRef.close({'isDirty': isDirty});
  }
}