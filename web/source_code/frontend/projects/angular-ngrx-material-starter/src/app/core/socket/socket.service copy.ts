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



@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnInit, OnDestroy {
    RETRY_SECONDS = 10;
    //webSocket: WebSocketSubject<any>; // new
    connection$: WebSocketSubject<any>; // n
    messages: Observable<any>; // new
    isAuth$: Observable<any>;
    destroyed$ = new Subject();
    isConnected: BehaviorSubject<boolean>;
    connectionStatus: BehaviorSubject<string>;
    constructor(
      private http: HttpClient,
      private store: Store<AppState>,
      private notificationService: NotificationService,  
        
    ) {
      this.isConnected = new BehaviorSubject<boolean>(false);
      this.connectionStatus = new BehaviorSubject<string>('notInitialized');
      
      this.messages = this.connect().pipe(share());  

      this.connectionStatus.subscribe(res => {
        this.messages
          .subscribe(message => {
            if (message.command === 'ping') {
              console.log('received ping');
              this.isConnected.next(true);
              this.connectionStatus.next('connected');
            }
          }
        );
        switch (res) {
          case "notInitialized":
            this.store.dispatch(actionIsLoading());
            break;
          
          case "disconnected":
            this.notificationService.error('Trying to connect...')
            this.store.dispatch(actionIsLoading());
            break;

          case "connected":
            this.notificationService.success('Connected');
            this.store.dispatch(actionIsNotLoading());
            break;
        }
      })
      
    // this.messages.pipe(
    //   takeUntil(this.destroyed$))
    //   .subscribe(message => {
    //     if (message.command === 'ping') {
    //       console.log('received ping');
    //       this.isConnected.next(true);
    //       this.connectionStatus.next('connected');
    //     }
    //   }
    // );
    
    }
      ngOnInit(): void {
          
      }
      ngOnDestroy(): void {
        this.disconnect();
      }
      setLoading() {
        
      }
      
      connect(): Observable<any> {
        return of('http://localhost:8002/profile/').pipe(
          filter(apiUrl => !!apiUrl),
          // https becomes wws, http becomes ws
          map(apiUrl => apiUrl.replace(/^http/, 'ws')),
          switchMap(wsUrl => {
            if (this.connection$) {
              
              return this.connection$;
            } else {
                this.connection$ = webSocket(wsUrl);
                this.send({'command': 'ping'});
                return this.connection$;
              }
              
              //this.notificationService.success('Connected!');
            
          }),
          retryWhen((errors) => errors.pipe(
            delay(this.RETRY_SECONDS),
            tap(() => {
              this.connectionStatus.next('disconnected');
              this.isConnected.next(false);
              this.send({'command': 'ping'});
            
            }),
          )
            
          )
        );
      }  
    // connect(): void {
    //   if (!this.webSocket || this.webSocket.closed) {
    //     this.webSocket = webSocket({ url: `ws://localhost:8002/profile/`, });
    //     this.connectionStatus1.next('connected');
    //     if (!this.webSocket.closed) {
    //       this.isConnected.next(true);
    //     }
    //     else {
    //       this.isConnected.next(false);
    //     }
        

    //     this.messages = this.webSocket.pipe(share());
    //     this.messages.subscribe(message => {
    //         switch (message.command) {

    //           // GET USERS FOR AUTOCOMPLETE ///////////////////////////////////////
    //           case "save_search_index_data":
    //             console.log('saved users information');
    //             this.store.dispatch(actionSaveUsersData({usersByName: message.payload}));
    //             break;
              
    //           // END DOCUMENT SIGNED ///////////////////////////////////////////////
              
    //       }
    //       // END PROCESS INCOMING COMMANDS /////////////////////////////////////////////////////////////////////////// 
    //     },
    //     error => {
    //       console.log(`Error: ${error}`);
    //       console.error('/////////////////////////////////////////////////');
    //       console.log(error);
    //       console.error('/////////////////////////////////////////////////');
    //       // Try to reconnect
    //       this.connectionStatus1.next('disconnectedError');
    //       this.isConnected.next(false);
    //     },
    //     () => {
    //       console.log('Closed');
    //       this.connectionStatus1.next('disconnected');
    //       this.isConnected.next(false);
    //     }
    //     );
        
    //   //   this.webSocket
    //   //     .pipe(
    //   //       tap((data) => console.log(data)),
    //   //     )
    //   //     .subscribe();
    //   }
    // };

    disconnect(): void {
      //this.webSocket.complete();
      this.connection$.complete();
      this.connection$ = null;
    }

    send(json): void {
      //this.webSocket.next(json)
      if (this.connection$) {
        this.connection$.next(json);
      }
    };

    // isAlive(): boolean {

      // if (!this.webSocket || this.webSocket.closed) {
      //   return false;
      // }
      // return true;
    // }
    
}
  
  