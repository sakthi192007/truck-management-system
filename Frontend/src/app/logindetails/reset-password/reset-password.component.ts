import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { throwError } from 'rxjs';
import { ForgotpasswordRequest } from '../login/login-interface';
import { LoginService } from '../login/login.service';
import { all_api_service } from 'src/app/service/all_api_service';
import { NotificationService } from 'src/app/service/notification.service';
import { MustMatch } from '../../model/must-match.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetpassword!:FormGroup;
  submitted = false;
  //password: string = '';
  //confpassword: string = '';
  passwordVisible: boolean = false;
  ConpasswordVisible: boolean = false;
  logkey:any;

  
  constructor(private formBuilder: FormBuilder,private resetpasswordservice: all_api_service, private activatedRoute: ActivatedRoute, private router: Router,private NotificationService :NotificationService) {
    this.logkey=history.state.data

    this.resetpassword = this.formBuilder.group({
     
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required],
     
  }, {
      validator: MustMatch('password', 'confirmPassword')
  });

  if(this.logkey==""||this.logkey==null)
    {
      this.router.navigateByUrl('/LinkExpired');
    }
   }
  ngOnInit(): void {
  }
  get f() { return this.resetpassword.controls; }
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
togglePassword():void{
  this.ConpasswordVisible = !this.ConpasswordVisible;
}
submit(){
  this.submitted = true;
  let registerdata = this.resetpassword.value;
  let confirmPassword =registerdata.confirmPassword
  let password =registerdata.password;

  if(this.resetpassword.invalid)
  {
    alert('Invalid Credntials');
    return;
  }
  

  this.resetpasswordservice.resetpassword(confirmPassword,this.logkey).subscribe(data => {
    this.NotificationService.showSuccess("Password will be changed", "ResetPassword");
    this.router.navigateByUrl('/Login');
  }, error => {
    this.NotificationService.showError("Something went to wrong", "ResetPassword");
  })
}
}
