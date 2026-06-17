import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterdataService } from '../MasterData.service';
import { NotificationService } from 'src/app/service/notification.service';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { SettingService } from '../../settingmodel/setting.service';
@Component({
  selector: 'app-subadmin',
  standalone: false,
  templateUrl: './subadmin.component.html',
  styleUrl: './subadmin.component.css',
})
export class SubadminComponent implements OnInit, AfterViewInit {
  clientform!: FormGroup;
  submitted = false;
  buttontext: string = 'Submit';
  headertext: string = 'Create User Details';
  userdata: any[] = [];
  userdatadetails: any;
  User_ID: any;
  role_id: any;
  currentuser: any;
  userId: any;
  subID:any;
  searchTerm: any;
  fromDate: any;
  toDate: any;
user:any;
branchs:any;
subAdmin:any;

statusdatas:any;
  createstatus:any;
  viewstatus:any;
  statusupdate:any;
  statusdelete:any;
  statusapporval:any;

  constructor(
    private formBuilder: FormBuilder,
    private APIServies: MasterdataService,
    private authService: AuthService,
    private notifyService: NotificationService, private router: Router,
    private StatusAPI:SettingService
  ) {}

  ngOnInit(): void {
     this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;
    this.role_id = sessionStorage.getItem('User_Roleid');
  this.accessstatus();
    this.Usergrid();
  }

accessstatus(){
const name='Branchgrid';
    this.StatusAPI.accessstatus(this.role_id,name).subscribe(value => {
      const statusvalues = value;
      this.statusdatas = statusvalues['data']
      this.createstatus=this.statusdatas[0].CanCreate;
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

  get f() {
    return this.clientform.controls;
  }

  Usergrid() {
    this.APIServies.getSubadminList(this.role_id,this.userId).subscribe((res) => {
      this.userdatadetails = res;
      this.userdata = this.userdatadetails.data || [];

      this.userdata.forEach((element) => {

         if (element.status == 0) {
            element["Exspancolur1"] = "badge badge-danger";
          element["Exstatusname1"] = "Inactive";
          

        } 
        else if (element.status == 1) {
           element["Exspancolur1"] = "badge badge-success";
          element["Exstatusname1"] = "Active";

        }

       
      });
    });
  }


  closedriv() {
    $('#Deleterop').modal('hide');
  }

  closeback() {
    window.location.reload();
  }

  canceldriv() {
    $('#Deleterop').modal('hide');
  }

  Assignvalueuser(sub_ID: any) {
    this.subID = sub_ID;
    this.APIServies.getSubadminById(this.subID).subscribe((res) => {
        this.branchs = res['branchAdmin'];
        this.subAdmin = res['subAdmins'];
        this.user = res['userDetails'];
     this.router.navigate(['/Branch'], {
        state: {
          Branchdata: this.branchs,
          Subdata: this.subAdmin,
          Userdata: this.user,
          views: '0',
        },
      });
    });
  }


  Deleteroleuser(sub_ID: any) {
    this.subID = sub_ID;
  }

  deleteuser() {
    this.APIServies.deleteSubadmin(this.subID).subscribe(
      () => {
        this.notifyService.showSuccess('User deleted successfully.', 'Success');
        $('#Deleterop').modal('hide');
        setTimeout(() => window.location.reload(), 2000);
      },
      () => {
        this.notifyService.showError('Something went wrong', 'Error');
      }
    );
  }
 



}
