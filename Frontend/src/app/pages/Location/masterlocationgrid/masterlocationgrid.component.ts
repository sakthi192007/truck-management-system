import { Component ,ViewChild,AfterViewInit} from '@angular/core';
import { LocationService } from '../Location.Service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { SettingService } from '../../settingmodel/setting.service';
@Component({
  selector: 'app-masterlocationgrid',
  templateUrl: './masterlocationgrid.component.html',
  styleUrl: './masterlocationgrid.component.css'
})
export class MasterlocationgridComponent implements AfterViewInit{ 
reloaded= false;
    Success = 'false';
    error = 'false';
    errortext: string = "";
    successtext: any = '';
    tablegridview!:any[];
  getgridvalues:any;
  buttontext: string = '';
  Client_Id: any;
  allvendordetaildata:any;
  user_id:any;
  role_id:any;
  locationdata:any;
  userId: any;
  searchTerm: any;
  fromDate: any;
  toDate: any;

   statusdatas:any;
  createstatus:any;
  viewstatus:any;
  statusupdate:any;
  statusdelete:any;
  statusapporval:any;

  constructor(private StatusAPI:SettingService,private APIServies:LocationService, private router: Router,private notifyService : NotificationService) {

  
    
    
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
      return this.tablegridview;
    }

    return this.tablegridview.filter(bird => {
      let matchesSearch = true;
      let matchesDateRange = true;

      // Filter by search term
      if (this.searchTerm) {
        matchesSearch = Object.values(bird).some(value =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      // Convert booking date to Date object
      const Createdon = new Date(bird.Ml_Createdon);
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
     this.userId = sessionStorage.getItem('id');
    this.role_id = sessionStorage.getItem('User_Roleid');
    this.accessstatus();
    this.getallgrid();
  }
 accessstatus(){
const name='LocationGrid';
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
  getallgrid() {
    this.APIServies.locationGrid(this.userId, this.role_id).subscribe(value => {
      this.getgridvalues = value;
      this.tablegridview = this.getgridvalues['data']
console.log(this.tablegridview);
    });
  }
  views(Ml_key: any){
    this.APIServies.getlocation(Ml_key).subscribe((value) => {
      this.locationdata = value['data'];
      this.router.navigate(['/LocationCreation'], {
        state: {
          locationdata: this.locationdata,
          views: '0',
        },
      });
    });
  }
  Assignvalue(Ml_key: any){
    this.APIServies.getlocation(Ml_key).subscribe((value) => {
      this.locationdata = value['data'];
      this.router.navigate(['/LocationCreation'], {
        state: {
          locationdata: this.locationdata,
          views: '1',
        },
      });
    });
  }
}
