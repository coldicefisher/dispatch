// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

// import { Observable } from 'rxjs';
// import { WebSocketSubject, webSocket } from 'rxjs/webSocket'; // new
// import { map, share, tap, catchError, retryWhen } from 'rxjs/operators'; // changed

import { Store, select } from '@ngrx/store';
import { AppState } from '../core.module';

import { actionLogOut } from '../auth/auth/actions';

import { SocketService } from './socket.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BehaviorSubject } from 'rxjs';
import { actionAppFailure } from '../site/site/actions';

@Injectable({
  providedIn: 'root'
})


export class ListenerSystemService implements OnInit {
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
        if (message.key === "system")  {
          

          switch (message.command) {
            
            // System messages //////////////////////////////////////////////////////////////////////////////////////
            case "unauthorized":
              // Logout on unauthorized  
              this.store.dispatch(actionLogOut({ logoutType: 3 }));
              break;

            case "application_failed":
                this.store.dispatch(actionAppFailure({ errorCode: 500 }))
              
          };
        }
      }
    })
    this.started$.next(true);
    return true;
  }
}