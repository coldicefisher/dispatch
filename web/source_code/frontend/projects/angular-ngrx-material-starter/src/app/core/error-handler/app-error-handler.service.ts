import { Injectable, ErrorHandler } from '@angular/core';
// import { HttpErrorResponse } from '@angular/common/http';

// import { environment } from '../../../environments/environment';

import { NotificationService } from '../notifications/notification.service';
import { Router } from '@angular/router';
import { actionIsNotLoading } from '../site/site/actions';

// import { actionAppFailure } from '../site/site/actions';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../core/core.module';


// @Injectable()
// export class appErrorHandler {
//   constructor(  
//   private notificationsService: NotificationService,
//   private router: Router,


//   ){ }
//   handleError(error) {
//     let displayMessage = '';
//     switch (error.status) {
//       case 400: // BAD_REQUEST
//         this.notificationsService.error(displayMessage += "Oops! Something went wrong");
//         this.router.navigateByUrl('/');
//         break;

//       case 401: // UNAUTHORIZED
//         this.notificationsService.info(displayMessage += 'You are not authorized');
//         this.router.navigateByUrl('/login/');
//         break;

//       case 406: // NOT_ACCEPTABLE
//         this.notificationsService.warn(displayMessage += 'You have entered an invalid response');
//         break;

//       case 409: // CONFLICT
//         this.notificationsService.warn(displayMessage += 'There is a conflict with your information');
//         break;
      
//       case 417: // EXPECTATION_FAILED
//         this.notificationsService.error(displayMessage += "Oops! Something went wrong");
//         this.router.navigateByUrl('/');
//         break;
//       default:
//         this.notificationsService.error(displayMessage += "Oops! Something went wrong");
//         break;
//     }
//   }
// }

/** Application-wide error handler that adds a UI notification to the error handling
 * provided by the default Angular ErrorHandler.
 */
@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor(
      //private handler: appErrorHandler,
      //private store: Store<AppState>,
      private notificationsService: NotificationService,
      private router: Router,

    ) {
    //super();
  }
  handleError(error) {
    let displayMessage = '';
    //this.store.dispatch(actionIsNotLoading());
    switch (error.status) {
      case 400: // BAD_REQUEST
        this.notificationsService.error(displayMessage += "Oops! Something went wrong");
        this.router.navigateByUrl('/');
        break;

      case 401: // UNAUTHORIZED
        this.notificationsService.info(displayMessage += 'You are not authorized');
        this.router.navigateByUrl('/login/');
        break;

      case 406: // NOT_ACCEPTABLE
        this.notificationsService.warn(displayMessage += 'You have entered an invalid response');
        break;

      case 409: // CONFLICT
        this.notificationsService.warn(displayMessage += 'There is a conflict with your information');
        break;
      
      case 417: // EXPECTATION_FAILED
        this.notificationsService.error(displayMessage += "Oops! Something went wrong");
        this.router.navigateByUrl('/');
        break;
      default:
        this.notificationsService.error(displayMessage += `Oops! Something went wrong. Error ${error}`);
        break;
    }

    
    // this.notificationsService.error(displayMessage);

    //super.handleError(error);
    
  }
}
