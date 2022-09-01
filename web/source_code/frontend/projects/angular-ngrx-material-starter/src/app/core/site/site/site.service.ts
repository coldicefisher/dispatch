import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';


import { Observable } from 'rxjs';

import { DeviceDetectorService } from "ngx-device-detector";
import { Store, select } from '@ngrx/store';
import { SiteState } from './state';
import { selectSite } from './selectors';
import { AppState } from '../../core.module';
import { appendFile } from 'fs';

import { AppComponent } from '../../../app/app.component'


@Injectable({providedIn: 'root' })
export class SiteService implements OnInit {
  getState: Observable<any>;
  private BASE_URL = 'http://localhost/api';
  
  
  constructor(
      private http: HttpClient,
      private deviceService: DeviceDetectorService,
      private store: Store<AppState>,

    ) {
      //this.getState = this.store.pipe(select(selectAuth));
    }
    

  ngOnInit() {
    this.getState.subscribe((state) => {

    });
  }

  
  
}
