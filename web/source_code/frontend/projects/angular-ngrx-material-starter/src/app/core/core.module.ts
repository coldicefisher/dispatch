// CORE IMPORTS //////////////////////////////////////////////////////////////////////////////////
import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf, ErrorHandler } from '@angular/core';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import {
  StoreRouterConnectingModule,
  RouterStateSerializer
} from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// END CORE IMPORTS /////////////////////////////////////////////////////////////////////////////


// ENVIRONMENT IMPORTS //////////////////////////////////////////////////////////////////////////
import { environment } from '../../environments/environment';
// END ENVIRONMENT IMPORTS //////////////////////////////////////////////////////////////////////


// SITE LOADING IMPORTS /////////////////////////////////////////////////////////////////////////
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { ProgressSpinnerModule } from './progress-spinner/progress-spinner.module';
import { selectSite, selectIsLoading } from './site/site/selectors';
import { AppOverlayModule } from './overlay/overlay.module';
// END SITE LOADING IMPORTS /////////////////////////////////////////////////////////////////////


// APPLICATION STATE, REDUCERS, ROUTERS IMPORTS /////////////////////////////////////////////////
import {
  AppState,
  reducers,
  metaReducers,
  selectRouterState
} from './core.state';
// END APPLICATION STATE, REDUCERS, ROUTERS IMPORTS //////////////////////////////////////////////


// AUTH EFFECTS, STATE SLICES IMPORTS ////////////////////////////////////////////////////////////
import { AuthStoreEffects } from './auth/auth/effects';
import { AuthPersistStoreEffects } from './auth/auth/persist.effects';
import { selectAuthState, selectSiteState } from './core.state';
import { selectAuthIsAuthenticated, selectAuth, selectOtpOptions, selectUsername } from './auth/auth/selectors';
// END AUTH EFFECTS, STATE SLICES IMPORTS ////////////////////////////////////////////////////////

// PROFILE EFFECTS, STATE SLICES IMPORTS /////////////////////////////////////////////////////////
import { ProfileStoreEffects } from './profile/effects';
import { ProfilePersistStoreEffects } from './profile/persist.effects';
import { selectProfileState } from './core.state';
// import { selectAuthIsAuthenticated, selectAuth, selectOtpOptions, selectUsername } from './auth/auth/selectors';
// END PROFILE EFFECTS, STATE SLICES IMPORTS //////////////////////////////////////////////////////

// IMAGE EFFECTS, STATE SLICES IMPORTS ////////////////////////////////////////////////////////////
import { ImageStoreEffects } from './images/effects';
// END IMAGE EFFECTS, STATE SLICES IMPORTS ////////////////////////////////////////////////////////

// BUSINESS EFFECTS, STATE SLICES IMPORTS /////////////////////////////////////////////////////////
import { BusinessStoreEffects } from './business/effects';
import { BusinessPersistStoreEffects } from './business/persist.effects';
// END BUSINESS EFFECTS, STATE SLICES IMPORTS /////////////////////////////////////////////////////

// FORMS EFFECTS, STATE SLICES IMPORTS ////////////////////////////////////////////////////////////
import { FormsStoreEffects } from './forms/effects';
// END FORMS EFFECTS, STATE SLICES IMPORTS ////////////////////////////////////////////////////////

// SEARCH INDEX EFFECTS, STATE SLICES IMPORTS /////////////////////////////////////////////////////
import { UsersDataStoreEffects } from './data/effects';
// END SEARCH INDEX EFFECTS, STATE SLICES IMPORTS ////////////////////////////////////////////////

// SEARCH INDEX EFFECTS, STATE SLICES IMPORTS /////////////////////////////////////////////////////
import { SiteEffects } from './site/site/effects';
// END SEARCH INDEX EFFECTS, STATE SLICES IMPORTS ////////////////////////////////////////////////

// HOME EFFECTS, STATE SLICES IMPORTS ////////////////////////////////////////////////////////////
import { HomeStoreEffects } from './home/effects';
// END HOME EFFECTS, STATE SLICES IMPORTS ////////////////////////////////////////////////////////

// SITE FUNCTIONALITY IMPORTS ////////////////////////////////////////////////////////////////////
// import { AuthGuardService } from './auth/auth-guard.service';
import { TitleService } from './title/title.service';
import {
  ROUTE_ANIMATIONS_ELEMENTS,
  routeAnimations
} from './animations/route.animations';
import { AnimationsService } from './animations/animations.service';
import { CustomSerializer } from './router/custom-serializer';
import { LocalStorageService } from './local-storage/local-storage.service';
import {
  selectSettingsLanguage,
  selectEffectiveTheme,
  selectSettingsStickyHeader
} from './settings/settings.selectors';
import { NotificationService } from './notifications/notification.service';
import { SettingsEffects } from './settings/settings.effects';

// END SITE FUNCTIONALITY IMPORTS ///////////////////////////////////////////////////////////////


// FORM FUNCTIONALITY IMPORTS ///////////////////////////////////////////////////////////////////
import { CustomValidators } from './validators/custom-validators';
// END FORM FUNCTIONALITY IMPORTS ///////////////////////////////////////////////////////////////


// ERROR HANDLING IMPORTS ///////////////////////////////////////////////////////////////////////
import { AppErrorHandler} from './error-handler/app-error-handler.service';
import { HttpErrorInterceptor } from './http-interceptors/http-error.interceptor';
// END ERROR HANDLING IMPORTS ///////////////////////////////////////////////////////////////////


// GOOGLE ANALYTICS IMPORTS /////////////////////////////////////////////////////////////////////
import { GoogleAnalyticsEffects } from './google-analytics/google-analytics.effects';
// END GOOGLE ANALYTICS IMPORTS /////////////////////////////////////////////////////////////////

// FEATURES MODULE IMPORTS ///////////////////////////////////////////////////////////////////////
import { AuthModule } from '../features/auth/auth.module';
import { ProfileModule } from '../features/profile/profile.module';
import { LegalModule} from '../features/legal/legal.module'
import { BusinessDashboardModule } from '../features/business-dashboard/business-dashboard.module';
// END FEATURES MODULE IMPORTS ///////////////////////////////////////////////////////////////////

// WEBSOCKET IMPORTS /////////////////////////////////////////////////////////////////////////////
import { SocketService } from './socket/socket.service';
import { FeedSocketService } from './socket-feed/socket-feed.service';
import { ListenerProfileService } from './socket/listener.profile.service';
import { ListenerDocumentService } from './socket/listener.document.service';
import { ListenerBusinessService } from './socket/listener.business.service';
import { ListenerSystemService } from './socket/listener.system.service';
import { ListenerPublicBusinessService } from './socket-feed/listener.public.businesses.service';
// END WEBSOCKET IMPORTS /////////////////////////////////////////////////////////////////////////

import { nl2brPipe } from './custom-pipes/test-transform';
import { UcWidgetModule } from 'ngx-uploadcare-widget';
import { LegalStructurePipe } from './data/legal-structure.pipe';

// CRYPTOGRAPHY IMPORTS //////////////////////////////////////////////////////////////////////////
import { CryptographyService } from './cryptography/cryptography.service';
//////////////////////////////////////////////////////////////////////////////////////////////////

// DOCUMENT IMPORTS //////////////////////////////////////////////////////////////////////////////
import { DocumentsService } from './forms/documents.service';
//////////////////////////////////////////////////////////////////////////////////////////////////

import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { SmartControlsModule } from '../features/smart-controls/smart-controls.module';

// END IMPORTS ///////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


// EXPORTS ///////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

export {
  // SITE LOADING EXPORTS //////////////////////////////////////////////////////////////////  
  ProgressSpinnerComponent,
  ProgressSpinnerModule,
  AppOverlayModule,
  // END SITE LOADING EXPORTS //////////////////////////////////////////////////////////////

  // APPLICATION STATE, REDUCERS, ROUTERS EXPORTS //////////////////////////////////////////
  AppState,
  selectRouterState,
  // AuthGuardService,
  // END APPLICATION STATE, REDUCERS, ROUTERS EXPORTS //////////////////////////////////////

  // AUTH EFFECTS, STATE SLICES EXPORTS ////////////////////////////////////////////////////
  selectAuth,
  selectAuthState,
  selectSite,
  selectSiteState,
  selectIsLoading,
  selectAuthIsAuthenticated,
  selectOtpOptions,
  selectUsername,
  // END AUTH EFFECT, STATE SLICES EXPORTS /////////////////////////////////////////////////

  // PROFILE EFFECTS, STATE, SLICES EXPORTS ////////////////////////////////////////////////
  selectProfileState,
  // END PROFILE EFFECTS, STATE, SLICES EXPORTS ////////////////////////////////////////////

  // SITE FUNCTIONALITY EXPORTS ////////////////////////////////////////////////////////////
  TitleService,
  // END SITE FUNCTIONALITY EXPORTS ////////////////////////////////////////////////////////

  // SITE FUNCTIONALITY EXPORTS ////////////////////////////////////////////////////////////
  LocalStorageService,
  routeAnimations,
  ROUTE_ANIMATIONS_ELEMENTS,
  AnimationsService,
  NotificationService,
  selectEffectiveTheme,
  selectSettingsLanguage,
  selectSettingsStickyHeader,
  // END SITE FUNCTIONALITY EXPORTS ////////////////////////////////////////////////////////

  // FORM FUNCTIONALITY EXPORTS ////////////////////////////////////////////////////////////
  CustomValidators,
  // END FORM FUNCTIONALITY EXPORTS ////////////////////////////////////////////////////////

  // ERROR HANDLING EXPORTS ////////////////////////////////////////////////////////////////
  AppErrorHandler,
  // END ERROR HANDLING EXPORTS ////////////////////////////////////////////////////////////

  // CRYPTOGRAPHY IMPORTS //////////////////////////////////////////////////////////////////
  CryptographyService,
  // END CRYPTOGRAPHY IMPORTS //////////////////////////////////////////////////////////////
  GooglePlaceModule,

  ListenerProfileService,
  ListenerBusinessService,
  ListenerDocumentService,
  ListenerSystemService,
  ListenerPublicBusinessService,

  SocketService,
  FeedSocketService,
};
// END EXPORTS /////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

// HTTP LOADER EXPORT //////////////////////////////////////////////////////////////////////////////////
export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    //`${environment.i18nPrefix}/assets/i18n/`,
    `/assets/i18n/`,
    '.json'
  );
}
// END HTTP LOADER EXPORT ///////////////////////////////////////////////////////////////////////////////


// MODULE ///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
@NgModule({
  
  // IMPORTS ////////////////////////////////////////////////////////////////////////////////////////////
  /*
    Imports makes the exported declarations of other modules available in the current module.
    It is used to import supporting modules likes FormsModule, RouterModule, CommonModule etc.
  */
  imports: [
    
    CommonModule,
    HttpClientModule,
    // AuthGuardService,
    // END CORE IMPORTS ///////////////////////////////////////
    
    UcWidgetModule,
    
    // APPLICATION STATE, REDUCERS, ROUTERS IMPORTS ///////////
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([
      // AuthEffects,
      AuthStoreEffects,
      AuthPersistStoreEffects,
      
      ProfileStoreEffects,
      ProfilePersistStoreEffects,
      
      ImageStoreEffects,
      BusinessStoreEffects,
      BusinessPersistStoreEffects,
      UsersDataStoreEffects,
      FormsStoreEffects,
      SiteEffects,
      HomeStoreEffects,
      
      SettingsEffects,
      GoogleAnalyticsEffects,
      
    ]),
    // END APPLICATION STATE, REDUCERS, ROUTERS IMPORTS //////

    // ENVIRONMENT IMPORTS ///////////////////////////////////
    environment.production
      ? []
      : StoreDevtoolsModule.instrument({
          name: 'Angular NgRx Material Starter'
        }),
    // END ENVIRONMENT IMPORTS ///////////////////////////////

    // FONT AWESOME IMPORTS //////////////////////////////////
    // FontAwesomeModule,
    // END FONT AWESOME IMPORTS //////////////////////////////

    // SITE TRANSLATION IMPORTS //////////////////////////////
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    // END SITE TRANSLATION IMPORTS //////////////////////////

    // SITE LOADING IMPORTS //////////////////////////////////
    ProgressSpinnerModule,
    AppOverlayModule,
    // END SITE LOADING IMPORTS //////////////////////////////

    // FEATURES MODULES IMPORTS //////////////////////////////
    AuthModule,
    ProfileModule,
    BusinessDashboardModule,
    LegalModule,
    SmartControlsModule,
    // END FEATURES MODULES IMPORTS //////////////////////////

  ],
  // END IMPORTS ///////////////////////////////////////////////////////////////////////////////

  // DECLARATIONS //////////////////////////////////////////////////////////////////////////////
  /*
    Declarations are used to declare components, directives, pipes that belongs to the current module. 
    Everything inside declarations knows each other.
    Declarations are used to make directives (including components and pipes) from the current module available to other directives in the current module.
    Selectors of directives, components or pipes are only matched against the HTML if they are declared or imported.
  */
  declarations: [
    nl2brPipe,
    LegalStructurePipe,
  ],
  // END DECLARATIONS ///////////////////////////////////////////////////////////////////////////

  // PROVIDERS //////////////////////////////////////////////////////////////////////////////////
  /*
      Providers are used to make services and values known to dependency injection.
    They are added to the root scope and they are injected to other services or directives that have them as dependency.
  */
  providers: [
    
    // { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    // { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    { provide: SocketService, useClass: SocketService },
    { provide: FeedSocketService, useClass: FeedSocketService },
    { provide: ListenerProfileService, useClass: ListenerProfileService },
    { provide: ListenerBusinessService, useClass: ListenerBusinessService },
    { provide: ListenerDocumentService, useClass: ListenerDocumentService },
    { provide: ListenerSystemService, useClass: ListenerSystemService },
    { provide: ListenerPublicBusinessService, useClass: ListenerPublicBusinessService },
    
    // AuthGuardService
    // { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  // END PROVIDERS ///////////////////////////////////////////////////////////////////////////////


  // MODULE EXPORTS //////////////////////////////////////////////////////////////////////////////
  exports: [
    
    // SITE FUNCTIONALITY EXPORTS ////////////////////////////////
    TranslateModule,
    // END SITE FUNCTIONALITY EXPORTS ////////////////////////////
  
    // SITE LOADING EXPORTS //////////////////////////////////////
    ProgressSpinnerModule,
    // END SITE LOADING EXPORTS //////////////////////////////////

    // FEATURES MODULES EXPORTS //////////////////////////////////
    AuthModule,
    ProfileModule,
    BusinessDashboardModule,
    LegalModule,
    SmartControlsModule,
    // END FEATURES MODULES EXPORTS //////////////////////////////
    
    
  ],
  // END MODULE EXPORTS //////////////////////////////////////////////////////////////////////////
})
// END NGMODULE //////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


// EXPORT MODULE CLASS ///////////////////////////////////////////////////////////////////////////
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
    // faIconLibrary: FaIconLibrary
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
    // faIconLibrary.addIcons(
    //   faCog,
    //   faBars,
    //   faRocket,
    //   faPowerOff,
    //   faUserCircle,
    //   faPlayCircle,
    //   faGithub,
    //   faMediumM,
    //   faTwitter,
    //   faInstagram,
    //   faYoutube,
    //   faAddressBook,
    //   faAddressCard,
    //   faSmile,
    //   faMars,
    //   faVenus,
    //   faVenusDouble,
    // );
  }
  // END EXPORT MODULE CLASS ///////////////////////////////////////////////////////////////////////
}
