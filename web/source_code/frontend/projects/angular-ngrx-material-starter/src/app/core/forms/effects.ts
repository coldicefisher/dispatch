import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, map, switchMap, switchMapTo, tap, withLatestFrom } from 'rxjs/operators';
import { select } from '@ngrx/store';
// import { Router } from '@angular/router';

import { actionCommitCreateApplicationForm, FormsActionTypes } from './actions';
import { AppState } from '../core.state';

import { Store } from '@ngrx/store';
import { FormsState } from './state';

import { NotificationService } from '../core.module';
import { SocketService } from '../socket/socket.service';
import { DocumentsService } from './documents.service';

import { selectCreateApplication } from './selectors';

import { ApplicationTemplate } from './state';
import { ProfileState } from '../profile/state';
import { selectProfile } from '../profile/selectors';
import { BusinessState } from '../business/state';
import { selectBusiness } from '../business/selectors';

@Injectable()
export class FormsStoreEffects {
    authState$: Observable<any>;
    formsState$: Observable<any>;
    createApplication$: Observable<ApplicationTemplate>;
    createApplication: ApplicationTemplate;
    
    profile$: Observable<ProfileState>;
    profile: ProfileState;

    business$: Observable<BusinessState>;
    business: BusinessState;

    constructor(
        private actions$: Actions, 
        // private router: Router,
        private store: Store<AppState>,

        private notificationService: NotificationService,
        private socketService: SocketService,
        private documentService: DocumentsService,
    ) {
      this.createApplication$ = this.store.pipe(select(selectCreateApplication));
      this.createApplication$.subscribe(res => this.createApplication = res);

      this.profile$ = this.store.pipe(select(selectProfile));
      this.profile$.subscribe(res => this.profile = res);

      this.business$ = this.store.pipe(select(selectBusiness));
      this.business$.subscribe(res => this.business = res);

    }


    signDocument: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
          FormsActionTypes.SignDocument,
          FormsActionTypes.SignBusinessSignupDisclaimer
        ),
        tap((action: any) => {
          let displayName = this.documentService.getClientFriendlyTemplate(action.templateName);
          this.notificationService.info(`Your document (${displayName}) has been sent for processing`);
          this.documentService.sendSignedDocument({
            showBranding: action.showBranding, 
            profileId: action.profileId, 
            templateName: action.templateName,
            allowDuplicates: action.allowDuplicates
          });
      
        })
      ),
      { dispatch: false}
    );

  signedDocumentSuccess: Observable<Action> = createEffect(() => this.actions$.pipe(
      ofType(
        FormsActionTypes.SignedDocumentSuccess
      ),
      tap((action: any) => {
        let displayName = this.documentService.getClientFriendlyTemplate(action.templateName);
        this.notificationService.success(`Your document (${displayName}) was successfully processed!`);
      }),
      
    ),
    { dispatch: false}
  );


    signedDocumentInvalid: Observable<Action> = createEffect(() => this.actions$.pipe(
        ofType(
          FormsActionTypes.SignedDocumentInvalid
        ),
        tap((action: any) => {
          let displayName = this.documentService.getClientFriendlyTemplate(action.templateName);
          this.notificationService.error(`Your document (${displayName}) has an invalid signature`);
        }),
      ),
      { dispatch: false}
    );
    

  signedDocumentExists: Observable<Action> = createEffect(() => this.actions$.pipe(
      ofType(
        FormsActionTypes.SignedDocumentExists
      ),
      tap((action: any) => {
        let displayName = this.documentService.getClientFriendlyTemplate(action.templateName);
        this.notificationService.error(`Document (${displayName}) already exists. Duplicates are not permitted`);
      }),
      
    ),
    { dispatch: false}
  );

  signedDocumentFailure: Observable<Action> = createEffect(() => this.actions$.pipe(
      ofType(
        FormsActionTypes.SignedDocumentFailure
      ),
      tap((action: any) => {
        let displayName = this.documentService.getClientFriendlyTemplate(action.templateName);
        this.notificationService.error(`Processing your document (${displayName}) had an unknown failure`);
      }),
      
    ),
    { dispatch: false}
  );

  searchProfilesByNameEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      FormsActionTypes.SearchProfilesByName
    ),
    tap((action: any) => {
      this.socketService.send({
        key: 'search',
        "command": "search_profiles", 
        "payload": {
          "searchString": action.searchString 
        }})
    }),
  ),
    { dispatch: false }
  )

  checkEmailEffect: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      FormsActionTypes.CheckEmail
    ),
      tap((action: any) => {
        this.socketService.send({
        key: 'search',
        command: "search_emails",
        payload: {"email": action.email}
        })
      })
    ),
      { dispatch: false }
  );

  addDemographicsFieldToCreateApplicationFormEffect = createEffect(() => this.actions$.pipe(
    ofType(
      FormsActionTypes.AddDemographicsFieldToCreateApplicationForm
    ),
      tap((action: any) => {
        
      })

    ),
      {dispatch: false}
  );
  
  addDemographicsFieldValueToCreateApplicationEffect = createEffect(() => this.actions$.pipe(
    ofType(
      FormsActionTypes.AddDemographicsFieldValueToCreateApplicationForm
    ),
      tap((action: any) => {
      
      })
  ),
      {dispatch: false}
  );

  commitCreateApplicationForm = createEffect(() => this.actions$.pipe(
    ofType(
      FormsActionTypes.CommitCreateApplicationForm
    ),
      tap((action: any) => {
        let licenseHistoryLookback = undefined;
        let licenseHistoryDisclaimer = undefined;
        if (this.createApplication.drivingHistoryInclude == true) {
          licenseHistoryLookback = this.createApplication.licenseHistoryLookback;
          licenseHistoryDisclaimer = this.createApplication.licenseHistoryDisclaimer;
        }

        let accidentHistoryLookback = undefined;
        let accidentHistoryDisclaimer = undefined;
        if (this.createApplication.accidentHistoryInclude == true) {
          accidentHistoryLookback = this.createApplication.accidentHistoryLookback;
          accidentHistoryDisclaimer = this.createApplication.accidentHistoryDisclaimer;
        }

        let equipmentTypes = [ ];
        if (this.createApplication.equipmentExperienceInclude == true) {equipmentTypes = this.createApplication.equipmentTypes}
        
        let msg_payload = {
            name: this.createApplication.applicationName,
            authorId: this.profile.profileId,
            businessId: this.business.uid,
            businessName: this.business.name,
            visibility: this.createApplication.visibility,
            description: this.createApplication.description,

            demographicsFields: this.createApplication.demographicsFields,
            demographicsDisclaimer: this.createApplication.demographicsDisclaimer,

            employmentHistoryLookback: this.createApplication.employmentHistoryLookback,
            employmentHistoryAllowGaps: this.createApplication.employmentHistoryAllowGaps,
            employmentHistoryDisclaimer: this.createApplication.employmentHistoryDisclaimer,

            addressHistoryLookback: this.createApplication.addressHistoryLookback,
            addressHistoryAllowGaps: this.createApplication.addressHistoryAllowGaps,
            addressHistoryDisclaimer: this.createApplication.addressHistoryDisclaimer,

            // workHistoryLookback: this.createApplication.workHistoryLookback,
            // workHistoryAllowGaps: this.createApplication.workHistoryAllowGaps,
            // workHistoryDisclaimer: this.createApplication.workHistoryDisclaimer,

            drivingHistoryInclude: this.createApplication.drivingHistoryInclude,
            licenseHistoryLookback: licenseHistoryLookback,
            licenseHistoryDisclaimer: licenseHistoryDisclaimer,

            educationHistoryInclude: this.createApplication.educationHistoryInclude,

            accidentHistoryInclude: this.createApplication.accidentHistoryInclude,
            accidentHistoryLookback: accidentHistoryLookback,
            accidentHistoryDisclaimer: accidentHistoryDisclaimer,

            equipmentExperienceInclude: this.createApplication.equipmentExperienceInclude,
            equipmentTypes: equipmentTypes,

            applicationDisclaimer: this.createApplication.applicationDisclaimer
        }
        console.log(msg_payload);
        console.log(this.business.uid);
        let payload = {
            key: 'business',
            command: 'create_application_template',
            payload: msg_payload,
        }
        
        this.socketService.send(payload);
      })
    ),
      { dispatch: false }
  )
}
