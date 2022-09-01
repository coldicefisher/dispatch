import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { AuthModule } from '../auth/auth.module';
import { SmartControlsModule } from '../smart-controls/smart-controls.module';

import { HomeComponent } from './components/home.component';
import { MiddleHomePanelComponent } from './components/middle-home-panel/middle-home-panel.component';
import { LeftHomePanelComponent } from './components/left-home-panel/left-home-panel.component';
import { RightHomePanelComponent } from './components/right-home-panel/right-home-panel.component'
import { HomeRoutingModule } from './home-routing.module';
import { UcWidgetModule } from 'ngx-uploadcare-widget';

import { FeedModule } from '../feed/feed.module';
import { BrowseBusinessesModule } from '../browse-businesses/browse-businesses.module';

@NgModule({
    imports: [
      CommonModule,
      SharedModule,
      SmartControlsModule,
      
      AuthModule,
      HomeRoutingModule,
      UcWidgetModule,

      FeedModule,
      BrowseBusinessesModule,
    ],

    declarations: [
      HomeComponent,

      LeftHomePanelComponent,
      RightHomePanelComponent,
      MiddleHomePanelComponent
    ],

    exports: [
      HomeComponent,

      LeftHomePanelComponent,
      RightHomePanelComponent,
      MiddleHomePanelComponent
    ],
    // bootstrap: [AddAddressComponent, CheckDeviceComponent],
    bootstrap: [ ],
    //entryComponents: [ CheckDeviceComponent, CheckPwdComponent, ComponentDirective ]
    entryComponents: [ ]
})
export class HomeModule {
  constructor() {}
}
