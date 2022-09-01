import { 
  Component, 
  OnInit, 
  ChangeDetectionStrategy, 
  Inject, 
  Output,
  EventEmitter
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/core.module';

import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { 
  CustomValidators,
  ROUTE_ANIMATIONS_ELEMENTS,

} from '../../../../core/core.module';

import { Observable } from 'rxjs';
// import { startWith, map } from 'rxjs/operators';
import { selectProfile, selectProfileBusinesses } from '../../../../core/profile/selectors';

import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// import { 
//   NotificationService, 
// } from '../../../../core/core.module';

// import { PlacesService } from '../../../../core/data/places.service';
// import { ApplicationDataService } from '../../../../core/data/application-data.service';

import { 
  actionNavigateFromProfileToDashboard,
  actionNavigateToCreateBusiness,
} from '../../../../core/business/actions';

// import { MAT_DATE_FORMATS } from '@angular/material/core';
// import { MY_DATE_FORMATS } from '../../../../core/data/date-formats';
// import { DatePipe } from '@angular/common';


// interface DialogData {
//   id: number,
//   fieldName: string
//   fieldValue: string,
// }


@Component({
  selector: 'bizniz-businesses-summary',
  templateUrl: './businesses-summary.component.html',
  styleUrls: ['./businesses-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BusinessesSummaryComponent implements OnInit {
  @Output() isDirtyEvent = new EventEmitter<boolean>();
  profile$: Observable<any>;
  businesses$: Observable<any>;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) { 
      // this.profile$ = this.store.pipe(select(selectProfile));
      this.businesses$ = this.store.pipe(select(selectProfileBusinesses));
    }

  ngOnInit(): void {
  }
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  form = this.fb.group(
    {
    },
    
  ); // End form


  sendMessage(newVal: boolean) {
    
    this.isDirtyEvent.emit(newVal);
  }

  onSelectBusiness(uid: string, name: string): void {
    this.store.dispatch(actionNavigateFromProfileToDashboard({ uid: uid, name: name }));
    
  }
  onCreateBusiness(): void {
    this.store.dispatch(actionNavigateToCreateBusiness());
  }

}
