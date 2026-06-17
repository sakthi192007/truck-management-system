import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { BookingallocationService } from '../bookingallocation.service';
@Component({
  selector: 'app-bookingallocationgrid',
 
  templateUrl: './bookingallocationgrid.component.html',
  styleUrl: './bookingallocationgrid.component.css'
})
export class BookingallocationgridComponent {
 tablegridviews:any;
  tablegridview!: any[];
  Invoicedata: any;
  buttontext: string | undefined;
  BR_key: any;
  userId: any;
  role_id: any;
  fromDate: any;
  searchTerm: any;
  toDate: any;
   constructor( private APIServies: BookingallocationService,private router: Router,private notifyService : NotificationService) {
    
  
  
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
    if (bird.CreatedOn) {
      const bookingDate = new Date(bird.CreatedOn);
      const from = this.fromDate ? new Date(this.fromDate) : null;
      const to = this.toDate ? new Date(this.toDate) : null;

      if (from && bookingDate < from) {
        matchesDateRange = false;
      }
      if (to && bookingDate > to) {
        matchesDateRange = false;
      }
    }

    return matchesSearch && matchesDateRange;
  });
}

  ngOnInit(): void{
     this.userId = sessionStorage.getItem('id');
    this.role_id = sessionStorage.getItem('User_Roleid');
  this.getAllGrid();

  }
 getAllGrid() {
  this.APIServies.allocationgrid(this.userId, this.role_id).subscribe({
    next: (value) => {
      if (value && value['data']) {
        this.tablegridview = value['data'].map((element: any) => {
          if (element.status == 0) {
              element.spancolur1 = "custom-badge success";
            element.status = "Completed";
          } else {
          
              element.spancolur1 = "custom-badge warning";
            element.status = "Ongoing";
          } 
          return element;
        });
      } else {
        console.error('Data not found in response:', value);
        this.tablegridview = [];
      }
    },
    error: (err) => {
      console.error('Error fetching payment grid data:', err);
      this.tablegridview = [];
    }
  });
}
  Assignvalue(ID:any){
    this.buttontext = 'Update';
  this.BR_key = ID;
  this.APIServies.getallocationgrid(this.BR_key).subscribe((value) => {
    this.Invoicedata = value['data'];
    this.router.navigate(['/Bookingallocation'], {
      state: {
        roledata: this.Invoicedata,
        views:'0',
      },
    });
  });
  }
}
