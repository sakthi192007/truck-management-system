

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
 import { SettingService } from '../setting.service';
 import { NotificationService } from 'src/app/service/notification.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/layout/user.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  fileName = 'No file chosen';
  profileImageSrc = '';
  successMessage: string = '';   
  role_id:any;
  userId:any;
  roles:any;
  User_ID:any;
  fileNames:any;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private router: Router,
    private profileService: SettingService,
    private notifyService: NotificationService,
    private userService:UserService
  ) {
    this.profileForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      contactNumber: [''],
      designation: [{ value: '', disabled: true }], 
      companyName: [{ value: '', disabled: true }],
      branchName: [{ value: '', disabled: true }],
      companyAddress: [{ value: '', disabled: true }],
      mailId: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
     this.role_id = sessionStorage.getItem('User_Roleid');
    this.userId = sessionStorage.getItem('id');
    this.getvalue();
  }
getvalue(){
  this.profileService.GetProfile(this.userId).subscribe(value => {
      let rolevalue = value;
      const datavalue = rolevalue['data'];
      this.roles=datavalue[0];
      let formvalues = {
        username: this.roles.UserName,
        mailId: this.roles.Email,
        contactNumber: this.roles.PhoneNumber,
        designation: this.roles.User_Roleid,
        companyName: this.roles.CompanyName,
        branchName: this.roles.BranchName,
        companyAddress: this.roles.Address,
       
      };
       this.User_ID = this.roles.User_ID;
         this.profileImageSrc = `${environment.APIEndpoint}ProfileImages/${this.roles.ProfileImage}`;
      this.profileForm.patchValue(formvalues);
    })
}
 

 onFileChange(event: any) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileName = file;
    }

     const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.fileNames = 'No file chosen';
      return;
    }

  const file = input.files[0];
    this.fileNames = file.name;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.profileImageSrc = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  submitProfile() {
    if (this.profileForm.invalid) {
      this.notifyService.showSuccess("User create successfully.", "UserDetails");
      return;
    }
this.role_id = sessionStorage.getItem('User_Roleid');
    this.userId = sessionStorage.getItem('id');

    
    const formData = new FormData();
    let registerdata = this.profileForm.value;
     formData.append('username',registerdata.username);
     formData.append('contactNumber',registerdata.contactNumber);
     formData.append('file',this.fileName);
    
this.profileService.profiledetails(formData, this.userId).subscribe({
  next: (data) => {
    this.notifyService.showSuccess("Profile Updated successfully.", "UserDetails");

    this.profileService.GetProfileimages(this.userId).subscribe({
      next: (value) => {
        const datavalue = value['data'];
        this.roles = datavalue[0];

        this.profileImageSrc = `${environment.APIEndpoint}ProfileImages/${this.roles.ProfileImage}`;
 sessionStorage.setItem('ProfileImage', this.roles.ProfileImage);
        this.userService.updateProfileImage(this.profileImageSrc);
      },
      error: () => {
        this.notifyService.showError("Unable to load updated profile image", "UserDetails");
      }
    });
  },
  error: () => {
    this.notifyService.showError("Something went wrong", "UserDetails");
  }
});

  }

  goBack() {
    if (this.profileForm.dirty) {
      const confirmLeave = confirm(' Unsaved changes will be lost. Do you really want to go back?');
      if (!confirmLeave) {
        return;
      }
    }
    this.location.back();
  }

  triggerFileSelect() {
    this.fileInput.nativeElement.click();
  }
}
