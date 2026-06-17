import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { all_api_service } from 'src/app/service/all_api_service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  ChangePassword!: FormGroup;
  submitted = false;
  confirmPassword: string = '';
  currentuser: any;
  userid: any;
  User_ID: any;

  oldPasswordVisible: boolean = false;
  newPasswordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private ChangeServise: all_api_service,
    private notifyService: NotificationService
  ) {
    this.ChangePassword = this.formBuilder.group({
      oldpassword: ['', Validators.required],
      newpassword: [''],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.currentuser = this.authService.getCurrentuser();
    this.userid = this.currentuser.id;
    // Optionally call API to get old password
    // this.getoldpassd();
  }

  // Optional: Fetch existing password
  getoldpassd() {
    // Uncomment if needed
    // this.ChangeServise.getoldpaas(this.userid).subscribe((value) => {
    //   let data = value['data'];
    // });
  }

  toggleOldPasswordVisibility() {
    this.oldPasswordVisible = !this.oldPasswordVisible;
  }

  toggleNewPasswordVisibility() {
    this.newPasswordVisible = !this.newPasswordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  goBack() {
    window.history.back();
  }

  Save() {
    this.submitted = true;

    if (this.ChangePassword.invalid) {
      this.notifyService.showError("All fields are required!", "Change Password");
      return;
    }

    console.log('');

    const formData = this.ChangePassword.value;

    if (formData.newpassword !== formData.confirmPassword) {
      this.notifyService.showError("New passwords do not match!", "Change Password");
      return;
    }

  
    this.User_ID = sessionStorage.getItem('id');

    this.ChangeServise.changePassword(this.User_ID, formData).subscribe(
      () => {
        this.notifyService.showSuccess("Password changed successfully.", "Change Password");
        this.ChangePassword.reset();
        this.confirmPassword = '';
        this.submitted = false;
      },
      (error) => {
        console.error('Error changing password:', error);
        this.notifyService.showError("Something went wrong!", "Change Password");
      }
    );
  }
}
