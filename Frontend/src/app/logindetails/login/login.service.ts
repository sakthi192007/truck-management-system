import { Injectable } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { LoginRequest } from './login-interface';
import {ForgotpasswordRequest} from './login-interface'
import {ResetpassworddRequest} from './login-interface'
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private authService: AuthService) { }

  public login(userdata:LoginRequest){
    return this.authService.login(userdata);
  }
  public Forgotpassword(userdata:ForgotpasswordRequest){
    return this.authService.Forgotpassword(userdata);
  }
  public Resetpassword(userdata:ResetpassworddRequest){
    return this.authService.Resetpassword(userdata);
  }
  public logout(){
    return this.authService.logout();
  }

}
