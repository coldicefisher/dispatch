import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from '../../core/auth/auth-guard.service';
import { HomeComponent } from './components/home.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  
];

RouterModule.forRoot(routes, { scrollOffset: [0, 0], scrollPositionRestoration: 'top' });

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HomeRoutingModule {}

