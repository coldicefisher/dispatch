// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

// import { Observable } from 'rxjs';
// import { WebSocketSubject, webSocket } from 'rxjs/webSocket'; // new
// import { map, share, tap, catchError, retryWhen } from 'rxjs/operators'; // changed

import { Store, select } from '@ngrx/store';
import { AppState } from '../core.module';
import { BehaviorSubject } from 'rxjs';

import { 
  actionCreateBusinessFailure,
  actionCreateBusinessSuccess,
  actionCheckBusinessNameUpdateResults,  
  actionUpdateBusinessData,
  actionUpdateBusinessUsers,
  actionUpdateBusinessProfile,
  actionRECEIVEDReplacedUserPermissionsSuccess,
  actionRECEIVEDAddedProfileToBusinessSuccess,
  actionRECEIVEDDeletedBusinessProfileSuccess,
  actionGetBusinessUsers,
 } from '../business/actions';

import { SocketService } from './socket.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class ListenerBusinessService implements OnInit {
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
        console.log(message);
        if (message.key === 'business'){
          console.log(message);
          switch (message.command) {
            // BUSINESS CREATE ///////////////////////////////////////////////////
            case "business_create":
              switch (message.payload.status){
                case "success":
                  this.store.dispatch(actionCreateBusinessSuccess({ name: message.payload.name, uid: message.payload.uid }));
                  break;
                case "failed":
                  this.store.dispatch(actionCreateBusinessFailure({ name: message.payload.name }))
                  break;
              }
              break;
            
            case "business_exists":
              switch (message.payload.status) {
                case "true":
                  this.store.dispatch(actionCheckBusinessNameUpdateResults({isValid: true}));
                  break;
                case "false":
                  this.store.dispatch(actionCheckBusinessNameUpdateResults({isValid: false}));
                  break;
              }
              break;
            
            case "update_business_users":
              this.store.dispatch(actionUpdateBusinessUsers({ users: message.payload.users }));
              break;
            
            case "update_business_data":
              this.store.dispatch(actionUpdateBusinessData({ uid: message.payload.uid, businessName: message.payload.businessName }));
              break;

            case "replaced_user_permissions_success":
              this.store.dispatch(actionRECEIVEDReplacedUserPermissionsSuccess({ profileId: message.payload.profileId, permissions: message.payload.permissions, business: message.payload.business }));
              break;
            
            case "added_profile_to_business_success":
              // this.store.dispatch(actionRECEIVEDAddedProfileToBusinessSuccess({ profileId: message.payload.profileId, permissions: message.payload.permissions, business: message.payload.business }))
              this.store.dispatch(actionGetBusinessUsers());
              this.store.dispatch(actionRECEIVEDAddedProfileToBusinessSuccess({ profileId: message.payload.profileId, business: message.payload.business, firstName: message.payload.firstName, middleName: message.payload.middleName, lastName: message.payload.lastName, suffix: message.payload.suffix }));
              break;

            case "deleted_business_profile_success":
              
              // this.store.dispatch(actionGetBusinessUsers());
              this.store.dispatch(actionRECEIVEDDeletedBusinessProfileSuccess({ profileId: message.payload.profileId, firstName: message.payload.firstName, middleName: message.payload.middleName, lastName: message.payload.lastName, suffix: message.payload.suffix, business: message.payload.business }));
              break;
            
            case "update_business_profile":
              this.store.dispatch(actionUpdateBusinessProfile({ images: message.payload.images, about: message.payload.about, addresses: message.payload.addresses, dotNumber: message.payload.dotNumber, mcNumber: message.payload.mcNumber }));
              break;

          // ALL CASES ABOVE THIS LINE
          } // END SWITCH STATEMENT
        } // END if message = 'business STATEMENT
      }
    })
    this.started$.next(true);
    return true;
  }  
}
