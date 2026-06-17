import { Component, ViewChild,AfterViewInit } from '@angular/core';
import { VendorService } from '../vendor.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
declare var $: any;
import { NotificationService } from 'src/app/service/notification.service';
import { DataTableDirective } from 'angular-datatables';
import { SettingService } from '../../settingmodel/setting.service';
@Component({
  selector: 'app-vendor-creation-grid',
 
  templateUrl: './vendor-creation-grid.component.html',
  styleUrl: './vendor-creation-grid.component.css'
})
export class VendorCreationGridComponent implements AfterViewInit{
  @ViewChild(DataTableDirective, { static: false })
  tabledetail: any;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  searchTerm: any;
  fromDate: any;
  toDate: any;
  constructor(private APIServies: VendorService, private router: Router,
    private notifyService : NotificationService,private StatusAPI:SettingService) {}
  reloaded= false;
  Success = 'false';
  error = 'false';
    errortext: string = "";
    successtext: any = '';
  tablegridview!:any[];
  tablegridviews:any;
  allvendordetaildata:any;
  buttontext: string = '';
  CD_ID: any;
  vendorId : any;
  vehiclenum: any;
  vendordata:any;
  vendorselect:any;
  user_id:any;
  role_id:any;

statusdatas:any;
  createstatus:any;
  viewstatus:any;
  statusupdate:any;
  statusdelete:any;
  statusapporval:any;

  
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

 get filteredData() {
  if (!this.searchTerm && !this.fromDate && !this.toDate) {
    return this.tablegridview;
  }

  return this.tablegridview.filter(bird => {
    let matchesSearch = true;
    let matchesDateRange = true;

    // 🔎 Search filter
    if (this.searchTerm) {
      matchesSearch = Object.values(bird).some(value =>
        value != null &&
        String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // 🔎 Date filter (check if CreatedOn exists)
    if (bird.createdOn) {
      const createdOn = new Date(bird.createdOn);
      const from = this.fromDate ? new Date(this.fromDate) : null;
      const to = this.toDate ? new Date(this.toDate) : null;

      if (from && createdOn < from) {
        matchesDateRange = false;
      }
      if (to && createdOn > to) {
        matchesDateRange = false;
      }
    }

    return matchesSearch && matchesDateRange;
  });
}
  ngOnInit(): void {

    this.user_id = sessionStorage.getItem('id');
    this.role_id = sessionStorage.getItem('User_Roleid');
   this.accessstatus();
    this.getallgrid();
  }
  accessstatus(){
const name='VendorDetails';
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
  refresh() {
    if (!this.reloaded) {
      window.location.href = window.location.href; 
      this.reloaded = true; 
    }
  }
  getallgrid()
  {
    this.APIServies.ventorGrid(this.user_id,this.role_id).subscribe(value => {
      this.tablegridviews = value;
      this.tablegridview = this.tablegridviews['data']
      this.tablegridview.forEach(element => {
        if (element.status == 1) {
          element["spancolur1"] = "badge badge-success";
          element["statusname1"] = "Active";
  
          
        } else if (element.status == 0) {
          element["spancolur1"] = "badge badge-danger";
          element["statusname1"] = "In Active";
        
        }
      })
      this.dtTrigger.next(this.tablegridview); 
   
    });
 }
 views(CD_ID:any){
  this.buttontext = 'Update';
  this.CD_ID = CD_ID;
  this.APIServies.getall(this.CD_ID).subscribe((value) => {
    this.allvendordetaildata = value['data'];
    this.router.navigate(['/VendorCreation'], {
      state: {
        roledata: this.allvendordetaildata,
        views:'0',
      },
    });
  });
 }
 Assignvalue(CD_ID:any) {
  this.buttontext = 'Update';
  this.CD_ID = CD_ID;
  this.APIServies.getall(this.CD_ID).subscribe((value) => {
    this.allvendordetaildata = value['data'];
    this.router.navigate(['/VendorCreation'], {
      state: {
        roledata: this.allvendordetaildata,
        views:'1',
      },
    });
  });
 }
 
ngOnDestroy(): void {
  this.dtTrigger.unsubscribe();
}
}
