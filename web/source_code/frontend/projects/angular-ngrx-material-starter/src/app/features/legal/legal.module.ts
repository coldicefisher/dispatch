import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { SmartControlsModule } from '../smart-controls/smart-controls.module';

import { 
  TermsAndConditionsComponent, 
  PrivacyPolicyComponent,
  SignatureComponent,
  BusinessDisclaimerComponent,
  TestComponent,
  
} from './components/legal.component';


import { LegalRoutingModule } from './legal-routing.module';

@NgModule({
    imports: [
      CommonModule,
      SharedModule,

      LegalRoutingModule,

      SmartControlsModule,
    ],

    declarations: [
      PrivacyPolicyComponent,
      TermsAndConditionsComponent,
      SignatureComponent,
      BusinessDisclaimerComponent,
      TestComponent,
    ],

    exports: [
      PrivacyPolicyComponent,
      TermsAndConditionsComponent,
      SignatureComponent,
      BusinessDisclaimerComponent,

    ],
    bootstrap: [ ],
    entryComponents: [ ]
})

export class LegalModule {
  constructor() {}
}
