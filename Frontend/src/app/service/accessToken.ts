


import { AuthService } from 'src/app/service/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  public accessToken: string | null = null;

  constructor(private authservice: AuthService) {
    

  }
  get_toke(){
const token = this.authservice.getCurrentuser();
    this.accessToken = token?.accessToken || null;
    return this.accessToken
  }
}
