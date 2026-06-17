import { Component, ViewChild,AfterViewInit } from '@angular/core';
import { ClientService } from '../client.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/service/notification.service';
import { SettingService } from '../../settingmodel/setting.service';

@Component({
  selector: 'app-client-grid',
  templateUrl: './client-grid.component.html',
  styleUrl: './client-grid.component.css'
})
export class ClientGridComponent implements AfterViewInit{
 
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
  searchTerm: any;
  fromDate: any;
  toDate: any;

  
  statusdatas:any;
  createstatus:any;
  viewstatus:any;
  statusupdate:any;
  statusdelete:any;
  statusapporval:any;


  constructor(private APIServies: ClientService, private router: Router,private notifyService : NotificationService,private StatusAPI:SettingService) {}
  
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

  applyDateFilter()
  {
     console.log("Applied Date Filter:", this.fromDate, "to", this.toDate);
  }
  // 
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

      if (this.searchTerm) {
        matchesSearch = Object.values(bird).some(value =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      const CreatedOn = new Date(bird.CreatedOn);
      const from = this.fromDate ? new Date(this.fromDate) : null;
      const to = this.toDate ? new Date(this.toDate) : null;

      if (from && CreatedOn < from) {
        matchesDateRange = false;
      }
      if (to && CreatedOn > to) {
        matchesDateRange = false;
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
const name='ClientDetails';
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

    this.APIServies.clientGrid(this.user_id, this.role_id).subscribe(value => {
      this.getgridvalues = value;
      this.tablegridview = this.getgridvalues['data']
      this.tablegridview.forEach(element => {
        if (element.status == 1) {
          element["spancolur1"] = "badge badge-success";
          element["statusname1"] = "Active";
  
          
        } else if (element.status == 0) {
          element["spancolur1"] = "badge badge-danger";
          element["statusname1"] = "In Active";
        
        }
        if(element.Department==0){
          element["test"] = "EXPORT/IMPORT";
        }else if(element.Department==1){
          element["test"] = "EXPORT";
        }else if(element.Department==2){
          element["test"] = "IMPORT";
        }
      })

     
    });
 }
 views(Client_Id:any){
  this.buttontext = 'Update';
  this.Client_Id = Client_Id;
  this.APIServies.getallclient(this.Client_Id).subscribe((value) => {
    this.allvendordetaildata = value['data'];
    this.router.navigate(['/CreateClient'], {
      state: {
        roledata: this.allvendordetaildata,
        views:'0',
      },
    });
  });
 }
 Assignvalue(Client_Id:any) {
  this.buttontext = 'Update';
  this.Client_Id = Client_Id;
  this.APIServies.getallclient(this.Client_Id).subscribe((value) => {
    this.allvendordetaildata = value['data'];
    this.router.navigate(['/CreateClient'], {
      state: {
        roledata: this.allvendordetaildata,
        views:'1',
      },
    });
  });
 }
}