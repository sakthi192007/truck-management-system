import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/service/notification.service';
import { ApinvoiceService } from '../apinvoice.service';

import { SettingService } from '../../settingmodel/setting.service';
@Component({
  selector: 'app-apinvoice-grid',
  templateUrl: './apinvoice-grid.component.html',
  styleUrl: './apinvoice-grid.component.css'
})
export class APinvoiceGridComponent {
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  user_id: any;
  role_id: any;
  Invoicedata!: any[];
  Invoicecomplete!: any[];
  tablegridviews: any;
  BR_key: any;
  currentuser: any;
  authService: any;
  I_id: any;
  allinvoicedata: any;
  buttontext: string | undefined;
  roleconcept: any;
  views: any;
  invoiceForm: any;
  invoicekeys: any;
  invoicedataline: any;
  userId: any;
  fromDate: any;
  toDate: any;
  searchTerm: any;

    statusdatas:any;
  createstatus:any;
  viewstatus:any;
  statusupdate:any;
  statusdelete:any;
  statusapporval:any;

  constructor(private APIServies: ApinvoiceService, private router: Router,
     private notifyService: NotificationService, private StatusAPI:SettingService) {
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
        return this.Invoicedata;
    }

    return this.Invoicedata.filter(bird => {
        let matchesSearch = true;
        let matchesDateRange = true;

        // Filter by search term
        if (this.searchTerm) {
            matchesSearch = Object.values(bird).some(value => 
                String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }

        // Convert booking date to Date object
        const InvoiceDate = new Date(bird.InvoiceDate);
        const from = this.fromDate ? new Date(this.fromDate) : null;
        const to = this.toDate ? new Date(this.toDate) : null;

        // Filter by date range
        if (from && InvoiceDate < from) {
            matchesDateRange = false;
        }
        if (to && InvoiceDate > to) {
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
const name='APInvoices';
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
    this.APIServies.invoicegrid(this.userId, this.role_id).subscribe(value => {
      this.tablegridviews = value;
      this.Invoicedata = this.tablegridviews['data'];
      this.Invoicedata.forEach(element => {
        if (element.Balancedue == 0) {
          element.spancolur1 = "custom-badge success";
          element.status = "Completed";
        } else {
          element.spancolur1 = "custom-badge warning";
          element.status = "Pending";
        }
      });

      this.dtTrigger.next(this.Invoicedata);
    });
  }


  onPendingClick(I_id: any) {
    this.I_id = I_id;
  }
  Assignvalue(I_id: any) {
    this.buttontext = 'Update';
    this.BR_key = I_id;
    this.APIServies.getallinvoice(this.BR_key).subscribe((value) => {
      this.allinvoicedata = value['data'];
      this.invoicedataline = value['lineitems'];
      this.router.navigate(['/APInvoiceCreation'], {
        state: {
          roledata: this.allinvoicedata,
          roledataline: this.invoicedataline,
          views: '0',
        },
      });
    });
  }
  Approval() {
    this.APIServies.ApprovalInvoice(this.I_id).subscribe(value => {
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
  cancel() {
    $("#Pendingrop").modal("hide")
  }
  close() {
    $("#Pendingrop").modal("hide")
  }
}

