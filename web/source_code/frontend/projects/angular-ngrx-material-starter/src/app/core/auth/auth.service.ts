import { HttpClient, HttpParams, HttpBackend } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';


import { Observable } from 'rxjs';

import { DeviceDetectorService } from "ngx-device-detector";
// import { Store } from '@ngrx/store';
// import { AppState } from '../core.module';

import { map, switchMap } from 'rxjs/operators';


@Injectable({providedIn: 'root' })
export class AuthService implements OnInit {
  
  constructor(
    private handler: HttpBackend,  
    private http: HttpClient,
      private deviceService: DeviceDetectorService,
      // private store: Store<AppState>,
      
    ) {
    this.http = new HttpClient(this.handler);
  }
  getState: Observable<any>;
  public ipAddress$: Observable<any>;
  ip: string;
  
  // PRODUCTION
  private BASE_URL = 'https://bizniz.io/api/login';
  // DEVELOPMENT
  //private BASE_URL = 'http://dispatch-auth-backend:8000';
  //private BASE_URL = 'http://localhost/api/login';
  
  
  
  ngOnInit() {
      
  }
  
  public deviceWithIp$(): Observable<any>{
    
    return this.http.get<any>("https://api.ipify.org/?format=json").pipe(
      map(res => {
        return this.getDeviceId(res.ip);
      })
    )   
  }

  
  getDeviceId(ip: string) {
    let deviceInfo = this.deviceService.getDeviceInfo();
    return '{device_type: ' + deviceInfo.deviceType + ', user_agent: ' + deviceInfo.userAgent + ', os: ' + deviceInfo.os + 
    ', os_version: ' + deviceInfo.os_version + ', browser_version: ' + deviceInfo.browser_version + ', is_desktop: ' + this.deviceService.isDesktop() + 
    ', is_tablet: ' + this.deviceService.isTablet() + ', is_mobile: ' + this.deviceService.isMobile() + `, ip: ${ip}` + '}';
  }

  getStatus(): Observable<any> {
    
    const url = `${this.BASE_URL}/status`;
    return this.http.get<any>(url);
  }

  getloginStatus(): string {
    return localStorage.getItem('loginStatus');
  }
  getUsername(): string {
    return localStorage.getItem('username');
  }

  checkDevice(username: string): Observable<any> {
    const url = `${this.BASE_URL}/`;
    //const d = await this.deviceWithIp$().toPromise()
    return this.deviceWithIp$().pipe(
      switchMap(res => {
          console.log(`Auth service: ${username}`);
        return this.http.post<any>(url, {username: username, device: res});
      })
    )
    
  }
  
  getOptions(username: string): Observable<any> {
    const url = `${this.BASE_URL}/send`;
    let params = new HttpParams().set('username', this.getUsername());
    return this.http.get<any>(url, { params: params });
  }
  
  sendCode(username: string, address: string): Observable<any> {
    const url = `${this.BASE_URL}/send`;
    return this.http.post<any>(url, { username: username, address: address });
  }

  otpVerify(username: string, otpCode: string, address: string): Observable<any> {
    const url = `${this.BASE_URL}/verify`;
    return this.http.post<any>(url, { username: username, otp: otpCode, address: address });
  }
  
  login(username: string, password: string, trustThis: string): Observable<any> {
    const url = `${this.BASE_URL}/authenticate`;
    return this.deviceWithIp$().pipe(
      switchMap(res => {
        return this.http.post<any>(url, { username: username, pwd: password, device: res, trust_this: trustThis });
        // return this.http.post<any>(url, {username: username, device: res})
      })
    )
    
  }
  
  logout(): Observable<any> {
    const url = `${this.BASE_URL}/logout`;
    return this.http.get<any>(url, {  });
  }
  
  signUp(username: string, password: string, firstName: string, lastName: string, email: string, phone: string, q1: string, a1: string, q2: string, a2: string): Observable<any> {
    const url = `${this.BASE_URL}/register`;
    return this.http.post<any>(url, { username: username, pwd: password, first_name: firstName, last_name: lastName, email: email, phone: phone, q1: q1, a1: a1, q2: q2, a2: a2 });
  }

  addAddress( address: string, username: string){
    const url = `${this.BASE_URL}/add-address`;
    return this.http.post<any>(url, { address: address, username: username })
  }

  retrieveUsernameSendCode( address: string){
    const url = `${this.BASE_URL}/retrieve-username`;
    return this.http.post<any>(url, { address: address, login_status: 'retrieve_username_start' })
  }

  retrieveUsernameVerifyCode( address: string, otpCode: string, loginStatus: string ){
    const url = `${this.BASE_URL}/retrieve-username`;
    return this.http.post<any>(url, { address: address, otp_code: otpCode, login_status: loginStatus });
    
  }

  retrieveUsernameVerifyQuestions( address: string, a1: string, a2: string, loginStatus: string ){
    const url = `${this.BASE_URL}/retrieve-username`;
    return this.http.post<any>(url, { address: address, a1: a1, a2: a2, login_status: loginStatus })
  }

  resetPasswordSendCode( address: string, username: string, loginStatus: string ){
    const url = `${this.BASE_URL}/reset-password`;
    return this.http.post<any>(url, { address: address, username: username, login_status: loginStatus });
  }

  resetPasswordResetPassword( password: string, otpCode: string, loginStatus: string, address: string, username: string ){
    const url = `${this.BASE_URL}/reset-password`;
    return this.http.post<any>(url, { address: address, username: username, login_status: loginStatus, otp_code: otpCode, password: password });
  }

  updatePassword( currentPassword: string, newPassword: string) {
    const url = `${this.BASE_URL}/change-password`;
    return this.http.post<any>(url, { current_password: currentPassword, new_password: newPassword });
  }
  
  deleteProfile() {
    const url = `${this.BASE_URL}/delete-profile`;
    return this.http.post<any>(url, {});
  }
}
