import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/core.module';

import { Observable, BehaviorSubject } from 'rxjs';
import { select } from '@ngrx/store';

import { 
  selectProfile, 
  selectActiveProfileImage 
} from '../../../../core/profile/selectors';
import { selectBusiness } from '../../../../core/business/selectors';

import { 
  selectHasEmployeePermission,
  selectHasDriverPermission,
  selectHasDispatchingPermission,
  selectHasAssetsPermission,
  selectHasHumanResourcesPermission,
  selectHasAdministratorPermission,

} from '../../../../core/profile/selectors';


import { actionProcessProfileImageInfoFromUploadCare } from '../../../../core/images/actions';
import { actionChangeActiveProfilePicture } from '../../../../core/images/actions';
import { actionCommitProfile } from '../../../../core/profile/actions';
import { actionNavigateToProfilePage } from '../../../../core/profile/actions';
import { actionNavigateDashboard } from '../../../../core/business/actions';
import { actionNavigateHomeView } from '../../../../core/home/actions';

import { Router } from '@angular/router';
import { selectCurrentHomeView } from '../../../../core/home/selectors';

@Component({
  selector: 'LeftHomePanel',
  templateUrl: './left-home-panel.component.html',
  styleUrls: ['./left-home-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeftHomePanelComponent implements OnInit {
  public profile$: Observable<any>;
  private profile;

  public business$: Observable<any>;
  private business: any;

  public imgProgressSub$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  imgProgress$: Observable<number>;
  activeProfileImage$: Observable<any>;

  public isEmployee$: Observable<boolean>;
  public isDriver$: Observable<boolean>;
  public isHumanResources$: Observable<boolean>;
  public isDispatching$: Observable<boolean>;
  public isAssets$: Observable<boolean>;
  public isAdministrator$: Observable<boolean>;
  
  public navigation: any;
  private currentHomeView$: Observable<string>;

  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {
    this.profile$ = this.store.pipe(select(selectProfile));
    this.profile$.subscribe(res => this.profile = res);
    this.activeProfileImage$ = this.store.pipe(select(selectActiveProfileImage));
    
    this.business$ = this.store.pipe(select(selectBusiness));
    this.business$.subscribe(res => this.business = res);
    
    this.isEmployee$ = this.store.pipe(select(selectHasEmployeePermission));
    this.isDriver$ = this.store.pipe(select(selectHasDriverPermission));
    this.isHumanResources$ = this.store.pipe(select(selectHasHumanResourcesPermission));
    this.isDispatching$ = this.store.pipe(select(selectHasDispatchingPermission));
    this.isAssets$ = this.store.pipe(select(selectHasAssetsPermission));
    this.isAdministrator$ = this.store.pipe(select(selectHasAdministratorPermission));
    
    this.currentHomeView$ = this.store.pipe(select(selectCurrentHomeView));
    this.navigation = [
      { link: '/dashboard', label: this.business.name },
    ]
  }

  ngOnInit(): void {
    
  }
  onProfileImgProgress(progress) {
    this.imgProgressSub$.next(Number(progress.progress) * 100);
    if (Number(progress.progress) === 1) {
      this.imgProgressSub$.next(0);
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
    //this.isDirty = true;
    
    let payload = {
      firstName: this.profile.firstName,
      middleName: this.profile.middleName,
      lastName: this.profile.lastName,
      suffix: this.profile.suffix,
      gender: this.profile.gender,
      addresses: this.profile.addresses,
      workHistories: this.profile.workHistories,
      images: this.profile.images,
      privacyStatus: this.profile.privacyStatus,
      seekingStatus: this.profile.seekingStatus
    }

    this.store.dispatch(actionCommitProfile(payload));

  }

  onProfileNavigateClick(): void {
    this.store.dispatch(actionNavigateToProfilePage());
  }

  onDashboardNavigateClick(route: string): void {
    this.router.navigateByUrl('/dashboard');
    this.store.dispatch(actionNavigateDashboard({route: route}));
  }
  onHomeViewNavigateClick(route: string): void {
    this.store.dispatch(actionNavigateHomeView({ route: route }))
  }


  setActive(route: string): string {
    let setActive: boolean = false;
    this.currentHomeView$.subscribe(res => {
      if (route === res){ setActive = true }
    })
    if (setActive) { return 'dashboard-active'}
    return '';
  }
}
