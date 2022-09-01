import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { AppState } from '../../../../core/core.module';

import { selectActiveBusinessProfileImage } from '../../../../core/business/selectors';
import { selectBusinessProfileWithCurrentAddresses } from '../../../../core/business/selectors';
import { actionProcessBusinessProfileImageInfoFromUploadCare } from '../../../../core/images/actions';
import { actionChangeActiveBusinessProfilePicture } from '../../../../core/images/actions';
import { actionCommitBusinessProfile, actionGetBusinessProfile, actionUpdateBusinessProfileField } from '../../../../core/business/actions';

import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { UpdateBusinessProfileComponent } from './update-business-profile.component';
import { InsertBusinessProfileAddressComponent } from './insert-business-profile-address.component';

import { selectHasAdministratorPermission } from '../../../../core/profile/selectors';

@Component({
  selector: 'bizniz-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessProfileComponent implements OnInit {
  public business$: Observable<any>;
  public business: any;
  public isAdmin$: Observable<boolean>;
  public isAdmin: boolean;  
  public imgProgressSub$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public isDirty: boolean;
  imgProgress$: Observable<number>;
  activeBusinessProfileImage$: Observable<any>;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
  ) 
  {
    this.activeBusinessProfileImage$ = this.store.pipe(select(selectActiveBusinessProfileImage));
    this.business$ = this.store.pipe(select(selectBusinessProfileWithCurrentAddresses));
    this.business$.subscribe(res => {this.business = res; console.log(res)});
  }

  ngOnInit(): void {
    this.isAdmin$ = this.store.pipe(select(selectHasAdministratorPermission));
    this.isAdmin$.subscribe(res => this.isAdmin = res);
    if (this.isAdmin) {
      this.store.dispatch(actionGetBusinessProfile({ businessName: this.business.name }));
    }
  }

  onSetAsDefaultClick(): void {
  
  }

  onProfileImgUploadComplete(info) {
    
    this.imgProgressSub$.next(0);
    
    this.store.dispatch(actionProcessBusinessProfileImageInfoFromUploadCare({
      imageType: "profileActive",
      uuid: info.uuid,
      name: info.name,
      size: info.size,
      mimeType: info.mimeType,
      originalUrl: info.originalUrl,
      cdnUrl: info.cdnUrl
    }));
    
    this.store.dispatch(actionChangeActiveBusinessProfilePicture({ uuid: info.uuid }));
    this.store.dispatch(actionCommitBusinessProfile());

  }

  onProfileImgProgress(progress) {
    this.imgProgressSub$.next(Number(progress.progress) * 100);
    if (Number(progress.progress) === 1) {
      this.imgProgressSub$.next(0);
    }
  }

  onEditClick(fieldName: string, fieldValue: string): void {
    //this.store.dispatch(actionUpdateBusinessProfile({images: this.business.images, about: }))
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
    
    const dialogRef = this.dialog.open(UpdateBusinessProfileComponent, dialogConfig);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result.isDirty) {
        this.isDirty = true;
        
      }
    });
  }

  onInsertAddressClick(addressType: string): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = '100vh';
    dialogConfig.width = "90%";
    dialogConfig.height = "90%";
    dialogConfig.maxWidth = 800;
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      addressType: addressType
    }
    const dialogRef = this.dialog.open(InsertBusinessProfileAddressComponent, dialogConfig);
    
      
  }

}
