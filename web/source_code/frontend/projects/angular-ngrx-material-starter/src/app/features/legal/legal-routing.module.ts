import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { 
  PrivacyPolicyComponent, 
  TermsAndConditionsComponent,
  TestComponent,
} from './components/legal.component';

const routes: Routes = [
  {
    path: 'terms',
    component: TermsAndConditionsComponent,
  },
  
  {
    path: 'privacy',
    component: PrivacyPolicyComponent,
  },
  
  {
    path: 'test',
    component: TestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class LegalRoutingModule {}
