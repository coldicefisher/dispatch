import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { GoogleAutocompleteAddressComponent } from './google-autocomplete-address/google-autocomplete-address.component';
import { SearchProfilesComponent } from './search-profiles/search-profiles.component';
import { CheckBusinessNameComponent } from './check-business-name/check-business-name.component';
import { CheckEmailComponent } from './check-email/check-email.component';
import { CheckUsernameComponent } from './check-username/check-username.component';

@NgModule({
    imports: [
      CommonModule,
      SharedModule,

    ],

    declarations: [
      GoogleAutocompleteAddressComponent,
      SearchProfilesComponent,
      CheckBusinessNameComponent,
      CheckEmailComponent,
      CheckUsernameComponent,
    ],

    exports: [
      GoogleAutocompleteAddressComponent,
      SearchProfilesComponent,
      CheckBusinessNameComponent,
      CheckEmailComponent,
      CheckUsernameComponent,
    ],
    
    bootstrap: [ ],
    entryComponents: [ ]
})

export class SmartControlsModule {
  constructor() {}
}
