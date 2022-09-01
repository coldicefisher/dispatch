import { 
  Component, 
  OnInit, 
  ChangeDetectionStrategy, 
  HostListener,
  OnDestroy, 
} from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { 
  selectBusiness,
  selectCurrentBusinessView
} from '../../../core/business/selectors';
import { BusinessState } from '../../../core/business/state';

import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { AppState, NotificationService, selectUsername } from '../../../core/core.module';

import { SocketService } from '../../../core/socket/socket.service';
import { ApplicationDataService } from '../../../core/data/application-data.service';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { actionNavigateDashboard } from '../../../core/business/actions';

import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';

import { 
  selectHasAdministratorPermission,
  selectHasHumanResourcesPermission,
  selectHasDispatchingPermission,
  selectHasAssetsPermission,
  selectHasDriverPermission,
  selectHasEmployeePermission
} from '../../../core/profile/selectors';

// import { 
//   actionGetBusinessData, 
//   actionGetBusinessUsers 
// } from '../../../core/business/actions';

import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'bizniz-business-dashboard',
  templateUrl: './business-dashboard.component.html',
  styleUrls: ['./business-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})



export class BusinessDashboardComponent implements OnInit, OnDestroy {
  // Hande the menu
  screenWidth: number;
  menuMode: any;
  toggleOpen: boolean;
  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);
  // Handle the state
  public business$: Observable<any>;
  public currentView$: Observable<any>;
  public hasAdminPermission$: Observable<boolean>;
  public hasHumanResourcesPermission$: Observable<boolean>;
  public hasAssetsPermission$: Observable<boolean>;
  public hasDispatchingPermission$: Observable<boolean>;
  public hasDriverPermission$: Observable<boolean>;
  public hasEmployeePermission$: Observable<boolean>;
  public isLoaded: boolean = false;
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  destroyed$ = new Subject();

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth$.next(event.target.innerWidth);
  }
  
  navigation = [
    { link: 'dashboard-home', label: 'custom.dashboard.menu.dashboard-home' },
    { link: 'human-resources', label: 'custom.dashboard.menu.human-resources' },
    { link: 'dispatching', label: 'custom.dashboard.menu.dispatching' },
    { link: 'assets', label: 'custom.dashboard.menu.assets' },
    { link: 'user-management', label: 'custom.dashboard.menu.user-management' },
    
    
    
  ];

  constructor(
    private socketService: SocketService,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private applicationDataService: ApplicationDataService,
    private notificationService: NotificationService,
  ) { }
  ngOnDestroy(): void {
    
  }
  ngOnInit(): void {
    this.screenWidth$.subscribe(width => {
      this.screenWidth = width;
      if (width > 1200) {
        
        this.menuMode = "push";    
      }
    });
    this.menuMode = "push";

    this.business$ = this.store.pipe(select(selectBusiness));
    this.currentView$ = this.store.pipe(select(selectCurrentBusinessView));
    this.hasAdminPermission$ = this.store.pipe(select(selectHasAdministratorPermission));
    this.hasAssetsPermission$ = this.store.pipe(select(selectHasAssetsPermission));
    this.hasDispatchingPermission$ = this.store.pipe(select(selectHasDispatchingPermission));
    this.hasHumanResourcesPermission$ = this.store.pipe(select(selectHasHumanResourcesPermission));
    this.hasDriverPermission$ = this.store.pipe(select(selectHasDriverPermission));
    this.hasEmployeePermission$ = this.store.pipe(select(selectHasEmployeePermission));
    
    // this.business$.subscribe(res => {
    //   if 
    // })
  }

  onNavigate(route: string) {
    this.store.dispatch(actionNavigateDashboard({ route: route }));
  }

  setActive(route: string): string {
    let setActive: boolean = false;
    this.currentView$.subscribe(res => {
      if (route === res){ setActive = true }
    })
    if (setActive) { return 'dashboard-active'}
    return '';
  }
}
