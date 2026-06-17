import { Component } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { all_api_service } from 'src/app/service/all_api_service';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { CampaigntextService } from './campaign-chat.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-campaign-chat',
  templateUrl: './campaign-chat.component.html',
  styleUrl: './campaign-chat.component.css'
})

export class CampaignChatComponent {
  Campaignform!: FormGroup;
  buttontext: string = 'Submit';
  submitted = false;
  currentuser: any;
  userId: any;
  RoleId: any;
  selectedCMKey: any;
  messages: any;
  id: any;
    CC_id: any; 
  getcommentmessage: any;
  Comments: any;
  constructor(
    private formBuilder: FormBuilder,
    private Apiservices: CampaigntextService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private notifyService: NotificationService
  ) {
    this.Campaignform = this.formBuilder.group({
      Comments: this.formBuilder.control('', [Validators.required]),

    })
  }
  ngOnInit(): void {
     //this.getMessages();
  }
 getMessages() {
    this.id = this.CC_id; 
    this.Apiservices.getComments(this.id).subscribe((value: any) => {
      this.Comments = value;
      this.getcommentmessage = this.Comments['data'];
    });
  }
 submit() {
  this.submitted = true;
  if (this.Campaignform.invalid) {
    return;
  }

  if (this.buttontext === 'Submit') {
    let formvalues = {
      //CM_key: this.selectedCMKey,
       
      Comments: this.Campaignform.value.Comments
    };

    this.Apiservices.insertComments(formvalues).subscribe(data => {
      this.notifyService.showSuccess("Comment added successfully.", "Comment");
      this.Campaignform.reset();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }, error => {
      this.notifyService.showError("Something went wrong", "CFS");
    });
  }
}

  get f() {
    return this.Campaignform.controls;
  }
}
