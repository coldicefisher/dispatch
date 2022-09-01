import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { 
  CreateBusinessComponent,
  CreateBusiness1Component,
  CreateBusiness2Component,
  CreateBusiness3Component,
  CreateBusiness4Component,
  CreateBusiness5Component,
} from './components/create-business/create-business.component';

import { AddAddressComponent } from './components/add-address/components/add-address.component';
import { 
  WorkHistoryComponent,
  UpdateWorkHistoryComponent, 
  InsertWorkHistoryComponent,
  
} 
from './components//work-history/work-history.component';

import {
  AddressHistoryComponent, 
  InsertAddressHistoryComponent, 
  UpdateAddressHistoryComponent,
  
}
from'./components/address-history/address-history.component';

import { ChangePasswordComponent } from './components/change-password/change-password.component';

import { 
  ProfileComponent,
  UpdateProfileComponent,
  DeleteProfileComponent,
} from './components/profile.component';

import { LegalModule } from '../legal/legal.module';

import { ProfileRoutingModule } from './profile-routing.module';

// import {MatAutocompleteModule} from '@angular/material/autocomplete';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatExpansionModule } from '@angular/material/expansion';

import { AuthModule } from '../auth/auth.module';

import { UcWidgetModule } from 'ngx-uploadcare-widget';
import { 
  PrivacySettingsComponent, 
  UpdatePrivacySettingsComponent 
} from './components/privacy-settings/privacy-settings.component';

import { BusinessesSummaryComponent } from './components/businesses-summary/businesses-summary.component';

import { SmartControlsModule } from '../smart-controls/smart-controls.module';

@NgModule({
    imports: [
      CommonModule,
      SharedModule,
      
      ProfileRoutingModule,

      // MatAutocompleteModule,
      // MatDialogModule,
      // MatExpansionModule,

      AuthModule,
      UcWidgetModule,
      LegalModule,

      SmartControlsModule,
    ],

    
    declarations: [
      AddAddressComponent,
      
      ProfileComponent,
      UpdateProfileComponent,
      DeleteProfileComponent,
      
      WorkHistoryComponent,
      InsertWorkHistoryComponent,
      UpdateWorkHistoryComponent,
      
      AddressHistoryComponent,
      InsertAddressHistoryComponent,
      UpdateAddressHistoryComponent,
      ChangePasswordComponent,

      PrivacySettingsComponent,
      UpdatePrivacySettingsComponent,

      BusinessesSummaryComponent,

      CreateBusinessComponent,
      CreateBusiness1Component,
      CreateBusiness2Component,
      CreateBusiness3Component,
      CreateBusiness4Component,
      CreateBusiness5Component
      
    ],

    exports: [
      ProfileComponent,
      WorkHistoryComponent,
      AddressHistoryComponent,

    ],
    bootstrap: [ ],
    entryComponents: [ ]
})
export class ProfileModule {
  constructor() {}
}
