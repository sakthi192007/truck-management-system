import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { throwError } from 'rxjs';
import { ForgotpasswordRequest } from '../login/login-interface';
import { LoginService } from '../login/login.service';
import { all_api_service } from 'src/app/service/all_api_service';
import { NotificationService } from 'src/app/service/notification.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  myform!: FormGroup;
  submitted = false;
  errorMsg: any = '';
  data:any='';
  useremail:any;
  

  constructor(private formBuilder: FormBuilder,private forgotpasswordservice: all_api_service, private activatedRoute: ActivatedRoute, private router: Router,private NotificationService :NotificationService) {
    this.activatedRoute = activatedRoute;
  }

  ngOnInit(): void {
    this.myform = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]]
    })
  }

  get f() { return this.myform.controls }
  onSubmit() {
    
    this.submitted = true;
    let registerdata = this.myform.value;
    let emailid =registerdata.Email
    this.forgotpasswordservice.Forgotpassword(emailid).subscribe(data => {
      this.NotificationService.showSuccess("Password reset details sent to your email id", "Forgot Password");
      this.useremail=emailid;
      this.router.navigate(['/verifyotp'], {state: {data: this.useremail}});
    })
  }
  
  
  navigateTo(url: string | UrlTree) {
    this.router.navigateByUrl(url);
    this.router.navigate([url], { state: { data:this.data }});
  }
}