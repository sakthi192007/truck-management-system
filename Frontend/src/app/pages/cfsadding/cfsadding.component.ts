import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { BookingService } from '../bookingmodel/booking.service';
import { data } from 'jquery';

@Component({
  selector: 'app-cfsadding',
  templateUrl: './cfsadding.component.html',
  styleUrl: './cfsadding.component.css'
})
export class CfsaddingComponent {
  Cfsform!: FormGroup;
  buttontext: string = 'Submit';
  submitted = false;
  currentuser:any;
  userId:any;
  RoleId:any;
  constructor(private formBuilder: FormBuilder,private APIServies: BookingService, private router: Router,private authService:AuthService,private notifyService : NotificationService){
    this.Cfsform = this.formBuilder.group({
      cfs: this.formBuilder.control('', [Validators.required]),
      
    })
  }
  ngOnInit(): void {
    this.currentuser = this.authService.getCurrentuser();
    this.userId=this.currentuser.id;
    this.RoleId=this.currentuser.User_Roleid;
  }
  submit(){
    this.submitted = true;
    if (this.Cfsform.invalid) {
      return;
    }
    if(this.buttontext=='Submit'){
      
      let registerdata = this.Cfsform.value;

      let formvalues ={
        cfs :registerdata.cfs,
       
    }
    this.APIServies.insertcfs(formvalues).subscribe(data => {
      this.notifyService.showSuccess("CFS added successfully.", "CFS");
      this.Cfsform.reset();
      setTimeout(function () {
        window.location.reload();
      }, 2000);
  }, error => {
    this.notifyService.showError("Something went to wrong", "CFS");
  });
    }
  }
  get f() {
    return this.Cfsform.controls;
  }

}

