import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusinessDashboardComponent } from './components/business-dashboard.component';
import { AuthGuardService } from '../../core/auth/auth-guard.service';

const routes: Routes = [
  {
    path: 'dashboard',
    component: BusinessDashboardComponent,
    canActivate: [AuthGuardService]
  },
  
];

RouterModule.forRoot(routes, { scrollOffset: [0, 0], scrollPositionRestoration: 'top' });

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BusinessDashboardRoutingModule {}

