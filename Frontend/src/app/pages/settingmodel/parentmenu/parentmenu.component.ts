import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SettingService } from '../setting.service';


@Component({
  selector: 'app-parentmenu',
  templateUrl: './parentmenu.component.html',
  styleUrl: './parentmenu.component.css'
})
export class ParentmenuComponent implements OnInit {
  ParentmenuForm!: FormGroup;
  submitted = false;
  buttontext = 'Submit';
  headertext = 'Create';
  role_id: any;
  parentmenu: any[] = [];
  parentmenudetails: any;
  User_ID: any;
  getassignvalue: any;
  key: any;
  fromDate: any;
  toDate:  any;
  searchTerm: any;

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
  ) { }

  ngOnInit(): void {
    this.User_ID = sessionStorage.getItem('id');
      this.role_id = sessionStorage.getItem('User_Roleid');
    this.ParentmenuForm = this.formBuilder.group({
      Menuname: ['', Validators.required],
      Menudescription: ['', Validators.required],
      Menulist: ['', Validators.required],
      Menuicon: ['', Validators.required],
    });
this.accessstatus();
    this.parentmenugrid();
  }

  accessstatus(){
const name='Parentmenu';
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
      return this.parentmenu;
    }

    return this.parentmenu.filter(bird => {
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

  parentmenugrid(): void {
    this.APIServies.getallparentmenu().subscribe(value => {
      this.parentmenudetails = value;
      this.parentmenu = this.parentmenudetails['data'] || [];
    });
  }
  addnew(): void {
    this.ParentmenuForm.reset();
    this.submitted = false;
    this.buttontext = 'Submit';
    this.headertext = 'Create Parent Menu';
  }
  //for popup to  hide//
  closedriv(): void {
    $('#Deleterop').modal('hide');
  }
  //back button//
  closeback(): void {
    window.location.reload();
  }
  //for  delete //
  canceldriv(): void {
    $('#Deleterop').modal('hide');
  }

  Assignvalueparentmenu(Id: any): void {
    this.addnew();
    this.key = Id;
    this.headertext = 'Update Parentmenu Details';
    this.buttontext = 'Update';

    this.APIServies.getbyidparentmenu(this.key).subscribe(value => {
      this.getassignvalue = value['data'];
      const formvalues = {
        Menuname: this.getassignvalue.Menuname,
        Menudescription: this.getassignvalue.Menudescription,
        Menulist: this.getassignvalue.Menulist,
        Menuicon: this.getassignvalue.Menuicon
      };
      this.ParentmenuForm.patchValue(formvalues);
    });
  }

  Deleterolemenu(Id: any): void {
    this.key = Id;
  }

  deletemenu(): void {
    this.APIServies.deleteparentmenu(this.key).subscribe(
      res => {
        this.notifyService.showSuccess("User details deleted successfully.", "User details");
        $('#Deleterop').modal('hide');
        setTimeout(() => window.location.reload(), 2000);
      },
      error => {
        this.notifyService.showError("Something went wrong", "User details");
      }
    );
  }

  icon() {
    const baseUrl = window.location.origin;
    const newTabUrl = `${baseUrl}/#/Icon`;
    window.open(newTabUrl, '_blank');
  }
  submit(): void {
    this.submitted = true;
    if (this.ParentmenuForm.invalid) {
      return;
    }

    const formValue = this.ParentmenuForm.value;

    const payload: any = {
      Menuname: formValue.Menuname,
      Menudescription: formValue.Menudescription,
      Menulist: formValue.Menulist,
      Menuicon: formValue.Menuicon
    };

    if (this.buttontext === 'Submit') {

      this.APIServies.insertparentmenu(payload).subscribe(
        data => {
          this.notifyService.showSuccess("Parentmenu created successfully.", "Parentmenu");
          setTimeout(() => window.location.reload(), 2000);
        },
        error => {
          this.notifyService.showError("Something went wrong", "Parentmenu");
        }
      );
    } else {
      this.APIServies.Updateparentmenu(this.key, payload).subscribe(
        data => {
          this.notifyService.showSuccess("Parentmenu updated successfully.", "Parentmenu");
          this.ParentmenuForm.reset();
          setTimeout(() => window.location.reload(), 2000);
        },
        error => {
          this.notifyService.showError("Something went wrong", "Parentmenu");
        }
      );
    }
  }


  shouldShowSubmitButton(): boolean {
    return true;
  }

  get f() {
    return this.ParentmenuForm.controls;
  }
}


