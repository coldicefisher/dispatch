import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { BusinessDetailComponent } from './features/browse-businesses/components/business-detail/business-detail.component';


const routes: Routes = [
  
  { path: 'about', loadChildren: () => 
    import('./features/about/about.module').then(
      (m) => m.AboutModule
    )

  },
  { path: 'feature-list', loadChildren: () =>
      import('./features/feature-list/feature-list.module').then(
        (m) => m.FeatureListModule
      )
  },
  { path: 'login', loadChildren: () =>
    import('./features/auth/auth.module').then(
      (m) => m.AuthModule
    )
},
  { path: 'settings', loadChildren: () =>
      import('./features/settings/settings.module').then(
        (m) => m.SettingsModule
      )
  },
  { path: 'examples', loadChildren: () =>
      import('./features/examples/examples.module').then(
        (m) => m.ExamplesModule
      )
  },
  { path: 'dashboard', loadChildren: () =>
    import('./features/business-dashboard/business-dashboard.module').then(
        (m) => m.BusinessDashboardModule
      )
  },
  { path: 'home', loadChildren: () => 
    import('./features/home/home.module').then(
      (m) => m.HomeModule
    )
  },
  {
    path: 'business/:id',
    component: BusinessDetailComponent
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
