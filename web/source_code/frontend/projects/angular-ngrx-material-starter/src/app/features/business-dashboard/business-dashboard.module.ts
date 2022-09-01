import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { BusinessDashboardRoutingModule } from './business-dashboard-routing.module';
import { BusinessDashboardComponent } from './components/business-dashboard.component';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthModule } from '../auth/auth.module';
import { HumanResourcesComponent } from './components/human-resources/human-resources.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AddBusinessProfileComponent } from './components/user-management/add-business-profile.component';
import { EditProfilePermissionsComponent } from './components/user-management/edit-profile-permissions.component';
import { AssetsComponent } from './components/assets/assets.component';
import { DispatchingComponent } from './components/dispatching/dispatching.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { DeleteBusinessProfileComponent } from './components/user-management/user-management.component';
import { BusinessProfileComponent } from './components/business-profile/business-profile.component';
import { UpdateBusinessProfileComponent } from './components/business-profile/update-business-profile.component';
import { InsertBusinessProfileAddressComponent } from './components/business-profile/insert-business-profile-address.component';

import { CreateApplicationComponent } from './components/human-resources/components/create-application/create-application.component';
import { CreateApplication1Component } from './components/human-resources/components/create-application/create-application-1.component'
import { CreateApplication2Component } from './components/human-resources/components/create-application/create-application-2.component'
import { CreateApplication3Component } from './components/human-resources/components/create-application/create-application-3.component'
import { CreateApplication4Component } from './components/human-resources/components/create-application/create-application-4.component';
import { CreateApplication5Component } from './components/human-resources/components/create-application/create-application-5.component';
import { CreateApplication6Component } from './components/human-resources/components/create-application/create-application-6.component';

import { SelectTemplateComponent } from './components/human-resources/components/create-posting/select-template.component';
import { CreatePostingComponent } from './components/human-resources/components/create-posting/create-posting.component';

import { SmartControlsModule } from '../smart-controls/smart-controls.module';
import { UcWidgetModule } from 'ngx-uploadcare-widget';

@NgModule({
    imports: [
      CommonModule,
      SharedModule,
      SmartControlsModule,
      
      MatAutocompleteModule,
      MatDialogModule,
      MatExpansionModule,
      MatSidenavModule,
      AuthModule,
      BusinessDashboardRoutingModule,
      UcWidgetModule,
    ],

    declarations: [
      BusinessDashboardComponent,
      HumanResourcesComponent,
      
      AssetsComponent,
      DispatchingComponent,
      DashboardHomeComponent,

      UserManagementComponent,
      AddBusinessProfileComponent,
      EditProfilePermissionsComponent,
      DeleteBusinessProfileComponent,
      BusinessProfileComponent,

      UpdateBusinessProfileComponent,
      InsertBusinessProfileAddressComponent,

      CreateApplicationComponent,
      CreateApplication1Component,
      CreateApplication2Component,
      CreateApplication3Component,
      CreateApplication4Component,
      CreateApplication5Component,
      CreateApplication6Component,
      
      SelectTemplateComponent,
      CreatePostingComponent,
    ],

    exports: [

    ],
    // bootstrap: [AddAddressComponent, CheckDeviceComponent],
    bootstrap: [ ],
    //entryComponents: [ CheckDeviceComponent, CheckPwdComponent, ComponentDirective ]
    entryComponents: [ ]
})
export class BusinessDashboardModule {
  constructor() {}
}
