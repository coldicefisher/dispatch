// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

// import { Observable } from 'rxjs';
// import { WebSocketSubject, webSocket } from 'rxjs/webSocket'; // new
// import { map, share, tap, catchError, retryWhen } from 'rxjs/operators'; // changed

import { Store, select } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { AppState } from '../core.module';
import { takeUntil } from 'rxjs/operators';
import { 
  actionGetProfileSuccess, 
  actionCommitProfileSuccess 
} from '../profile/actions';

import { actionSetAsDefaultBusinessSuccess } from '../business/actions';

// import { profileWorkHistory } from '../profile/state';
import { SocketService } from './socket.service';


@Injectable({
  providedIn: 'root'
})

export class ListenerProfileService implements OnInit {
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

    //this.socketService.connect();
    this.socketService.connect().pipe(
      takeUntil(this.destroyed$)
    ).subscribe(message => {
      if (message && message != null && message.key && message.payload && message.command) {

        if(message.key === "profile") {
          switch (message.command) {
            // UPDATE PROFILE /////////////////////////////////////////////////////
            case "update_profile":
            
              let payloadUpdateProfile = {
                firstName: message.payload.firstName,
                middleName: message.payload.middleName,
                lastName: message.payload.lastName,
                suffix: message.payload.suffix,
                profileId: message.payload.profileId,
                gender: message.payload.gender,
                addresses: message.payload.addresses,
                workHistories: message.payload.workHistories,
                images: message.payload.images,
                privacyStatus: message.payload.privacyStatus,
                seekingStatus: message.payload.seekingStatus,
                permissions: message.payload.permissions,
                businesses: message.payload.businesses,
                defaultBusiness: message.payload.defaultBusiness
              }
              this.store.dispatch(actionGetProfileSuccess(payloadUpdateProfile));
              break;
              
              // COMMIT PROFILE SUCCESS //////////////////////////////////////////
              case "commit_profile_success":
                this.store.dispatch(actionCommitProfileSuccess());
                break;

              case "default_business_set":
                console.log('set default');
                this.store.dispatch(actionSetAsDefaultBusinessSuccess({businessName: message.payload.businessName}));
                break;
          }
        }
      }
    })
    this.started$.next(true);
    return true;
  }  
}
