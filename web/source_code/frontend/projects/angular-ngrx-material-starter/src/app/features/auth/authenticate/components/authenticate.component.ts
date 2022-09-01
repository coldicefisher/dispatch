import { 
  Component, 
  ViewChild, 
  ComponentFactoryResolver, 
  ViewContainerRef, 
  ChangeDetectionStrategy, 
  OnInit,
  OnDestroy,
  AfterViewInit,
  AfterContentInit,
  Directive
  
} from '@angular/core';

import { Observable } from 'rxjs';

import { selectAuth } from '../../../../core/core.module';

import { AddAddressComponent } from '../../add-address/components/add-address.component';
import { CheckDeviceComponent } from '../../check-device/components/check-device.component';
import { CheckPwdComponent } from '../../check-pwd/components/check-pwd.component';
import { OtpOptionsComponent } from '../../otp-options/components/otp-options.component';
import { OtpVerifyComponent } from '../../otp-verify/components/otp-verify.component';
// import { ResetUsernameComponent } from '../../reset-username/components/reset-username.component';

import { ComponentDirective } from '../component-item';

import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/core.module';


@Component({
  selector: 'bizniz-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuthenticateComponent implements AfterContentInit, OnDestroy  {
  //@ViewChild(ComponentDirective, {static: true}) componentHost!: ComponentDirective;
  @ViewChild('dynamicInsert', { read: ViewContainerRef, static: true }) vc: ViewContainerRef;
  
  public components = [CheckDeviceComponent, OtpOptionsComponent];
  public currentComponent = null;
  authState$: Observable<any>;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private store: Store<AppState>,

  )
  { }

  
  ngOnDestroy() {
    console.log('Destroyed');
  }
    
  ngAfterContentInit(): void {
    
    this.authState$ = this.store.pipe(select(selectAuth));
    this.authState$.subscribe((state) => {
      switch (state.loginStatus) {
        
        case "not_trusted_not_authenticated":
          this.loadComponent('checkDevice');
          break;

        case "trusted_not_authenticated":
          this.loadComponent('checkDevice');
          break;

        default:
          this.loadComponent('checkDevice');
          break;

      }
    });
    
  }

  loadComponent (componentName: string) {
    //const viewContainerRef = this.viewContainerRef;
    //viewContainerRef.clear()
    let cFactory = this.componentFactoryResolver.resolveComponentFactory(CheckDeviceComponent);
    switch (componentName) { 
      
    case 'checkDevice':
      cFactory = this.componentFactoryResolver.resolveComponentFactory(CheckDeviceComponent);
      break;
    default:
      cFactory = this.componentFactoryResolver.resolveComponentFactory(CheckDeviceComponent);
      break;
    }
    this.vc.clear();
    this.vc.createComponent(cFactory, 0);
    document.getElementById("username").focus();
    
  }
}
  


