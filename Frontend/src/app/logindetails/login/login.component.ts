import { Component,EventEmitter, OnInit,Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { throwError,BehaviorSubject } from 'rxjs';
import { LoginRequest } from './login-interface';
import { LoginService } from './login.service';
import { QuoteService } from 'src/app/service/BehaviorSubjects.service';
import { UserService } from 'src/app/layout/user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loginFormControls: any;
  errorMsg: any = '';
  submitted =true;
  accesstoken:any;
  refreshtoken :any;
  userid:any;
  roleid:any;
  error: any;
    withoutparentmenu: any[] = [];
  withparentmenu: any[] = [];
  withchildmenu: any[] = [];
email: any;
CompanyName: any;
Image:any;
pswdType: string = 'password';
Companylogo:any;
UserName:any;
ProfileImage:any;
Branch_details:any;

@Output() loggedIn = new EventEmitter<void>();

  constructor(private quoteService: QuoteService,private loginService: LoginService,private fBuilder:FormBuilder, private activatedRoute: ActivatedRoute, private router: Router,private userService:UserService) {
    this.activatedRoute = activatedRoute;
  }

  ngOnInit(): void {
    this.loginService.logout();
    this.loginformInit();
  }
  loginformInit() {
    this.loginForm = this.fBuilder.group({
      email: this.fBuilder.control('', [Validators.required, Validators.email]),
      Password: this.fBuilder.control('', [Validators.required]),
    }
    );
    this.loginFormControls = this.loginForm.controls;
  }
  togglePasswordVisibility(): void {
    const pswdField = document.getElementById('pswd') as HTMLInputElement;
    if (pswdField) {
      this.pswdType = this.pswdType === 'password' ? 'text' : 'password';
      pswdField.type = this.pswdType;
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      alert('Invalid Credntials');
      return;
    }
    this.loginService.login(this.loginForm.value).subscribe(data => {
      this.accesstoken = data['accessToken'];
      this.refreshtoken = data['refreshToken'];
      this.userid = data['id'];
      this.roleid = data['User_Roleid'];
     this.CompanyName = data['CompanyName'];
     this.UserName = data['UserName'];
     this.Image = data['Image'];
     this.ProfileImage = data['ProfileImage'];
      this.withoutparentmenu = data.withoutparentmenu;
  this.withparentmenu = data.withparentmenu;
  this.withchildmenu=data.withchildmenu;
  this.Branch_details=data.Branch_details;

    

      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('id');
      sessionStorage.removeItem('User_Roleid');
      sessionStorage.removeItem('CompanyName');
      sessionStorage.removeItem('Image');
    sessionStorage.removeItem('withoutparentmenu');
      sessionStorage.removeItem('withparentmenu');
      sessionStorage.removeItem('withchildmenu');
      sessionStorage.removeItem('Branch_details');
      sessionStorage.removeItem('UserName');
      sessionStorage.removeItem('ProfileImage');

      sessionStorage.setItem('accessToken', this.accesstoken);
      sessionStorage.setItem('refreshToken', this.refreshtoken);
      sessionStorage.setItem('id', this.userid);
      sessionStorage.setItem('User_Roleid', this.roleid);
     sessionStorage.setItem('CompanyName', this.CompanyName);
     sessionStorage.setItem('UserName',  this.UserName);
     sessionStorage.setItem('Image', this.Image);
     sessionStorage.setItem('ProfileImage', this.ProfileImage);
     sessionStorage.setItem('Branch_details', this.Branch_details);
         sessionStorage.setItem('withoutparentmenu', JSON.stringify(this.withoutparentmenu));
      sessionStorage.setItem('withparentmenu', JSON.stringify(this.withparentmenu));
 sessionStorage.setItem('withchildmenu', JSON.stringify(this.withchildmenu));
      
      if (this.userid) {
           if (this.roleid==0) {
        this.quoteService.updateQuote('Login');
        this.userService.setUsername( this.CompanyName); 
        this.router.navigateByUrl('/AdminDashboard');
        this.loggedIn.emit();
      }else {
this.quoteService.updateQuote('Login');
        this.userService.setUsername( this.CompanyName); 
        this.router.navigateByUrl('/Dashboard');
        this.loggedIn.emit();
      }

        
      }
     
    },
      (error: any) => {
        this.error = 'true';
        console.log(error)
      }
    );
  }
  
}
