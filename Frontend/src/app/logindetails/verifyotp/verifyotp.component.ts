import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { throwError } from 'rxjs';
import { ForgotpasswordRequest } from '../login/login-interface';
import { LoginService } from '../login/login.service';
import { all_api_service } from 'src/app/service/all_api_service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-verifyotp',
  templateUrl: './verifyotp.component.html',
  styleUrl: './verifyotp.component.css'
})
export class VerifyotpComponent {
  verifyotp!: FormGroup;
  submitted = false;
  errorMsg: any = '';
  data:any='';
  useremail:any;
  logkey:any;
  

  constructor(private formBuilder: FormBuilder,private verifyotpservice: all_api_service, private activatedRoute: ActivatedRoute, private router: Router,private NotificationService :NotificationService) {
    this.activatedRoute = activatedRoute;
    this.useremail=history.state.data;
    this.verifyotp = this.formBuilder.group({
      OTP: this.formBuilder.control('', [Validators.required]),

    });
  }
  ngOnInit(): void {

  }
  onSubmit(){

    this.submitted = true;
    if(this.verifyotp.invalid)
    {
      alert('Invalid Credntials');
      return;
    }
    let registerdata = this.verifyotp.value;
    let Otp =registerdata.OTP


    this.verifyotpservice.verifyotp(Otp,this.useremail).subscribe(data => {

      this.logkey=data['logkey'];
      if(this.logkey==""||this.logkey==null){
        this.NotificationService.showError("OTP time expired", "Otp expired");
        this.router.navigateByUrl('/LinkExpired');
      }else{
        this.NotificationService.showSuccess("OTP validation success", "verify otp");
        this.router.navigate(['/ResetPassword'], {state: {data: this.logkey}});
      }
     
    })

  }
  get f() {
    return this.verifyotp.controls;
  }
}
