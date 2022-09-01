import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';


//import { BusinessDashboardComponent } from './features/business-dashboard/business-dashboard.component';
// import { AuthModule } from './features/auth/auth.module';

@NgModule({
  imports: [
    // angular
    BrowserAnimationsModule,
    BrowserModule,
//    FormsModule,
    
    // core
    CoreModule,
    SharedModule,

    // app
    AppRoutingModule,

  ],
  declarations: [AppComponent,
    // BusinessDashboardComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
