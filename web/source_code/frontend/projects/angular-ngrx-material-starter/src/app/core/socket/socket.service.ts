import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';

import { Observable, of, Subject } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket'; // new
import { map, share, tap, catchError, retryWhen, throwIfEmpty, switchMap, takeUntil } from 'rxjs/operators'; // changed
import { Store, select } from '@ngrx/store';

import { AppState } from '../../core/core.module';

import { actionSaveUsersData } from '../data/actions';

import { BehaviorSubject } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { actionIsLoading, actionIsNotLoading } from '../site/site/actions';
import { NotificationService } from '../notifications/notification.service';

import { pairwise } from 'rxjs/operators';
import { interval } from 'rxjs';
import { actionGetProfile } from '../profile/actions';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnInit, OnDestroy {
    RETRY_SECONDS = 5000;
    BASE_URL = 'https://bizniz.io/profile/';
    //BASE_URL = 'http://localhost:8002/profile/';
    connection$: WebSocketSubject<any>; // n
    messages: Observable<any>; // new
    isAuth$: Observable<any>;
    destroyed$ = new Subject();
    public isConnected$: BehaviorSubject<boolean>;
    connectionStatus$: BehaviorSubject<string>;
    constructor(
      private http: HttpClient,
      private store: Store<AppState>,
      private notificationService: NotificationService,  

    ) {
      this.isConnected$ = new BehaviorSubject<boolean>(true);
      this.connectionStatus$ = new BehaviorSubject<string>('connected');
    
    // SUBSCRIBE TO THE CONNECTION AND CHECK FOR PINGS. UPDATE STATUS TO CONNECTED WHEN PING IS RECIEVED
    this.connect().pipe(
      takeUntil(this.destroyed$))
      .subscribe(message => {
        if (message && message.command != null) {
            if (message.command === 'ping') {
            this.isConnected$.next(true);
            this.connectionStatus$.next('connected');
            }
        }
      }
    );
    // GET THE CONNECTION STATUS AND SET THE LOADING SCREEN IF IT IS NOT CONNECTED
    this.connectionStatus$.pipe(pairwise()).subscribe(([previous, current]) => {
      if (current != previous){
        
        switch (current) {
          
          case "notInitialized":
            // this.store.dispatch(actionIsLoading());
            
            interval(5000).pipe(takeUntil(this.isConnected$)).subscribe(res => {
              this.send({'command': 'ping'});
            })
            break;
          
          case "disconnected":
            this.notificationService.error('Trying to connect...');
            // this.store.dispatch(actionIsLoading());
            
            interval(5000).pipe(takeUntil(this.isConnected$)).subscribe(res => {
              this.send({'command': 'ping'});
            })
            break;

          case "connected":
            this.notificationService.success('Connected');
            this.isConnected$.next(true);
            this.store.dispatch(actionIsNotLoading());
            this.store.dispatch(actionGetProfile());
            
            break;
        }
      }
    });  
  }

  ngOnInit(): void {
      
  }
  ngOnDestroy(): void {
    this.disconnect();
  }

    connect(): Observable<any> {
      return of(this.BASE_URL).pipe(
        filter(apiUrl => !!apiUrl),
        // https becomes wws, http becomes ws
        map(apiUrl => apiUrl.replace(/^http/, 'ws')),
        switchMap(wsUrl => {
          if (this.connection$) {
            return this.connection$;
          } else {
              this.connection$ = webSocket(wsUrl);
              return this.connection$;
            }
        }),
        retryWhen((errors) => errors.pipe(
          delay(this.RETRY_SECONDS),
          tap(() => {
            this.connectionStatus$.next('disconnected');
            this.isConnected$.next(false);
            this.send({'command': 'ping'});
        
          }),
        )
          
        )
      );
    }  
  
    disconnect(): void {
      this.connection$.complete();
      this.connection$ = null;
      this.isConnected$.complete();
      this.isConnected$ = null;
      this.connectionStatus$.complete();
      this.connectionStatus$ = null;    
    }

    send(json): void {
      if (this.connection$) {
        this.connection$.next(json);
      }
    };
  
    
}
  
  