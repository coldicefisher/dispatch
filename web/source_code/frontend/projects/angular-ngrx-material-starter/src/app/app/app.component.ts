import browser from 'browser-detect';
import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';


import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { environment as env } from '../../environments/environment';
import { actionBeginLogin, actionBeginSignUp, actionLogOut } from '../core/auth/auth/actions';
import { actionNavigateToProfilePage } from '../core/profile/actions';
import { SocketService } from '../core/socket/socket.service';

import { actionConnectSocket } from '../core/site/site/actions';
import { ChangeDetectorRef } from '@angular/core';
import { actionGetProfile } from '../core/profile/actions';
import { actionGetBusinessUsers, actionGetBusinessData } from '../core/business/actions';
import { selectBusiness } from '../core/business/selectors';
import { pairwise } from 'rxjs/operators';

// import { PersistGate } from 'redux-persist/integration/react';
// import { persistStore } from 'redux-persist';

import {
  routeAnimations,
  LocalStorageService,
  selectAuthIsAuthenticated,
  selectAuth,
  selectUsername,
  selectSettingsStickyHeader,
  selectSettingsLanguage,
  selectEffectiveTheme,
  AppState,
  selectIsLoading,

} from '../core/core.module';
import {
  actionSettingsChangeAnimationsPageDisabled,
  actionSettingsChangeLanguage,
} from '../core/settings/settings.actions';

import { Router, Event, NavigationStart } from '@angular/router';
import { NotificationService } from '../core/core.module';

import { actionIsLoading, actionIsNotLoading } from '../core/site/site/actions';
import { delay } from 'rxjs/operators';

import { selectProfile } from '../core/profile/selectors';


@Component({
  selector: 'bizniz-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations]
})
export class AppComponent implements OnInit {
  isProd = env.production;
  envName = env.envName;
  version = env.versions.app;
  year = new Date().getFullYear();
  logo = 'assets/logo.png';
  //languages = ['en', 'de', 'sk', 'fr', 'es', 'pt-br', 'zh-cn', 'he', 'ar'];
  languages = ['en',];
  business$: Observable<any> | undefined;
  businessName: string;
  navigation: any;
  navigationSideMenu: any;
  navigationFooter: any;
  navigationTop: any;
  messages: Subscription;

  isAuthenticated$: Observable<boolean> | undefined;
  stickyHeader$: Observable<boolean> | undefined;
  language$: Observable<string> | undefined;
  theme$: Observable<string> | undefined;
  isLoading$: Observable<boolean> | undefined;
  
  profile$: Observable<any> | undefined;

  color = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  displayProgressSpinner = false;
  spinnerWithoutBackdrop = false;

  username$: Observable<string>;
  authState$: Observable<any>;
  authenticated: boolean;
  profile: any;
  constructor(
    private store: Store<AppState>,
    private storageService: LocalStorageService,
    private socketService: SocketService,
    private router: Router,
    private notificationService: NotificationService,
    private changeDetectorRef: ChangeDetectorRef,

  ) {
    this.isAuthenticated$ = this.store.pipe(select(selectAuthIsAuthenticated));
    this.isAuthenticated$.subscribe(res => this.authenticated = res);
    this.stickyHeader$ = this.store.pipe(select(selectSettingsStickyHeader));
    this.language$ = this.store.pipe(select(selectSettingsLanguage));
    this.theme$ = this.store.pipe(select(selectEffectiveTheme));
    this.isLoading$ = this.store.pipe(select(selectIsLoading));

    this.authState$ = this.store.pipe(select(selectAuth));
    this.username$ = this.store.pipe(select(selectUsername));
    this.profile$ = this.store.pipe(select(selectProfile));
    this.profile$.subscribe(res => this.profile = res);
    this.business$ = this.store.pipe(select(selectBusiness))
    this.business$.subscribe(res => this.businessName = res.name)
    
    this.navigation = [
      { link: 'about', label: 'bizniz.menu.about' },
      //{ link: 'dashboard', label: this.businessName }
    ];
    
    this.navigationTop = [
      { link: 'home', label: 'Home'},
      { link: 'dashboard', label: this.businessName }
    ]

    this.navigationSideMenu = [
      ...this.navigation,
      { link: 'settings', label: 'bizniz.menu.settings' },
      
    ];

    this.navigationFooter = [
      { link: 'privacy', label: 'Pivacy Policy' },
      { link: 'terms', label: 'Terms and Conditions' },
    ]
  
  }

  private static isIEorEdgeOrSafari() {
    return ['ie', 'edge', 'safari'].includes(browser().name || '');
  }

  ngOnInit(): void {
    this.store.dispatch(actionConnectSocket());
    this.storageService.testLocalStorage();
    if (AppComponent.isIEorEdgeOrSafari()) {
      this.store.dispatch(
        actionSettingsChangeAnimationsPageDisabled({
          pageAnimationsDisabled: true
        })
      );
    }
    
    // Get the profile if it is not loaded
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart){
        // Connect socket
        this.store.dispatch(actionConnectSocket()); 
        if (!this.socketService.isConnected$.value) { 
          this.store.dispatch(actionConnectSocket()); 
          this.store.dispatch(actionGetProfile())
        }
        if (this.authenticated) { 
          if (this.profile.profileId === undefined || !this.profile || !this.profile.profileId || this.profile.profileId === '' || this.profile.profileId === null) {
            this.store.dispatch(actionGetProfile());

          }
        }
        
      }
    });

  }

  onLoginClick() {
    this.store.dispatch(actionBeginLogin());
    
  }

  onLogoutClick() {
    this.store.dispatch(actionLogOut({ logoutType: 1 }));
    
  }
  onProfileClick() {
    
    this.store.dispatch(actionNavigateToProfilePage());
  }
  
  onRegisterClick() {
    this.store.dispatch(actionBeginSignUp());
  }

  onLanguageSelect(event: MatSelectChange) {
    this.store.dispatch(
      actionSettingsChangeLanguage({ language: event.value })
    );
  }
  
  
  showProgressSpinner = () => {
    this.displayProgressSpinner = true;
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.displayProgressSpinner = false;
      this.changeDetectorRef.detectChanges();
    }, 120);
    
  };
  
  hideProgressSpinner = () => {
    this.displayProgressSpinner = false;
    this.changeDetectorRef.detectChanges();
  }
  

}
