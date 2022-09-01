import { 
  FormBuilder, 
  FormControl, 
  Validators 
} from '@angular/forms';


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

import { Observable } from "rxjs";

import { Store, select } from '@ngrx/store';
import { AppState } from '../../../core/core.module';

import { actionSearchProfilesByName } from '../../../core/forms/actions';
import { 
  selectProfileSearchResults, 
  selectProfileFilteredSearchResults,
  selectProfileSearchResultsLoading 
} from '../../../core/forms/selectors';
import { startWith, map, tap, debounceTime, switchMap, finalize, } from 'rxjs/operators';
import { actionGetBusinessUsers } from '../../../core/business/actions';

import { BusinessUser } from '../../../core/business/state';

@Component({
  selector: 'SearchProfiles',
  templateUrl: './search-profiles.component.html',
  styleUrls: ['./search-profiles.component.scss'],
  providers: [
    
    ]
})
export class SearchProfilesComponent implements OnInit {
  @Input() searchType: string;
  @Input() filterIds: string[];
  @Input() convertNullToEmpty: boolean = true;
  @Output() setProfile: EventEmitter<any> = new EventEmitter();
    
  searchResults$: Observable<any>;
  filteredProfiles: Observable<any[]>;
  searchCtrl: FormControl;
  isLoading$: Observable<boolean>;
  errorMsg: string;

  constructor(
    private fb: FormBuilder,
    private socketService: SocketService,
    private store: Store<AppState>,
  ) 
  { 
    this.isLoading$ = this.store.pipe(select(selectProfileSearchResultsLoading));
  }

  ngOnInit(): void { 
    if (this.filterIds === undefined) { this.filterIds = []; }
    if (this.searchType === undefined || this.searchType === null || this.searchType === '') { this.searchType === 'profile'}
    if (this.searchType === 'businessProfile' || this.searchType === 'business_profile') {this.searchType = 'business_profile' }
    else {this.searchType = 'profile'}
    
    this.searchCtrl = new FormControl();
    
    this.searchResults$ = this.store.pipe(select(selectProfileFilteredSearchResults(this.filterIds)));
    
    this.filteredProfiles = this.searchCtrl.valueChanges
    .pipe(
      debounceTime(300),
      startWith(''),
      tap(() => {
        if (this.searchCtrl && this.searchCtrl.value != '' && this.searchCtrl.value != undefined) {
          if (typeof(this.searchCtrl.value) === 'string'){
            this.store.dispatch(actionSearchProfilesByName({searchString: this.searchCtrl.value, searchType: this.searchType}));
          }else {
            this.invokeEvent(this.searchCtrl.value);
          }
          this.errorMsg = "";
          
        }
      }),
      switchMap(value => this.searchResults$)
    );

  }
  invokeEvent(profile: BusinessUser) {
    let newProfile: BusinessUser = Object.assign([], profile)

    if (this.convertNullToEmpty) {
      if (profile.firstName == null) { newProfile.firstName = '' }
      if (profile.middleName == null) { newProfile.middleName = '' }
      if (profile.lastName == null) { newProfile.lastName = '' }
      if (profile.suffix == null) { newProfile.suffix = '' }
      if (profile.deleted == null) {newProfile.deleted = '' }
      if (profile.hasLogin == null) {newProfile.hasLogin = '' }
      if (profile.profilePicture == null) { newProfile.profilePicture = '' }

    }
    this.setProfile.emit(newProfile);
  }

  displayFn(user: any): string {
    
    if (user === null) {return ''}
    
    return user.fullName;
    
  }
}

