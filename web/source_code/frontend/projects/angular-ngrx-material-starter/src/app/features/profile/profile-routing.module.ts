import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { AddAddressComponent } from './components/add-address/components/add-address.component';
import { CreateBusinessComponent } from './components/create-business/create-business.component';
import { ProfileComponent } from './components/profile.component';
import { AuthGuardService } from '../../core/auth/auth-guard.service';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService]
    
  },
  
  // {
  //   path: 'add-address',
  //   component: AddAddressComponent,
  // },
  {
    path: 'create-business',
    component: CreateBusinessComponent,
    canActivate: [AuthGuardService]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class ProfileRoutingModule {}
