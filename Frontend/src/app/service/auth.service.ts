import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from './apiservice';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private host = environment.APIEndpoint;
  currentuser: any;
  encryptSecretKey: any = '123456789asdfghjkl';
  constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute, private router: Router) {
  }

  getCurrentuser() {
    let currentUser = this.decodeUser();
    if (currentUser) {
      return currentUser;
    } else {
      return null;
    }
  }

  
  login(data: any) {
    let user = data;
    return this.apiService.postService(this.host + 'register/logins',  user )
      .pipe(map((user: any) => {

        if (user && user.response_message) {
          this.currentuser = user;
          this.encodeUser(user);
        }
        return user;
      }));
  }
  Forgotpassword(data: any) {
    let user = data;
    let response='';
    return this.apiService.postService(this.host + 'forgotpassword',  user )
      .pipe(map((user: any) => {
        if (user && user.response_message) {
          response=user.OTP+","+user.phonenumber
        }
        return user;
      }));
  }
  
  Resetpassword(data: any) {
    let user = data;
    return this.apiService.putService(this.host + 'validateotp/resetpassword',  user )
      .pipe(map((user: any) => {
        if (user && user.response_message) {
        }
        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    sessionStorage.clear();
    localStorage.clear();

  }

  private encodeUser(data: any) {
  
    const currentUser = CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
    sessionStorage.setItem('currentUser', currentUser);
    return currentUser;
  }

  private decodeUser() {
    let currentuser = sessionStorage.getItem('currentUser') as any;
    if (!currentuser) {
      return
    }
    const bytes = CryptoJS.AES.decrypt(currentuser, this.encryptSecretKey);
    if (bytes.toString()) {
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
  }
 
}
