
// import { BehaviorSubject } from 'rxjs';
import { 
  FormBuilder, 
  FormControl, 
  Validators } from '@angular/forms';
import { CustomValidators, NotificationService } from '../../../core/core.module';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

//import {} from 'googlemaps';

import { 
  ROUTE_ANIMATIONS_ELEMENTS,

} from '../../../core/core.module';

import { 
  Component, 
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Inject,
  Output,
  EventEmitter

} from '@angular/core';

import { SocketService } from '../../../core/socket/socket.service';
import { CryptographyService } from '../../../core/core.module';
import { DocumentsService } from '../../../core/forms/documents.service';
import { DeviceDetectorService } from 'ngx-device-detector';

import { BehaviorSubject, Observable } from "rxjs";
import { AuthService } from '../../../core/auth/auth.service';

import { actionSignBusinessSignupDisclaimer, actionSignDocument } from '../../../core/forms/actions';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../core/core.module';
import { actionIsLoading, actionIsNotLoading } from '../../../core/site/site/actions';

import { actionSearchProfilesByName } from '../../../core/forms/actions';
import { selectProfileSearchResults, selectProfileSearchResultsLoading } from '../../../core/forms/selectors';
import { startWith, map, tap, debounceTime, switchMap, finalize, } from 'rxjs/operators';

import { selectBusinessNameValid } from '../../../core/forms/selectors';
import { actionCheckBusinessName } from '../../../core/business/actions';

@Component({
  selector: 'bizniz-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss'],
  providers: [
    
    ]
})
export class TermsAndConditionsComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;  
  constructor() { }
  ngOnInit(): void { }
}

@Component({
  selector: 'bizniz-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  providers: [
    
    ]
})
export class PrivacyPolicyComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  constructor() 
  {
    
  }

  ngOnInit(): void { } 
  
}


@Component({
  selector: 'bizniz-business-disclaimer',
  templateUrl: './business-disclaimer.component.html',
  styleUrls: ['./business-disclaimer.component.scss'],
  providers: [
    
    ]
})
export class BusinessDisclaimerComponent implements OnInit {
  constructor() 
  { }

  ngOnInit(): void { } 
  
}


@Component({
  selector: 'bizniz-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss'],
  providers: [
    
    ]
})
export class SignatureComponent implements OnInit {
  @Input() profileId: string;
  @Input() templateName: string;
  @Input() fullName: string;
  @Input() disabled: boolean = false;
  @Input() requirePlace: boolean = false;
  @Input() showBranding: boolean = true;
  @Input() allowDuplicates = true;
  @Input() isLoading = false;
  @Output() documentSigned: EventEmitter<any> = new EventEmitter();
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  todayDate: Date = new Date();  
  deviceInfo: Observable<any>;
  
  constructor(
    // private socketService: SocketService,
    private documentService: DocumentsService,
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<AppState>,
    private notificationService: NotificationService,

  ) 
  { }

  ngOnInit(): void { 
    
      // if (this.wrapper === undefined) { this.wrapper = "printable-container"; } // Set the default wrapper to printable
      this.form.get('verifyNameCtrl').setValue(this.fullName);
      this.deviceInfo = this.authService.deviceWithIp$();
    
    
  }

    form = this.fb.group({
      fullNameCtrl: ['', Validators.compose([
          Validators.required,
        ]),
      ],
      verifyNameCtrl: ['',Validators.compose([
          Validators.required,
        ])
      ],
    },
    {
      validators: [CustomValidators.mustMatch('fullNameCtrl', 'verifyNameCtrl')] // insert here
    }
  );


  onPreview() {
    let doc = this.documentService.pdfOpen({showBranding: this.showBranding});
    doc.open();
  }

  onClick() {
    if (this.isLoading == true) {
      this.store.dispatch(actionIsLoading());
    }

    this.store.dispatch(actionSignDocument({
      showBranding: this.showBranding, 
      profileId: this.profileId, 
      templateName: this.templateName,
      allowDuplicates: this.allowDuplicates
    }))

    
    // Emit event that document was signed and sent
    let payload = {
      'templateName': this.templateName,
      'profileId': this.profileId,
      'clicked': true
    }
    this.invokeEvent(payload);
        
  }

  invokeEvent(documentContent: Object) {
    this.documentSigned.emit(documentContent);
  }

}

@Component({
  selector: 'bizniz-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  providers: [
    
    ]
})

export class TestComponent implements OnInit {
  name: string = '';
  nameValid$: Observable<boolean> | undefined;
  constructor(
    private fb: FormBuilder,
    private socketService: SocketService,
    private store: Store<AppState>,
    
    
  ) 
  { 
    
  }

  ngOnInit(): void { 
    this.nameValid$ = this.store.pipe(select(selectBusinessNameValid));
    
    let point3d: Point3d = {x:3,y:6,z:1}
    console.log(point3d);
    console.log('hi ' + this.helloTuring('John'))
  }

  helloTuring(s) {
    console.log(s)
  }

  form = this.fb.group({
    nameCtrl: [undefined, Validators.compose([
      Validators.required
    ])
  ],

  })

  onTest(): void {
    // this.socketService.send({'command': 'get_doc'});
    //let base64String = "your-base64-string";
    //this.documentsService.downloadPdf(base64String,"sample");
    //this.store.dispatch(actionSearchProfilesByName({searchString: 'jame'}));
    console.log(this.name);
  }

  checkName() {
    let val = this.form.get('nameCtrl').value;
    this.store.dispatch(actionCheckBusinessName({ name: val}));
    //this.form.get('nameCtrl').setValue(val);
  }

  getBusinessNameExists($event) {
    console.log('received');
    console.log($event);
  }

  getEmail($event) {
    console.log('received email');
    console.log($event);
  }

  nameChanged($event) {
    console.log(this.name);
    console.log($event)
  }

  
  
}

class TuringPoint {
  x: number;
  y: number;
}
interface Point3d extends TuringPoint {
  z: number;
}