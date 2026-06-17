import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { all_api_service } from 'src/app/service/all_api_service';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/service/notification.service';
import { SettingService } from '../setting.service';
import {emailValidator} from 'src/app/core/gst-validator';
import { emailExistsValidatoruser} from 'src/app/core/email-vaildators';



@Component({
  selector: 'app-usercreation',
  templateUrl: './usercreation.component.html',
  styleUrl: './usercreation.component.css'
})
export class UsercreationComponent implements OnInit, AfterViewInit {
  clientform!: FormGroup;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  submitted = false;
  buttontext: string = 'Submit';
  headertext: string = 'Create User Details';
  role_id: any;
  userdata!: any[];
  userdatadetails: any;
  User_ID: any;
  updateuser: any;
  roles: any;
  selectCompany: any;
  rollname: any;
  emailid: any
  selectCompanyName: any;
  User_Roleid: any;
  UserName: any;
  userId: any;
  searchTerm: any;
  toDate: any;
  fromDate: any;
  Image: any;
  statuss: any;
  getuserrole:any;
  CompanyName:any;
  isSubmitted:any;

  statusdatas:any;
  createstatus:any;
  viewstatus:any;
  statusupdate:any;
  statusdelete:any;
  statusapporval:any;

  
  constructor(private formBuilder: FormBuilder, private APIServies: SettingService, 
    private router: Router, private authService: AuthService, private http: HttpClient, 
    private notifyService: NotificationService,private StatusAPI:SettingService) { 

     this.role_id = sessionStorage.getItem('User_Roleid');
    this.Image = sessionStorage.getItem('Image');
    this.CompanyName = sessionStorage.getItem('CompanyName');
    this.userId = sessionStorage.getItem('id');

    if(this.role_id=='3'){
   this.isSubmitted = false;
    }else{
   this.isSubmitted = true;
    }
  }

  ngOnInit(): void {
   
    this.clientform = this.formBuilder.group({
      role: this.formBuilder.control('', [Validators.required]),
      first_name: this.formBuilder.control(''),
      Password: this.formBuilder.control('', [Validators.required]),
      phno: this.formBuilder.control('', [Validators.required]),
      // email: ['', [Validators.required, Validators.email]],
       email: this.formBuilder.control(
             '',
             {
               validators: [Validators.required, emailValidator()],
               asyncValidators: [emailExistsValidatoruser(this.APIServies)],
               updateOn: 'blur' // ✅ important to trigger async validation on leaving the field
             }
           ),
     
      address: this.formBuilder.control(''),
      status: this.formBuilder.control('', [Validators.required]),
      description: this.formBuilder.control(''),
      Name: this.formBuilder.control(''),

    });
     this.accessstatus();
    this.Getrole();
    this.Usergrid();

  }
accessstatus(){
const name='User';
    this.StatusAPI.accessstatus(this.role_id,name).subscribe(value => {
      const statusvalues = value;
      this.statusdatas = statusvalues['data'];
      if(this.role_id==6){
this.createstatus=false;
      }else{
        this.createstatus=this.statusdatas[0].CanCreate;
      }
      this.viewstatus=this.statusdatas[0].CanView;
      this.statusupdate=this.statusdatas[0].CanEdit;
      this.statusdelete=this.statusdatas[0].CanDelete;
      this.statusapporval=this.statusdatas[0].CanReport;
    })
	
									
									
								
}
   ngAfterViewInit(): void {
  setTimeout(() => {
    (window as any).initDataTable();

    const btns = document.querySelector('.dt-buttons');
    const btnTarget = document.getElementById('datatable-buttons');
    if (btns && btnTarget) {
      btnTarget.appendChild(btns);
    }

    const search = document.querySelector('.dataTables_filter');
    const leftBox = document.querySelector('.left-search');
    if (search && leftBox) {
      leftBox.appendChild(search);

      const searchLabel = search.querySelector('label');
      if (searchLabel) {
        const input = searchLabel.querySelector('input');
        if (input) {
          search.appendChild(input);
          searchLabel.remove();
        }
      }

      const searchInput = search.querySelector('input') as HTMLInputElement;
      if (searchInput) {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = '200px';

        searchInput.classList.add('form-control', 'form-control-sm');
        searchInput.style.paddingLeft = '30px';
        searchInput.style.width = '100%';
        searchInput.placeholder = 'Search...';
        searchInput.style.border = '1px solid #007bff';

        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-search');
        icon.style.position = 'absolute';
        icon.style.left = '8px';
        icon.style.top = '50%';
        icon.style.transform = 'translateY(-50%)';
        icon.style.color = '#007bff';
        icon.style.pointerEvents = 'none';

        searchInput.parentNode?.insertBefore(wrapper, searchInput);
        wrapper.appendChild(searchInput);
        wrapper.appendChild(icon);
      }

      (search as HTMLElement).style.marginTop = '0';
    }
  }, 1000);
}

  applyDateFilter() {
    console.log("Applied Date Filter:", this.fromDate, "to", this.toDate);
  }

  setDateRange(range: string) {
    const today = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    switch (range) {
      case 'today':
        start = end = today;
        break;
      case 'yesterday':
        start = end = new Date(today);
        start.setDate(today.getDate() - 1);
        break;
      case 'last7':
        end = new Date();
        start = new Date();
        start.setDate(end.getDate() - 7);
        break;
      case 'last30':
        end = new Date();
        start = new Date();
        start.setDate(end.getDate() - 30);
        break;
      case 'last60':
        end = new Date();
        start = new Date();
        start.setDate(end.getDate() - 60);
        break;
    }

    if (start && end) {
      this.fromDate = start.toISOString().split('T')[0];
      this.toDate = end.toISOString().split('T')[0];
      this.applyDateFilter();
    }
  }

// 

  Getrole() {
    this.APIServies.GetRole(this.role_id).subscribe(value => {
      let rolevalue = value;
      this.roles = rolevalue['data'];
    })
  }

  get filteredData() {
    if (!this.searchTerm && !this.fromDate && !this.toDate) {
      return this.userdata;
    }

    return this.userdata.filter(bird => {
      let matchesSearch = true;
      let matchesDateRange = true;
      if (this.searchTerm) {
        matchesSearch = Object.values(bird).some(value =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      const createdOn = new Date(bird.createdOn);
      const from = this.fromDate ? new Date(this.fromDate) : null;
      const to = this.toDate ? new Date(this.toDate) : null;

      if (from && createdOn < from) {
        matchesDateRange = false;
      }
      if (to && createdOn > to) {
        matchesDateRange = false;
      }
      return matchesSearch && matchesDateRange;
    });
  }

  Usergrid() {
    this.APIServies.gridgetuser(this.userId, this.role_id).subscribe(value => {
      this.userdatadetails = value;
      this.userdata = this.userdatadetails['data'];
      this.userdata = this.userdata.map(element => ({
      ...element,
      statusname: element.StatusName,  
      spancolur: element.SpanColour    
    }));
    })
  }

  Resetdriver() {
    this.clientform.reset();
    this.buttontext = 'Submit';
  }

  Closedriv() {
    $("#Deleterop").modal("hide");
  }
  Closeback() {
    window.location.reload();
  }

  Canceldriv() {
    $("#Deleterop").modal("hide");
  }

  Reset() {
    this.clientform.reset();
    this.buttontext = 'Submit';
  }

  Assignvalueuser(DD_key: any) {
    this.Reset();
    this.User_ID = DD_key
    this.headertext = 'Update User Details';
    this.buttontext = 'Update';

    this.APIServies.GetUserdetails(this.User_ID).subscribe((value) => {
      this.updateuser = value['data'];

     let formvalues = {
        role: this.updateuser.User_Roleid,
        first_name: this.updateuser.UserName,
        Password: this.updateuser.Password,
        email: this.updateuser.Email,
        phno: this.updateuser.PhoneNumber,
        address: this.updateuser.Address,
        status: this.updateuser.status,
        description: this.updateuser.description
      };
      this.statuss = this.updateuser.status;
      this.User_ID = this.updateuser.User_ID;

       this.APIServies.GetRoleupdate(this.updateuser.User_Roleid).subscribe(value => {
      let rolevalue = value;
      this.roles = rolevalue['data'];
    })
this.clientform.patchValue({role:this.updateuser.User_Roleid})
      this.clientform.patchValue(formvalues);

     
setTimeout(() => {
  this.clientform.get('status')?.setValue(this.updateuser.status.toString());
}, 0);

     })
  }

  Deleteroleuser(DD_key: any) {
    this.User_ID = DD_key
  }

  Deleteuser() {
    this.APIServies.deleteuser(this.User_ID).subscribe(res => {
      this.notifyService.showSuccess("User details deleted successfully.", "User details");
      this.clientform.reset();
      $("#Deleterop").modal("hide");
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    },
      (error: any) => {
        this.notifyService.showError("Something went to wrong", "User details");
      })
  }

  get f() {
    return this.clientform.controls;
  }

  submit() {
    this.submitted = true;
        if (this.buttontext == 'Submit') {
    if (this.clientform.invalid) {
        return;
    }
  }
    this.role_id = sessionStorage.getItem('User_Roleid');
    this.userId = sessionStorage.getItem('id');
    this.CompanyName = sessionStorage.getItem('CompanyName');

    if (this.buttontext == 'Submit') {
      let registerdata = this.clientform.value;
      let formvalues = {
        role: registerdata.role,
        first_name: registerdata.first_name,
        Password: registerdata.Password,
        email: registerdata.email,
        phno: registerdata.phno,
        address: registerdata.address,
        status: registerdata.status,
        description: registerdata.description,
        CreatedBy: this.role_id.toString(),
        Clientid: this.userId,
        role_id: this.role_id,
        CompanyName: this.CompanyName,
        Image: this.Image
      }
      this.APIServies.insertuserdetails(formvalues).subscribe(data => {
        this.notifyService.showSuccess("User create successfully.", "UserDetails");
        this.clientform.reset();
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      }, error => {
        this.notifyService.showError("Something went to wrong", "UserDetails");
      });
    } else {
      let registerdata = this.clientform.value;
      let formvalues = {
        role: registerdata.role,
        first_name: registerdata.first_name,
        Password: registerdata.Password,
        email: registerdata.email,
        phno: registerdata.phno,
        address: registerdata.address,
        status: registerdata.status,
        description: registerdata.description,
        Clientid: this.role_id.toString(),
        Image: this.Image
      }
      this.APIServies.Updateuserdetails(this.User_ID, formvalues).subscribe(data => {
        this.notifyService.showSuccess("User Update successfully.", "UserDetails");
        this.clientform.reset();
        setTimeout(function () {
          window.location.reload();
        }, 2000);
      }, error => {
        this.notifyService.showError("Something went to wrong", "UserDetails");
      });
    }
  }

  shouldShowSubmitButton(): boolean {
    const status = this.clientform.get('status')?.value;
    const description = this.clientform.get('description')?.value;

    return status === '1' || (status === '0' && description && description.length > 0);
  }

  onStatusChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    if (selectedValue === '1') {
      this.clientform.get('description')?.reset();
    }
  }

  onDescriptionInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.clientform.get('description')?.setValue(inputElement.value);
  }

  

}
