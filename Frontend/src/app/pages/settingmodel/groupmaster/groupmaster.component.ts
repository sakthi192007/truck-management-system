import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SettingService } from '../setting.service';

@Component({
  selector: 'app-groupmaster',
  templateUrl: './groupmaster.component.html',
  styleUrl: './groupmaster.component.css'
})
export class GroupmasterComponent implements OnInit {
  GroupMasterform!: FormGroup;
  checkboxError: boolean = false;
  submitted = false;
  buttontext = 'Submit';
  headertext = 'Create Group Master';
  role_id: any;
  groupmaster: any[] = [];
  groupmasterdetails: any;
  User_ID: any;
  getassignvalue: any;
  menunameoption: any[] = [];
  id: any;
  fromDate: any;
  toDate: any;
  searchTerm: any;
    roles:any;

     statusdatas:any;
  createstatus:any;
  viewstatus:any;
  statusupdate:any;
  statusdelete:any;
  statusapporval:any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private notifyService: NotificationService,
    private APIServies: SettingService
  ) {

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
  
   get filteredData() {
    if (!this.searchTerm && !this.fromDate && !this.toDate) {
      return this.groupmaster;
    }

    return this.groupmaster.filter(bird => {
      let matchesSearch = true;
      let matchesDateRange = true;

      // Filter by search term
      if (this.searchTerm) {
        matchesSearch = Object.values(bird).some(value =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      // Convert booking date to Date object
      const Createdon = new Date(bird.GM_CreatedOn);
      const from = this.fromDate ? new Date(this.fromDate) : null;
      const to = this.toDate ? new Date(this.toDate) : null;

      // Filter by date range
      if (from && Createdon < from) {
        matchesDateRange = false;
      }
      if (to && Createdon > to) {
        matchesDateRange = false;
      }

      return matchesSearch && matchesDateRange;
    });
  }

  ngOnInit(): void {
    this.User_ID = sessionStorage.getItem('id');
    this.role_id = sessionStorage.getItem('User_Roleid');
    this.GroupMasterform = this.formBuilder.group({
      checkboxes: this.formBuilder.array([], this.minSelectedCheckboxes(1)),
      GM_GroupName: ['', Validators.required],
      GM_Role: ['', Validators.required],
      GM_Description: [''],
    GM_Accessstatus1: [false], // Create
    GM_Accessstatus2: [false], // Update
    GM_Accessstatus3: [false], // View
    GM_Accessstatus4: [false], // Delete
    });
   
this.menunameoption = this.checkboxArray(this.menunameoption, 5);
this.accessstatus();
    this.Usergrid();
      this.getrole();
   // this.getloadmenuname();
  }
  accessstatus(){
const name='Groupmaster';
    this.APIServies.accessstatus(this.role_id,name).subscribe(value => {
      const statusvalues = value;
      this.statusdatas = statusvalues['data']
      this.createstatus=this.statusdatas[0].CanCreate;
      this.viewstatus=this.statusdatas[0].CanView;
      this.statusupdate=this.statusdatas[0].CanEdit;
      this.statusdelete=this.statusdatas[0].CanDelete;
      this.statusapporval=this.statusdatas[0].CanReport;
    })						
}
     getrole(){
       this.APIServies.GetRole(this.role_id).subscribe(value => {
         let rolevalue=value;
         this.roles=rolevalue['data'];
       })
    }
  checkboxArray(array: any[], size: number): any[][] {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
 
  minSelectedCheckboxes(min = 1) {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      const totalSelected = formArray.controls
        .map(ctrl => ctrl.value)
        .filter(value => value === true).length;

      return totalSelected >= min ? null : { required: true };
    };
  }
  // getloadmenuname(): void {
  //   this.APIServies.Loadmenuname().subscribe(value => {
  //     this.menunameoption = value['data'];
  //     const checkboxArray = this.formBuilder.array([]);
  //     this.menunameoption.forEach(() => checkboxArray.push(new FormControl(false)));
  //    this.GroupMasterform.setControl('checkboxes', new FormArray(checkboxArray.controls, this.minSelectedCheckboxes(1)));
  //     });
  // }

  getFormControl(index: number): FormControl {
    return (this.GroupMasterform.get('checkboxes') as FormArray).controls[index] as FormControl;
  }
  

  Usergrid(): void {
    this.checkboxError = true;
    this.APIServies.getallgroupmaster().subscribe(value => {
      this.groupmasterdetails = value;
      this.groupmaster = this.groupmasterdetails['data'] || [];

      this.groupmaster.forEach((element) => {
        if (element.GM_Role == 0) {
          element["spancolur"] = "badge badge-success";
          element["GM_Role"] = "Super Admin";
        }
        if (element.GM_Role == 5) {
          element["spancolur"] = "badge badge-success";
          element["GM_Role"] = "Admin";
        }
 if (element.GM_Role == 4) {
          element["spancolur"] = "badge badge-success";
          element["GM_Role"] = "Sub Admin";
        }
        if (element.GM_Role == 6) {
          element["spancolur"] = "badge badge-success";
          element["GM_Role"] = "User";
        }
        if (element.GM_Role == 1) {
          element["spancolur"] = "badge badge-primary";
          element["GM_Role"] = "Client";

        }
        if (element.GM_Role == 2) {
          element["spancolur"] = "badge badge-warning";
          element["GM_Role"] = "Vendor";
        }
        if (element.GM_Role == 3) {
          element["spancolur"] = "badge badge-info";
          element["GM_Role"] = "Organisation Admin";
        }
        if (element.GM_Role == 7) {
          element["spancolur"] = "badge badge-info";
          element["GM_Role"] = "Branch Admin";
        }
      });
    });
  }
  addnew(): void {
    this.GroupMasterform.reset();
    this.submitted = false;
    this.buttontext = 'Submit';
    this.headertext = 'Create Group Master';
  }
  closedriv(): void {
    $('#Deleterop').modal('hide');
  }

  closeback(): void {
    window.location.reload();
  }

  canceldriv(): void {
    $('#Deleterop').modal('hide');
  }

Assignvalueuser(Id: any): void {
  this.checkboxError = false;
  this.addnew();
  this.id = Id;
  this.headertext = 'Update Group Master';
  this.buttontext = 'Update';

  this.router.navigate(['/GroupmasterCreate'], {
    state: { id: Id, mode: 'update' }
  });

 
}




  Deleteroleuser(Id: any): void {
    this.id = Id;
  }

  deleteuser(): void {
    this.APIServies.deletegroupmaster(this.id).subscribe(
      res => {
        this.notifyService.showSuccess("Group Master deleted successfully.", "Group Master");
        $('#Deleterop').modal('hide');
        setTimeout(() => window.location.reload(), 2000);
      },
      error => {
        this.notifyService.showError("Something went wrong", "Group Master");
      }
    );
  }



  get f() {
    return this.GroupMasterform.controls;
  }
}

