import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/core.module';

import { Observable, BehaviorSubject } from 'rxjs';
import { select } from '@ngrx/store';

import { 
  selectProfile, 
  selectActiveProfileImage 
} from '../../../core/profile/selectors';
import { selectBusiness } from '../../../core/business/selectors';

import { 
  selectHasEmployeePermission,
  selectHasDriverPermission,
  selectHasDispatchingPermission,
  selectHasAssetsPermission,
  selectHasHumanResourcesPermission,
  selectHasAdministratorPermission,

} from '../../../core/profile/selectors';

import { actionChangeActiveProfilePicture } from '../../../core/images/actions';
import { actionCommitProfile } from '../../../core/profile/actions';
import { actionNavigateToProfilePage } from '../../../core/profile/actions';
import { actionNavigateDashboard } from '../../../core/business/actions';

import { Router } from '@angular/router';

@Component({
  selector: 'Feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedComponent implements OnInit {
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
    
    this.navigation = [
      { link: '/dashboard', label: this.business.name },
    ]
  }

  ngOnInit(): void {
    
  }
  

  
  
}
