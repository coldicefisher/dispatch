import { 
  Component, 
  OnInit,
  ChangeDetectionStrategy,
  AfterContentInit,
  AfterViewInit
} from '@angular/core';


import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/core.module';

import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { 
  ROUTE_ANIMATIONS_ELEMENTS,

} from '../../../../core/core.module';

import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { PlacesService } from '../../../../core/data/places.service';
import { ApplicationDataService } from '../../../../core/data/application-data.service';
import { 
  selectCreateBusinessPageStatus, 
  selectCreateBusinessForm,
  selectCreateBusinessFormIndustryCategory,
  selectBusinessNameValid
} from '../../../../core/forms/selectors';

import {
  // selectProfile,
  selectProfileFullName,
  selectProfileId
} from '../../../../core/profile/selectors';

import { actionNavigateToProfilePage } from '../../../../core/profile/actions';
import { 
  actionProcessCreateBusinessForm1,
  actionProcessCreateBusinessForm2,
  actionProcessCreateBusinessForm3,
  actionProcessCreateBusinessForm4,
  actionCreateBusinessFormNavigatePrevious
} from '../../../../core/forms/actions';
import { actionCheckBusinessName, actionCreateBusiness } from '../../../../core/business/actions';
import { actionConnectSocket, actionIsNotLoading } from '../../../../core/site/site/actions';
import { SocketService } from '../../../../core/socket/socket.service';

import { actionIsLoading } from '../../../../core/site/site/actions';

import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'bizniz-create-business',
  templateUrl: './create-business.component.html',
  styleUrls: ['./create-business.component.scss'],
  providers: []
})
export class CreateBusinessComponent implements OnInit {
  pageStatus$: Observable<number> | undefined;

  constructor(
    private store: Store<AppState>,
  ){ }

  ngOnInit(): void {
    this.pageStatus$ = this.store.pipe(select(selectCreateBusinessPageStatus));
    
  }
}


@Component({
  selector: 'bizniz-create-business-1',
  templateUrl: './create-business-1.component.html',
  styleUrls: ['./create-business-1.component.scss'],
  providers: [
    // { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    // DatePipe,
    ]
})
export class CreateBusiness1Component implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  filteredLegalStructures: Observable<any[]>;
  legalStructureCtrl: FormControl;
  createFormState$: Observable<any> | undefined;
  selectedStructure: string | undefined;
  //nameValid$: Observable<boolean> | undefined;
  nameExists: boolean | undefined;
  nameEmptyError: boolean = true;
  businessName: string | undefined;
  
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    
    private applicationDataService: ApplicationDataService,
  ) 
  { 
    this.createFormState$ = this.store.pipe(select(selectCreateBusinessForm));
    this.legalStructureCtrl = new FormControl();
    this.legalStructureCtrl.addValidators(Validators.required);
    this.filteredLegalStructures = this.legalStructureCtrl.valueChanges
    .pipe(
      startWith(''),
      map(type => type ? this.filterlegalStructures(type) : this.applicationDataService.legalStructureTypes.slice())
    );
   
  }

  ngOnInit(): void {
   
    this.createFormState$.subscribe(res => {
      this.legalStructureCtrl.setValue(res.legalStructure);
      this.form.get('nameCtrl').setValue(res.name);
    })
  
  }

  filterlegalStructures(type: string) {
    return this.applicationDataService.legalStructureTypes.filter(type =>
      type.display.toLowerCase().indexOf(type.display.toLowerCase()) === 0);    
  }
  
  form = this.fb.group({
    nameCtrl: [undefined, Validators.compose([
        Validators.required
      ])
    ],
  });
  
  onCarrierClick(): void {
    let payload = {
      name: this.businessName,
      legalStructure: this.legalStructureCtrl.value,
      industry: "Transportation",
      industryCategory: "Carrier",
      page: 2,
      previousPage: 1,
    }
    this.store.dispatch(actionProcessCreateBusinessForm1(payload));
  }

  onBrokerClick(): void {
    let payload = {
      name: this.businessName,
      legalStructure: this.legalStructureCtrl.value,
      industry: "Transportation",
      industryCategory: "Broker",
      page: 2,
      previousPage: 1,
    }
    console.log(payload);
    this.store.dispatch(actionProcessCreateBusinessForm1(payload));
  }
  
  onOtherClick(): void {
    let payload = {
      name: this.businessName,
      legalStructure: this.legalStructureCtrl.value,
      industry: undefined,
      industryCategory: undefined,
      page: 2,
      previousPage: 1,
    }
    this.store.dispatch(actionProcessCreateBusinessForm1(payload));
  }

  onPreviousClick(): void {

  }

  onNoClick(): void {
    this.store.dispatch(actionNavigateToProfilePage());
  }

  structureClick($event: any) {
    this.selectedStructure = $event.option.value;
  }
  
  checkStructure(): void {
    setTimeout(()=> {
      if (!this.selectedStructure || this.selectedStructure !== this.legalStructureCtrl.value) {
        this.legalStructureCtrl.setValue(null);
        this.selectedStructure = '';
      }
     }, 1000);
  }

  getBusinessName($event) {
    this.nameExists = $event.exists;
    this.businessName = $event.businessName;
    this.nameEmptyError = $event.empty;
  }

}


@Component({
  selector: 'bizniz-create-business-2',
  templateUrl: './create-business-2.component.html',
  styleUrls: ['./create-business-2.component.scss'],
  providers: [
    
    ]
})
export class CreateBusiness2Component implements OnInit {
  createFormState$: Observable<any> | undefined;
  createFormIndustryCategory$: Observable<any> | undefined;
  // industryCtrl: FormControl;
  selectedIndustry: string | undefined;
  filteredIndustries: Observable<any[]>;
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    
    private dataService: ApplicationDataService,
    // private applicationDataService: ApplicationDataService,
  ) 
  {
    this.createFormState$ = this.store.pipe(select(selectCreateBusinessForm));
    this.createFormIndustryCategory$ = this.store.pipe(select(selectCreateBusinessFormIndustryCategory));
    // this.industryCtrl = new FormControl();
    //this.industryCtrl.addValidators(Validators.required);
    this.filteredIndustries = this.form.get('industryCtrl').valueChanges
    .pipe(
      startWith(''),
      map(industry => industry ? this.filterIndustries(industry) : this.dataService.industry.slice())
    );  
    
    this.createFormIndustryCategory$.subscribe((res) => {
      if (res === 'Broker' || res === 'Carrier') {
        this.form.get('mcNumberCtrl').addValidators(Validators.required);
        this.form.get('dotNumberCtrl').addValidators(Validators.required);
      }
      else {
        this.form.get('industryCtrl').addValidators(Validators.required);
      }
    })

  }

  ngOnInit(): void {
    
    this.createFormState$.subscribe(res => {
      this.form.get('dotNumberCtrl').setValue(res.dotNumber);
      this.form.get('mcNumberCtrl').setValue(res.mcNumber);
    });

    
  } 

  filterIndustries(display: string) {
    return this.dataService.industry.filter(industry =>
      industry.display.toLowerCase().indexOf(display.toLowerCase()) === 0);
  }
  form = this.fb.group({
    mcNumberCtrl: [undefined,],
    dotNumberCtrl: [undefined,],
    industryCtrl: [undefined]
  });

  onContinueClick(): void {
    let mcNumber = undefined;
    let dotNumber = undefined;
    let industry = undefined;
    if (this.form.get('mcNumberCtrl').value != undefined) {
      mcNumber = this.form.get('mcNumberCtrl').value;
      dotNumber = this.form.get('dotNumberCtrl').value;
      industry = "Transportation"
    }
    else {
      industry = this.form.get('industryCtrl').value;
    }
    this.store.dispatch(actionProcessCreateBusinessForm2({
      mcNumber: mcNumber,
      dotNumber: dotNumber,
      page: 3,
      previousPage: 2,
      industry: industry
    }));
    
  }

  onPreviousClick(): void {
    this.store.dispatch(actionCreateBusinessFormNavigatePrevious());
  }

  onNoClick(): void {
    this.store.dispatch(actionNavigateToProfilePage());
  }

  industryClick($event: any): void {
    this.selectedIndustry = $event.option.value
  }
  checkIndustry(): void {
    setTimeout(()=> {
      if (!this.selectedIndustry || this.selectedIndustry !== this.form.get('industryCtrl').value) {
        this.form.get('industryCtrl').setValue(null);
        this.selectedIndustry = '';
      }
     }, 1000);
  }

}


@Component({
  selector: 'bizniz-create-business-3',
  templateUrl: './create-business-3.component.html',
  styleUrls: ['./create-business-3.component.scss'],
  providers: [
    // { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    // DatePipe,
    ]
})
export class CreateBusiness3Component implements OnInit {
  //routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  filteredPhysicalStates: Observable<any[]>;
  physicalStateCtrl: FormControl;

  createFormState$: Observable<any> | undefined;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private placesService: PlacesService,
    private applicationDataService: ApplicationDataService,
  ) 
  { 
    this.createFormState$ = this.store.pipe(select(selectCreateBusinessForm))
    this.physicalStateCtrl = new FormControl();
    this.physicalStateCtrl.addValidators(Validators.required);
    this.filteredPhysicalStates = this.physicalStateCtrl.valueChanges
    .pipe(
      startWith(''),
      map(state => state ? this.filterPhysicalStates(state) : this.placesService.states.slice())
    );  
  }
  ngOnInit(): void {
    this.createFormState$.subscribe(res => {
      this.physicalStateCtrl.setValue(res.physicalState);
      this.form.get('physicalAddress1Ctrl').setValue(res.physicalAddress1);
      this.form.get('physicalAddress2Ctrl').setValue(res.physicalAddress2);
      this.form.get('physicalCityCtrl').setValue(res.physicalCity);
      this.form.get('physicalZipCtrl').setValue(res.physicalZip);
      
    })
    
  }

  
  filterPhysicalStates(name: string) {
    return this.placesService.states.filter(state =>
      state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  
  form = this.fb.group({
    physicalAddress1Ctrl: [undefined, Validators.required],
    physicalAddress2Ctrl: [undefined, ],
    physicalCityCtrl: [undefined, Validators.required],
    physicalZipCtrl: [undefined, Validators.required],
    
  });
  
  onTheSameClick(): void {
    let payload = {
      address1: this.form.get('physicalAddress1Ctrl').value,
      address2: this.form.get('physicalAddress2Ctrl').value,
      city: this.form.get('physicalCityCtrl').value,
      state: this.physicalStateCtrl.value,
      zip: this.form.get('physicalZipCtrl').value,
      page: 5,
      previousPage: 3,
      skipMailing: true
    }
    this.store.dispatch(actionProcessCreateBusinessForm3(payload))
  }

  onDifferentClick(): void {
    let payload = {
      address1: this.form.get('physicalAddress1Ctrl').value,
      address2: this.form.get('physicalAddress2Ctrl').value,
      city: this.form.get('physicalCityCtrl').value,
      state: this.physicalStateCtrl.value,
      zip: this.form.get('physicalZipCtrl').value,
      page: 4,
      previousPage: 3,
      skipMailing: false
    }
    this.store.dispatch(actionProcessCreateBusinessForm3(payload))
  }
  onPreviousClick(): void {
    this.store.dispatch(actionCreateBusinessFormNavigatePrevious());
  }

  onNoClick(): void {
    this.store.dispatch(actionNavigateToProfilePage());
  }

  getAddress($event) {
    var [street, city, stateAndZip, ...rest] = $event.formatted_address.split(",");
    var [empty, state, zip] = stateAndZip.split(" ");
    this.form.get('physicalAddress1Ctrl').setValue(street);
    this.form.get('physicalCityCtrl').setValue(city);
    this.physicalStateCtrl.setValue(state);
    this.form.get('physicalZipCtrl').setValue(zip);
    
  }
}


@Component({
  selector: 'bizniz-create-business-4',
  templateUrl: './create-business-4.component.html',
  styleUrls: ['./create-business-4.component.scss'],
  providers: [
    
    ]
})
export class CreateBusiness4Component implements OnInit {
  createFormState$: Observable<any> | undefined;
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  filteredMailingStates: Observable<any[]>;
  mailingStateCtrl: FormControl;
  
  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private placesService: PlacesService,
  ) 
  { 
    this.createFormState$ = this.store.pipe(select(selectCreateBusinessForm))
    this.mailingStateCtrl = new FormControl();
    this.mailingStateCtrl.addValidators(Validators.required);
    
    this.filteredMailingStates = this.mailingStateCtrl.valueChanges
    .pipe(
      startWith(''),
      map(state => state ? this.filterMailingStates(state) : this.placesService.states.slice())
    );
  }
  ngOnInit(): void {
    this.createFormState$.subscribe(res => {
      this.mailingStateCtrl.setValue(res.mailingState);
      this.form.get('mailingAddress1Ctrl').setValue(res.mailingAddress1);
      this.form.get('mailingAddress2Ctrl').setValue(res.mailingAddress2);
      this.form.get('mailingCityCtrl').setValue(res.mailingCity);
      this.form.get('mailingZipCtrl').setValue(res.mailingZip);
    })
  }

  filterMailingStates(name: string) {
    return this.placesService.states.filter(state =>
      state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  form = this.fb.group({
    mailingAddress1Ctrl: [undefined, Validators.required],
    mailingAddress2Ctrl: [undefined, ],
    mailingCityCtrl: [undefined, Validators.required],
    mailingZipCtrl: [undefined, Validators.required]
  });

  onPreviousClick(): void {
    this.store.dispatch(actionCreateBusinessFormNavigatePrevious());  
  }

  onContinueClick(): void {
    let payload = {
      page: 5,
      previousPage: 4,
      address1: this.form.get('mailingAddress1Ctrl').value,
      address2: this.form.get('mailingAddress2Ctrl').value,
      city: this.form.get('mailingCityCtrl').value,
      state: this.mailingStateCtrl.value,
      zip: this.form.get('mailingZipCtrl').value
    }
    this.store.dispatch(actionProcessCreateBusinessForm4(payload));
  }

  onNoClick(): void {
    this.store.dispatch(actionNavigateToProfilePage());
  }

  getAddress($event) {
    var [street, city, stateAndZip, ...rest] = $event.formatted_address.split(",");
    var [empty, state, zip] = stateAndZip.split(" ");
    this.form.get('mailingAddress1Ctrl').setValue(street);
    this.form.get('mailingCityCtrl').setValue(city);
    this.mailingStateCtrl.setValue(state);
    this.form.get('mailingZipCtrl').setValue(zip);
  }
}


@Component({
  selector: 'bizniz-create-business-5',
  templateUrl: './create-business-5.component.html',
  styleUrls: ['./create-business-5.component.scss'],
  providers: [
    
    ]
})

export class CreateBusiness5Component implements OnInit {
  createFormState$: Observable<any> | undefined;
  profileFullName$: Observable<any> | undefined;
  profileId$: Observable<any> | undefined;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private placesService: PlacesService,
    private socketService: SocketService,
  ) 
  { 
    this.createFormState$ = this.store.pipe(select(selectCreateBusinessForm));
    this.profileFullName$ = this.store.pipe(select(selectProfileFullName));
    this.profileId$ = this.store.pipe(select(selectProfileId));
    
  }
  ngOnInit(): void {
    this.store.dispatch(actionConnectSocket());
  }

  documentSent($event) {
    if ($event.clicked) {
      // Create the business
      let profileId;
      this.profileId$.subscribe(res => {
        profileId = res;
      })
      
      this.createFormState$.subscribe(res => {
        this.store.dispatch(actionCreateBusiness({
          name: res.name,
          profileId: profileId,
          industry: res.industry,
          industryCategory: res.industryCategory,
          mcNumber: res.mcNumber,
          dotNumber: res.dotNumber,
          legalStructure: res.legalStructure,
          physicalAddress1: res.physicalAddress1,
          physicalAddress2: res.physicalAddress2,
          physicalCity: res.physicalCity,
          physicalState: res.physicalState,
          physicalZip: res.physicalZip,
          mailingAddress1: res.mailingAddress1,
          mailingAddress2: res.mailingAddress2,
          mailingCity: res.mailingCity,
          mailingState: res.mailingState,
          mailingZip: res.mailingZip,
        }))
      });
    }      
  }

  onPreviousClick(): void {
    this.store.dispatch(actionCreateBusinessFormNavigatePrevious());  
  }

  onNoClick(): void {
    this.store.dispatch(actionNavigateToProfilePage());
  }

}

