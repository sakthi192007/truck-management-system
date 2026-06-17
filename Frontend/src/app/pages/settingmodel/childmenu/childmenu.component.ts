import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/service/notification.service';
import { SettingService } from '../setting.service';

@Component({
  selector: 'app-childmenu',
  templateUrl: './childmenu.component.html',
  styleUrl: './childmenu.component.css'
})
export class ChildmenuComponent implements OnInit{
ChildmenuForm!: FormGroup;
  submitted = false;
  buttontext = 'Submit';
  headertext = 'Create Childmenu';
  role_id: any;
  Childmenu: any[] = [];
  Childmenudetails: any;
  User_ID: any;
  getassignvalue: any;
  key: any;
  loadparentmenu: any;
  loadsubparentmenu:any;
  showSubmenu = false;
  searchTerm: any;
  fromDate: any;
  toDate: any;

   statusdatas:any;
  createstatus:any;
  viewstatus:any;
  statusupdate:any;
  statusdelete:any;
  statusapporval:any;

  constructor(
    private formBuilder: FormBuilder,
    private notifyService: NotificationService,
    private APIServies: SettingService
  ) {
  }

  ngOnInit(): void {
    this.User_ID = sessionStorage.getItem('id');
       this.role_id = sessionStorage.getItem('User_Roleid');
    this.ChildmenuForm = this.formBuilder.group({
      Menuname: ['', Validators.required],
      Pagename: ['', Validators.required],
      Parentmenuid: [0],
      SubParentid: [0],
      Menudescription: [''],
      Menulist: ['', Validators.required],
      Menuicon: ['']
    });
    this.accessstatus();
    this.Usergrid();
     this.getloadparentdropdown();

  }
accessstatus(){
const name='Childmenu';
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
//load parent menu
getloadparentdropdown() {
  this.APIServies.Loadparentmenu().subscribe(value => {
    this.loadparentmenu = value['data'];
  });
}

// Called when ParentMenu changes
onParentChange(event: any) {
const parentId = event.target.value;
  if (parentId && parentId !== '0') {
    this.getloaddropdown(parentId);
    this.showSubmenu = true;
  } else {
    this.showSubmenu = false;
  }
}
//load subparent
getloaddropdown(Id: any) {
  this.APIServies.Loadsubparentmenu(Id).subscribe(value => {
    this.loadsubparentmenu = value['data'];
  });
}
  ngAfterViewInit(): void {
    setTimeout(() => {
      (window as any).initDataTable();

      // Move DataTable buttons to left container
      const btns = document.querySelector('.dt-buttons');
      const btnTarget = document.getElementById('datatable-buttons');
      if (btns && btnTarget) {
        btnTarget.appendChild(btns);
      }

      // Move search box also to left side
      const search = document.querySelector('.dataTables_filter');
      const leftBox = document.querySelector('.left-search');
      if (search && leftBox) {
        leftBox.appendChild(search);

        (search as HTMLElement).style.marginTop = '5px';
      }

      // Optional: make search input small like date pickers
      const searchInput = document.querySelector('.dataTables_filter input') as HTMLInputElement;
      if (searchInput) {
        searchInput.classList.add('form-control', 'form-control-sm');
        searchInput.style.width = '200px';
        searchInput.style.marginLeft = '-5px';
      }

      const searchLabel = document.querySelector('.dataTables_filter label') as HTMLElement;
      if (searchLabel) {
        searchLabel.style.display = 'inline-flex';
        searchLabel.style.alignItems = 'center';
        const input = searchLabel.querySelector('input') as HTMLInputElement;
        if (input) {
          input.style.marginLeft = '5px';
        }
      }

    }, 1000);
  }
   get filteredData() {
    if (!this.searchTerm && !this.fromDate && !this.toDate) {
      return this.Childmenu;
    }

    return this.Childmenu.filter(bird => {
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
    this.APIServies.getallchildmenu().subscribe(value => {
      this.Childmenudetails = value;
      this.Childmenu = this.Childmenudetails['data'] || [];
    });

  }
  addnew(): void {
    this.ChildmenuForm.reset();
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
   this.showSubmenu = true;
  this.addnew();
  this.User_ID = Id;                 
  this.key = Id;                     
  this.headertext = 'Update Submenu';
  this.buttontext = 'Update';

  this.APIServies.getbyidchildmenu(this.User_ID).subscribe(value => {
    this.getassignvalue = value['data'];
    const formvalues = {
      Menuname: this.getassignvalue.Menuname,
      Parentmenuid: this.getassignvalue.Parentmenuid,
      SubParentid: this.getassignvalue.SubParentid,
      Pagename: this.getassignvalue.Pagename,
      Menudescription: this.getassignvalue.Menudescription,
      Menulist: this.getassignvalue.Menulist,
      Menuicon: this.getassignvalue.Menuicon
    };
    this.ChildmenuForm.patchValue(formvalues);
  });
}


  Deletechildmenu(Id: any): void {
    this.key = Id;
  }

  canceldriv(): void {
    $('#Deleterop').modal('hide');
  }

  deletesubmenu(): void {
    this.APIServies.deletechildmenu(this.key).subscribe(
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


    if (this.ChildmenuForm.invalid) {
      this.ChildmenuForm.markAllAsTouched();
       
      return;
    }

    const formValue = this.ChildmenuForm.value;

    const payload: any = {
      Menuname: formValue.Menuname,
      Parentmenuid:formValue.Parentmenuid ?? 0,
      SubParentid: formValue.SubParentid ?? 0,
      Pagename: formValue.Pagename,
      Menudescription: formValue.Menudescription,
      Menulist: formValue.Menulist,
      Menuicon: formValue.Menuicon
    };



    if (this.buttontext === 'Submit') {

      this.APIServies.insertchildmenu(payload).subscribe(
        data => {
          this.notifyService.showSuccess("Childmenu created successfully.", "childmenu");
          setTimeout(() => window.location.reload(), 2000);
        },
        error => {
          this.notifyService.showError("Something went wrong", "childmenu");
        }
      );

    } else {
      this.APIServies.Updatechildmenu(this.key, payload).subscribe(
        data => {
          this.notifyService.showSuccess("Childmenu updated successfully.", "childmenu");
          this.ChildmenuForm.reset();
          setTimeout(() => window.location.reload(), 2000);
        },
        error => {
          this.notifyService.showError("Something went wrong", "childmenu");
        }
      );
    }
  }


  shouldShowSubmitButton(): boolean {
    return true;
  }
  get f() {
    return this.ChildmenuForm.controls;
  }
}
