import { Component, OnInit,ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { all_api_service } from 'src/app/service/all_api_service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/service/notification.service';
import { AuthService } from 'src/app/service/auth.service';
import { InvoiceService } from '../invoice.service';
import { environment } from 'src/environments/environment';
import { SettingService } from '../../settingmodel/setting.service';

@Component({
  selector: 'app-invoice-grid',
  templateUrl: './invoice-grid.component.html',
  styleUrl: './invoice-grid.component.css'
})
export class InvoiceGridComponent implements OnInit, AfterViewInit {

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  user_id:any;
  role_id:any;
  Invoicedata!:any[];
  Invoicecomplete!:any[];
  tablegridviews:any;
  BR_key: any;
  currentuser: any;
  authService: any;
  I_id: any;
  allinvoicedata: any;
  buttontext: string | undefined;
  roleconcept: any;
  views:any;
  invoiceForm: any;
  invoicekeys:any;
  invoicedataline:any;
  userId:any;
    fromDate: string = '';
    toDate: string = '';
searchTerm: string = '';
//
fromDatePending:any;
toDatePending:any;
fromDateCompleted:any;
toDateCompleted:any;

 statusdatas:any;
  createstatus:any;
  viewstatus:any;
  statusupdate:any;
  statusdelete:any;
  statusapporval:any;

  constructor(private APIServies: InvoiceService, 
    private router: Router,private notifyService : NotificationService,
   private StatusAPI:SettingService ) {
  


  }
ngAfterViewInit(): void {
  setTimeout(() => {
    (window as any).initDataTable();

    const setupTable = (
      wrapperClass: string,
      btnTargetId: string,
      leftSearchClass: string
    ) => {
      const btns = document.querySelector(`.${wrapperClass} .dt-buttons`);
      const btnTarget = document.getElementById(btnTargetId);
      if (btns && btnTarget) {
        btnTarget.appendChild(btns);
      }

      const search = document.querySelector(`.${wrapperClass} .dataTables_filter`);
      const leftBox = document.querySelector(`.${leftSearchClass}`);
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
    };

    setupTable('pending-wrapper', 'datatable-buttons-pending', 'left-search');
    setupTable('completed-wrapper', 'datatable-buttons-completed', 'left-search-completed');

  }, 1000);
}

applyDateFilter()
  {
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


  ngOnInit(): void{
      this.userId = sessionStorage.getItem('id');
    this.role_id = sessionStorage.getItem('User_Roleid');
    this.accessstatus();
  this.getallgrid();

  }

  accessstatus(){
const name='InvoiceDetails';
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
get filteredData() {
  if (!this.searchTerm && !this.fromDatePending && !this.toDatePending) {
    return this.Invoicedata;
  }
  return this.Invoicedata.filter(bird => {
    let matchesSearch = true;
    let matchesDateRange = true;

    if (this.searchTerm) {
      matchesSearch = Object.values(bird).some(value =>
        String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    const InvoiceDate = new Date(bird.InvoiceDate);
    const from = this.fromDatePending ? new Date(this.fromDatePending) : null;
    const to = this.toDatePending ? new Date(this.toDatePending) : null;

    if (from && InvoiceDate < from) matchesDateRange = false;
    if (to && InvoiceDate > to) matchesDateRange = false;

    return matchesSearch && matchesDateRange;
  });
}

get filteredDataCompleted() {
  if (!this.searchTerm && !this.fromDateCompleted && !this.toDateCompleted) {
    return this.Invoicecomplete;
  }
  return this.Invoicecomplete.filter(bird => {
    let matchesSearch = true;
    let matchesDateRange = true;

    if (this.searchTerm) {
      matchesSearch = Object.values(bird).some(value =>
        String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    const InvoiceDate = new Date(bird.InvoiceDate);
    const from = this.fromDateCompleted ? new Date(this.fromDateCompleted) : null;
    const to = this.toDateCompleted ? new Date(this.toDateCompleted) : null;

    if (from && InvoiceDate < from) matchesDateRange = false;
    if (to && InvoiceDate > to) matchesDateRange = false;

    return matchesSearch && matchesDateRange;
  });
}

  getallgrid(){
    this.APIServies.invoicegrid(this.userId, this.role_id).subscribe(value => {
      this.tablegridviews = value;
      this.Invoicedata = this.tablegridviews['data']
      this.Invoicedata.forEach(element => {
        if (element.status == 0) {
          element["spancolur1"] = "badge badge-warning";
          element["pending"] = "Pending";
        } 
      })
      this.dtTrigger.next(this.Invoicedata); 
   
    });
    this.APIServies.invoicegridcomplete(this.userId, this.role_id).subscribe(value => {
      this.tablegridviews = value;
     this.Invoicecomplete = this.tablegridviews['data']
    this.Invoicecomplete.forEach(element => {
       if (element.status == 1) {
         element["spancolur1"] = "badge badge-success";
         element["Completed"] = "Completed";
       
       }
      })
     this.dtTrigger.next(this.Invoicecomplete); 
  
   });

  }
  Invoices(InvoiceNumber:any){

    this.APIServies.Previes(InvoiceNumber).subscribe(res => {

      console.log(res.data[0].invoicepdf)
      if (res && res.data[0].invoicepdf) {
    
     const fileUrl = `${environment.APIEndpoint}TaxInvoice/${res.data[0].invoicepdf}`;
window.open(fileUrl, '_blank');
      }
    });
  }
 
  onPendingClick(I_id:any){
    this.I_id = I_id;
  }
  Assignvalue(I_id:any){
    this.buttontext = 'Update';
  this.BR_key = I_id;
  this.APIServies.getallinvoice(this.BR_key).subscribe((value) => {
    this.allinvoicedata = value['data'];
    this.invoicedataline = value['lineitems'];
    this.router.navigate(['/InvoiceCreation'], {
      state: {
        roledata: this.allinvoicedata,
        roledataline: this.invoicedataline,
        views:'0',
      },
    });
  });
  }
  Approval(){
    this.APIServies.ApprovalInvoice(this.I_id).subscribe(value=> {
      this.notifyService.showSuccess("Invoice details Approved successfully.", "Invoicedetails");
      $("#Pendingrop").modal("hide");
              setTimeout(function () {
                window.location.reload();
              }, 2000);
    },
      (error: any) => {
      this.notifyService.showError("Something went to wrong", "Invoicedetails");
    }
  );
  }
  cancel(){
    $("#Pendingrop").modal("hide")
  }
  close(){
    $("#Pendingrop").modal("hide")
  }
 
}
