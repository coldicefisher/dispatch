import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, map, switchMap, switchMapTo, tap, withLatestFrom } from 'rxjs/operators';

import { 
  actionGetBusinessData, 
  actionGetBusinessUsers, 
  actionNavigateFromProfileToDashboard, 
  actionSetAsDefaultBusiness, 
  actionUpdateBusinessUsers, 
  actionGetBusinessProfile,
  BusinessActionTypes 
} from './actions';

import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { BusinessState } from './state';
import { AppState } from '../core.state';
import { NotificationService } from '../core.module';
import { select } from '@ngrx/store';
// import { AppErrorHandler } from '../error-handler/app-error-handler.service';

import { SocketService } from '../socket/socket.service';
import { actionGetProfile, actionUpdateProfilePermissions } from '../profile/actions';
import { actionConnectSocket, actionIsNotLoading } from '../site/site/actions';
import { 
    selectBusiness, 
    selectBusinessProfileById,
    selectCurrentBusinessView
} from './selectors';

import { 
    selectHasAdministratorPermission,
    selectProfile
} from '../profile/selectors';

@Injectable()
export class BusinessStoreEffects {
  authState$: Observable<any>;
  businessState$: Observable<any>;
  business: any;
  profileState$: Observable<any>;
  profileState: any;
  hasAdminPermissions$: Observable<any>;
  hasAdminPermissions: boolean | undefined;
  currentView$: Observable<any>;
  currentView: string | undefined;

  constructor(
    private actions$: Actions, 
    private router: Router,
    private store: Store<AppState>,
    private notificationService: NotificationService,
    private socketService: SocketService,

  ) { 
    this.businessState$ = this.store.pipe(select(selectBusiness));
    this.businessState$.subscribe(res => this.business = res);
    this.profileState$ = this.store.pipe(select(selectProfile));
    this.profileState$.subscribe(res => this.profileState = res);
    this.hasAdminPermissions$ = this.store.pipe(select(selectHasAdministratorPermission));
    this.hasAdminPermissions$.subscribe(res => {
      this.hasAdminPermissions = res
    });
    this.currentView$ = this.store.pipe(select(selectCurrentBusinessView));
    this.currentView$.subscribe(res => this.currentView = res);
    }

  navigateFromProfileToDashboardEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      BusinessActionTypes.NavigateFromProfileToDashboard
    ),
      tap((action: any) => {
        this.router.navigateByUrl('/dashboard');
    
        //return observableOf(actionGetBusinessUsers({name: action.name}))
      })
    ),
      { dispatch: false }
  );
      navigateDashboardEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
          BusinessActionTypes.NavigateDashboard
        ),
        tap((action: any) => {
          if (action.route === "dashboard-home" || action.route === "user-management") { this.store.dispatch(actionGetBusinessUsers())};
        })
      ),
      {dispatch: false}
      )
  navigateToCreateBusinessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      BusinessActionTypes.NavigateToCreateBusiness
    ),
      tap(action => {
        this.router.navigateByUrl('create-business');
      })
    ),
      {dispatch: false}
  );


  createBusinessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      BusinessActionTypes.CreateBusiness
    ),
      tap((action: any) => {
        // Check to make sure that all values have been passed
        if (action.name && action.profileId && action.legalStructure && action.industry && action.physicalAddress1 && action.mailingAddress1){
          this.socketService.send({
            'key': 'business', 
            'command': 'create_business', 
            'payload': {
                'name': action.name,
                'owner': action.profileId,
                'legalStructure': action.legalStructure,
                'mcNumber': action.mcNumber,
                'dotNumber': action.dotNumber,
                'industry': action.industry,
                'industryCategory': action.industryCategory,
                'physicalAddress1': action.physicalAddress1,
                'physicalAddress2': action.physicalAddress2,
                'physicalCity': action.physicalCity,
                'physicalState': action.physicalState,
                'physicalZip': action.physicalZip,
                'mailingAddress1': action.mailingAddress1,
                'mailingAddress2': action.mailingAddress2,
                'mailingCity': action.mailingCity,
                'mailingState': action.mailingState,
                'mailingZip': action.mailingZip
            }
          })
        }
      })
    ),
      { dispatch: false}
  );
  
  createBusinessSuccessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      BusinessActionTypes.CreateBusinessSuccess
    ),
    switchMap((action: any) => {
      this.notificationService.success(`Business (${action.name}) successfully created!`);
      this.store.dispatch(actionGetProfile());
      this.store.dispatch(actionSetAsDefaultBusiness({ businessName: action.name }));
      this.store.dispatch(actionIsNotLoading());
      return observableOf(actionNavigateFromProfileToDashboard({name: action.name, uid: action.uid}));
    })
  ));

  checkBusinessNameEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      BusinessActionTypes.CheckBusinessName
    ),
      tap((action: any) => {
        this.socketService.send({
        key: 'business',
        command: "check_business_name",
        payload: {"name": action.name}
        })
      })
    ),
      { dispatch: false }
  );


  getBusinessDataEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      BusinessActionTypes.GetBusinessData
      ),
      tap((action: any) => {
        // this.socketService.send({"command": 'get_business_users', 'payload': {'business_name': action.name}});
        // this.notificationService.success('getting your business shitface!');
        
        this.socketService.send({
          "key": "business",
          "command": 'get_business_data',
          "payload": {
              businessName: action.businessName
          }
        })
        // this.store.dispatch(actionSubscribeToBusiness());
        
      })
    ),
      { dispatch: false }
  );
  
  getBusinessProfileEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      BusinessActionTypes.GetBusinessProfile
    ),
    tap((action: any) => {
      this.socketService.send({
        key: 'business',
        command: 'get_business_profile',
        payload: {
          'businessName': this.business.name
        }
      })
    })
  ),
    { dispatch: false }
  )

  getBusinessUsersEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      BusinessActionTypes.GetBusinessUsers
    ),
    tap((action: any) => {

      let payload = {
      key: 'business',
      command: 'get_business_users', 
      payload: {
          'businessName': this.business.name
        }
      }

      this.socketService.send(payload);
    //this.notificationService.success('getting your data dickhead!');
    })
    ),
      { dispatch: false }
  );

  addProfileToBusinessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
    BusinessActionTypes.AddProfileToBusiness
    ),
    tap((action: any) => {

      let payload = {
      key: 'business',
      command: 'add_profile_to_business',
      payload: {
          'profileId': action.profileId,
          'permissions': action.permissions,
          'businessName': this.business.name,
          'email': action.email
        }
      }
    this.socketService.send(payload);
    })
    ),
      { dispatch: false }
  );

  createUnassociatedProfileEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      BusinessActionTypes.CreateUnassociatedProfile
    ),
    tap((action: any) => {
      let payload = {
        key: 'business',
        command: 'create_unassociated_profile',
        payload: {
          'firstName': action.firstName,
          'middleName': action.middleName,
          'lastName': action.lastName,
          'suffix': action.suffix,
          'permissions': action.permissions,
          'businessName': this.business.name,
          'email': action.email
        }
      }
    this.socketService.send(payload);
    })
    ),
    { dispatch: false }
  );

  setAsDefaultBusinessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      BusinessActionTypes.SetAsDefaultBusiness,
      
    ),
    tap((action: any) => {
      this.socketService.send({
        'key': 'profile', 
        'command': 'set_default_business', 
        'payload': {
          'businessName': action.businessName 
        } 
      });

    })
    ),
      { dispatch: false }
    );

  setAsDefaultBusinessSuccessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      BusinessActionTypes.SetAsDefaultBusinessSuccess
    ),
    tap((action: any) => {
      this.notificationService.success(`${action.businessName} is set as your default business`);
      //this.store.dispatch(actionSubscribeToBusiness());
    })
    ),
      { dispatch: false }
  );

  replaceUserPermissionsEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      BusinessActionTypes.ReplaceUserPermissions
    ),
    tap((action:any) => {
      let payload = {
      key: 'business',
      'command': 'replace_business_profile_permissions',
      'payload': {
          'profileId': action.profileId,
          'businessName': this.business.name,
          'permissions': action.permissions
        }
      }
    this.socketService.send(payload);
    })
    ),
      { dispatch: false }
  );

  deleteBusinessProfileEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      BusinessActionTypes.DeleteBusinessProfile
    ),
    tap((action: any) => {
      let payload = {
        key: 'business',
        'command': 'delete_business_profile',
        'payload': {
          'profileId': action.profileId,
          'business': action.businessName
        }
      }
      this.socketService.send(payload);
    })
    ),
      { dispatch: false }
  );

  RECEIVEDreplacedUserPermissionsSuccessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      BusinessActionTypes.RECEIVEDReplacedUserPermissionsSuccess
    ),
    tap((action: any) => {
    
    let profile$ = this.store.pipe(select(selectBusinessProfileById(action.profileId)));
      let profile;
      profile$.subscribe(res => profile = res);
    if (profile) { // There is a profile which means the user has the data loaded
        let fullName = profile.firstName;
        if (profile.middleName.length > 0){ fullName += ' ' + profile.middleName };
        fullName += ' ' + profile.lastName;
        if (profile.suffix.length > 0){ fullName += ' ' + profile.suffix };
        
        if (this.currentView == 'user-management') {
            this.notificationService.info(`Permissions for ${fullName} have been updated`);
        }
        
        // this.store.dispatch(actionUpdateBusinessUsers({users: action.users}))
    }
      // Update the users permissions
      if (action.profileId === this.profileState.profileId && action.business === this.business.name) {
        this.notificationService.warn('Your permissions have been changed...');
        this.store.dispatch(actionGetProfile());

      }
      this.store.dispatch(actionGetBusinessUsers());
    })
    ),
      { dispatch: false }
  );

      
  commitBusinessProfileEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
        BusinessActionTypes.CommitBusinessProfile
    ),
    tap((action: any) => {

      let payload = {
        'businessName': this.business.name,
        'images': this.business.businessProfile.images,
        'about': this.business.businessProfile.about,
        'addresses': this.business.businessProfile.addresses,
        'mcNumber': this.business.businessProfile.mcNumber,
        'dotNumber': this.business.businessProfile.dotNumber
      }
      
      this.socketService.send({ 
        key: 'business',
        'command': 'commit_business_profile', 'payload': payload }); 
    }),            
    ),
    { dispatch: false }
);


commitBusinessProfileSuccessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
  ofType(
      BusinessActionTypes.CommitBusinessProfileSuccess
  ),
  tap(action => {
      this.notificationService.success("Business Profile updated successfully")
      
  })
),
  { dispatch: false }
);
  // RECEIVED EFFECTS //////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  RECEIVEDAddedProfileToBusinessSuccessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
      ofType(
          BusinessActionTypes.RECEIVEDAddedProfileToBusinessSuccess
      ),
      tap((action: any) => {
        let fullName = action.firstName;
        if (action.middleName.length > 0){ fullName += ' ' + action.middleName };
        fullName += ' ' + action.lastName;
        if (action.suffix.length > 0)    { fullName += ' ' + action.suffix };
        
        if (this.currentView == 'user-management') {
              this.notificationService.info(`${fullName} has been added to ${this.business.name}`);
        }
        
        this.store.dispatch(actionGetBusinessUsers());
      })
      ),
      { dispatch: false }
  );
  
  RECEIVEDDeletedBusinessProfileSuccessEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      BusinessActionTypes.RECEIVEDdeletedBusinessProfileSuccess
    ),
    tap((action: any) => {
      let fullName = action.firstName;
      if (action.middleName.length > 0){ fullName += ' ' + action.middleName };
      fullName += ' ' + action.lastName;
      if (action.suffix.length > 0)    { fullName += ' ' + action.suffix };
      
      if (this.currentView == 'user-management') {
        this.notificationService.info(`${fullName} has been deleted from ${this.business.name}`)
      }
      this.store.dispatch(actionGetBusinessUsers());
    })
  ),
  { dispatch: false }
  )
} // END