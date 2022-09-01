import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { AuthModule } from '../auth/auth.module';
import { SmartControlsModule } from '../smart-controls/smart-controls.module';

import { FeedComponent } from './components/feed.component'
@NgModule({
    imports: [
      CommonModule,
      SharedModule,
      SmartControlsModule,
      
      AuthModule,
      
    ],

    declarations: [
      FeedComponent
    ],

    exports: [
      FeedComponent
    ],
    // bootstrap: [AddAddressComponent, CheckDeviceComponent],
    bootstrap: [ ],
    //entryComponents: [ CheckDeviceComponent, CheckPwdComponent, ComponentDirective ]
    entryComponents: [ ]
})
export class FeedModule {
  constructor() {}
}
