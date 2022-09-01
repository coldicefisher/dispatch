// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

// import { Observable } from 'rxjs';
// import { WebSocketSubject, webSocket } from 'rxjs/webSocket'; // new
// import { map, share, tap, catchError, retryWhen } from 'rxjs/operators'; // changed

import { Store, select } from '@ngrx/store';
import { AppState } from '../core.module';
import { BehaviorSubject } from 'rxjs';

import { actionUpdateBusinesses } from '../home/actions';

import { FeedSocketService } from './socket-feed.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class ListenerPublicBusinessService implements OnInit {
  destroyed$ = new Subject();
  started$: BehaviorSubject<boolean>;
  
  constructor(
    private socketService: FeedSocketService,
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
      
      if (message && message != null && message.payload && message.command) {
        
        switch (message.command) {
          // BUSINESS CREATE ///////////////////////////////////////////////////
          case "update_all_businesses":
            this.store.dispatch(actionUpdateBusinesses({ businesses: message.payload.businesses }));
            break;
                    // ALL CASES ABOVE THIS LINE
        } // END SWITCH STATEMENT
      } // END if message = 'business STATEMENT
    })
    this.started$.next(true);
    return true;
  }  
}
