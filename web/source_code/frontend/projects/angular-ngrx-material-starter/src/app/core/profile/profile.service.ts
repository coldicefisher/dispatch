import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';


import { Observable } from 'rxjs';

import { DeviceDetectorService } from "ngx-device-detector";
import { Store, select } from '@ngrx/store';
// import { State } from '../auth/state';
// import { selectAuth } from '../auth/auth/selectors';
import { AppState } from '../core.module';
// import { selectAuth, selectUsername } from '../core.module';




@Injectable({providedIn: 'root' })
export class ProfileService implements OnInit {
  username$: Observable<string>;

  constructor(
      private http: HttpClient,
      private deviceService: DeviceDetectorService,
      private store: Store<AppState>,
      
      
    ) {
      
    }
    getState: Observable<any>;
    private BASE_URL = 'http://localhost/api/login/';
    private deviceInfo;
    // username: string;
    // loginStatus: string;
    // authState$: Observable<any>;      

  ngOnInit() {
    // this.authState$ = this.store.pipe(select(selectAuth));
    // this.authState$.subscribe((state) => {
    //   this.username = state.username;
    //   this.loginStatus = state.loginStatus;
          
      
    // });
  }

  getDeviceId() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    return '{device_type: ' + this.deviceInfo.deviceType + ', user_agent: ' + this.deviceInfo.userAgent + ', os: ' + this.deviceInfo.os + 
    ', os_version: ' + this.deviceInfo.os_version + ', browser_version: ' + this.deviceInfo.browser_version + ', is_desktop: ' + this.deviceService.isDesktop() + 
    ', is_tablet: ' + this.deviceService.isTablet() + ', is_mobile: ' + this.deviceService.isMobile() + '}';
  }

  getStatus(): Observable<any> {
    
    const url = `${this.BASE_URL}/status`;
    return this.http.get<any>(url);
  }

  // getToken(): string {
  //   return localStorage.getItem('token');
  // }

}
