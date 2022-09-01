// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

// import { Observable } from 'rxjs';
// import { WebSocketSubject, webSocket } from 'rxjs/webSocket'; // new
// import { map, share, tap, catchError, retryWhen } from 'rxjs/operators'; // changed

import { Store, select } from '@ngrx/store';
import { AppState } from '../core.module';

import { actionUpdateSearchProfilesByNameResults, actionCheckEmailUpdateResults } from '../forms/actions';

import { SocketService } from './socket.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class ListenerSearchService implements OnInit {
  destroyed$ = new Subject();
  started$: BehaviorSubject<boolean>;    

  constructor(
    private socketService: SocketService,
    private store: Store<AppState>,
  )
  {
    this.started$  = new BehaviorSubject<boolean>(false);
  }
  ngOnInit(): void {
    
  }
  
  start(): boolean {
    if (this.started$.value) { return false; }

    this.socketService.connect().pipe(
      takeUntil(this.destroyed$)
    ).subscribe(message => {
      if (message && message != null && message.key && message.payload && message.command) {

        if (message.key === "search")  {
          switch (message.command) {
            // System messages //////////////////////////////////////////////////////////////////////////////////////
            case "profiles":
              // Logout on unauthorized  
              this.store.dispatch(actionUpdateSearchProfilesByNameResults({ searchResults: message.payload }));
              break;
            case "email_exists":
              switch (message.payload.status) {
                case "true":
                  this.store.dispatch(actionCheckEmailUpdateResults({isValid: true}));
                  break;
                case "false":
                  this.store.dispatch(actionCheckEmailUpdateResults({isValid: false}));
                  break;
              }
              break;
          };
        }
      }
    })
    this.started$.next(true);
    return true;
  }
}