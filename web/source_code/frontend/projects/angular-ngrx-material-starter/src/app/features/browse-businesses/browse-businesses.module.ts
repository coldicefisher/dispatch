import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { AuthModule } from '../auth/auth.module';
import { SmartControlsModule } from '../smart-controls/smart-controls.module';


import { BrowseBusinessesComponent } from './components/browse-businesses.component';
import { BusinessDetailComponent } from './components/business-detail/business-detail.component';

@NgModule({
    imports: [
      CommonModule,
      SharedModule,
      SmartControlsModule,
      
      AuthModule,
      
    ],

    declarations: [
      BrowseBusinessesComponent,
      BusinessDetailComponent,
    ],

    exports: [
      BrowseBusinessesComponent,
      BusinessDetailComponent,
    ],
    // bootstrap: [AddAddressComponent, CheckDeviceComponent],
    bootstrap: [ ],
    //entryComponents: [ CheckDeviceComponent, CheckPwdComponent, ComponentDirective ]
    entryComponents: [ ]
})
export class BrowseBusinessesModule {
  constructor() {}
}
