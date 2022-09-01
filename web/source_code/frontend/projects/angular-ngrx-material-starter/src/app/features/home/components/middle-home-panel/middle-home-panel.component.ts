import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { AppState } from '../../../../core/core.state';
import { Store } from '@ngrx/store';
import { select } from '@ngrx/store';

import { selectBusiness } from '../../../../core/business/selectors';

import { 
  selectHasEmployeePermission,
  selectHasDriverPermission,
  selectHasDispatchingPermission,
  selectHasAssetsPermission,
  selectHasHumanResourcesPermission,
  selectHasAdministratorPermission,

} from '../../../../core/profile/selectors';

import { actionNavigateDashboard } from '../../../../core/business/actions';

import { selectCurrentHomeView } from '../../../../core/home/selectors';
import { actionNavigateHomeView } from '../../../../core/home/actions';

import { selectProfile } from '../../../../core/profile/selectors';

@Component({
  selector: 'MiddleHomePanel',
  templateUrl: './middle-home-panel.component.html',
  styleUrls: ['./middle-home-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiddleHomePanelComponent implements OnInit {
  public business$: Observable<any>;
  private business: any;

  public isEmployee$: Observable<boolean>;
  public isDriver$: Observable<boolean>;
  public isHumanResources$: Observable<boolean>;
  public isDispatching$: Observable<boolean>;
  public isAssets$: Observable<boolean>;
  public isAdministrator$: Observable<boolean>;
  public homeView$: Observable<string>;

  public profile$: Observable<any>;

  constructor(
    private router: Router,
    private store: Store<AppState>,
  ) {

    this.business$ = this.store.pipe(select(selectBusiness));
    this.business$.subscribe(res => this.business = res);
    
    this.isEmployee$ = this.store.pipe(select(selectHasEmployeePermission));
    this.isDriver$ = this.store.pipe(select(selectHasDriverPermission));
    this.isHumanResources$ = this.store.pipe(select(selectHasHumanResourcesPermission));
    this.isDispatching$ = this.store.pipe(select(selectHasDispatchingPermission));
    this.isAssets$ = this.store.pipe(select(selectHasAssetsPermission));
    this.isAdministrator$ = this.store.pipe(select(selectHasAdministratorPermission));
    this.homeView$ = this.store.pipe(select(selectCurrentHomeView));
    this.profile$ = this.store.pipe(select(selectProfile));
  }

  ngOnInit(): void {
    
    this.store.dispatch(actionNavigateHomeView({route: 'my-feed'}));
  }

  onDashboardNavigateClick(route: string): void {
    this.router.navigateByUrl('/dashboard');
    this.store.dispatch(actionNavigateDashboard({route: route}));
  }
}
