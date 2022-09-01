import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { AppState } from "../core.state";

import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from "@angular/router";

import { Observable } from "rxjs";

import { AuthService } from "./auth.service";
import { selectAuthIsAuthenticated } from "../core.module";
import { SocketService } from "../socket/socket.service";
import {actionBeginLogin } from "../auth/auth/actions";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  auth$: Observable<any>;
  constructor(
      private authService: AuthService,
      private router: Router,
      private store: Store<AppState>,
      // private socketService: SocketService,
    ) 
    {

    }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> | Observable<boolean> | boolean {
    this.auth$ = this.store.pipe(select(selectAuthIsAuthenticated));
    let a: boolean = false;
    this.auth$.subscribe(res => {
      a = res; 
    })
    if (!a) {
        
        // this.router.navigate(['login']);
        this.store.dispatch(actionBeginLogin());
        return false;
        
    }
    return true;
    
    
  }
}