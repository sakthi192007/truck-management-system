import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SettingService } from '../setting.service';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrl: './submenu.component.css'
})
export class SubmenuComponent implements OnInit {
  SubmenuForm!: FormGroup;
  submitted = false;
  buttontext = 'Submit';
  headertext = 'Create Submenu';
  role_id: any;
  Submenu: any[] = [];
  Submenudetails: any;
  User_ID: any;
  getassignvalue: any;
  key: any;
  loadparentmenu: any;
  fromDate: any;
  searchTerm: any;
  toDate: any;

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

  ngOnInit(): void {
    this.User_ID = sessionStorage.getItem('id');
       this.role_id = sessionStorage.getItem('User_Roleid');
    this.SubmenuForm = this.formBuilder.group({
      Menuname: ['', Validators.required],
      Pagename: [''],
      Parentmenuid: [0],
      Menudescription: [''],
      Menulist: ['', Validators.required],
      Menuicon: ['']
    });
    this.accessstatus();
    this.Usergrid();
    this.getloaddropdown();

  }
accessstatus(){
const name='Submenu';
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
  getloaddropdown() {
    this.APIServies.Loadparentmenu().subscribe(value => {
      this.loadparentmenu = value['data'];

    });
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
      return this.Submenu;
    }

    return this.Submenu.filter(bird => {
      let matchesSearch = true;
      let matchesDateRange = true;

      // Filter by search term
      if (this.searchTerm) {
        matchesSearch = Object.values(bird).some(value =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      // Convert booking date to Date object
      const Createdon = new Date(bird.Createdon);
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
  Usergrid(): void {
    this.APIServies.getallsubmenu().subscribe(value => {
      this.Submenudetails = value;
      this.Submenu = this.Submenudetails['data'] || [];
    });

  }
  addnew(): void {
    this.SubmenuForm.reset();
    this.submitted = false;
    this.buttontext = 'Submit';
    this.headertext = 'Create SubMenu';
  }
  closedriv(): void {
    $('#Deleterop').modal('hide');
  }

  closeback(): void {
    window.location.reload();
  }
  icon() {
    const baseUrl = window.location.origin;
    const newTabUrl = `${baseUrl}/#/Icon`;
    window.open(newTabUrl, '_blank');
  }

 Assignvaluemenu(Id: any): void {
  this.addnew();
  this.User_ID = Id;                 
  this.key = Id;                     
  this.headertext = 'Update Submenu';
  this.buttontext = 'Update';

  this.APIServies.getbyidsubmenu(this.User_ID).subscribe(value => {
    this.getassignvalue = value['data'];
    const formvalues = {
      Menuname: this.getassignvalue.Menuname,
      Parentmenuid: this.getassignvalue.Parentmenuid,
      Pagename: this.getassignvalue.Pagename,
      Menudescription: this.getassignvalue.Menudescription,
      Menulist: this.getassignvalue.Menulist,
      Menuicon: this.getassignvalue.Menuicon
    };
    this.SubmenuForm.patchValue(formvalues);
  });
}


  Deletesubmenu(Id: any): void {
    this.key = Id;
  }

  canceldriv(): void {
    $('#Deleterop').modal('hide');
  }

  deletesubmenu(): void {
    this.APIServies.deletesubmenu(this.key).subscribe(
      res => {
        this.notifyService.showSuccess("Submenu deleted successfully.", "Submenu");
        $('#Deleterop').modal('hide');
        setTimeout(() => window.location.reload(), 2000);
      },
      error => {
        this.notifyService.showError("Something went wrong", "Submenu");
      }
    );
  }

  submit(): void {
    this.submitted = true;


    if (this.SubmenuForm.invalid) {
      this.SubmenuForm.markAllAsTouched();
     
      return;
    }

    const formValue = this.SubmenuForm.value;

    const payload: any = {
      Menuname: formValue.Menuname,
      Parentmenuid: formValue.Parentmenuid ?? 0,
      Pagename: formValue.Pagename,
      Menudescription: formValue.Menudescription,
      Menulist: formValue.Menulist,
      Menuicon: formValue.Menuicon
    };



    if (this.buttontext === 'Submit') {

      this.APIServies.insertsubmenu(payload).subscribe(
        data => {
          this.notifyService.showSuccess("Submenu created successfully.", "Submenu");
          setTimeout(() => window.location.reload(), 2000);
        },
        error => {
          this.notifyService.showError("Something went wrong", "Submenu");
        }
      );

    } else {
      this.APIServies.Updatesubmenu(this.key, payload).subscribe(
        data => {
          this.notifyService.showSuccess("Submenu updated successfully.", "Submenu");
          this.SubmenuForm.reset();
          setTimeout(() => window.location.reload(), 2000);
        },
        error => {
          this.notifyService.showError("Something went wrong", "Submenu");
        }
      );
    }
  }


  shouldShowSubmitButton(): boolean {
    return true;
  }
  get f() {
    return this.SubmenuForm.controls;
  }
}

