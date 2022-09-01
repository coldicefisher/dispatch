import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import { httpLoaderFactory } from "../../../core/core.module";


@Injectable()
export class SinglePostResolver implements Resolve<any>{

  constructor(
     


  ){

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
     // In my case i am using custom service for getting rest calls but you can use simple http.get()...
    return;

  }
}