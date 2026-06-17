import { Component, OnInit } from '@angular/core';
import { PODService } from '../documentation.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/service/auth.service';
interface Booking {
  bookingNo: string;
  containerNo: string;
  sealNo: string;
}

@Component({
  selector: 'app-docgrid',
  templateUrl: './docgrid.component.html',
  styleUrls: ['./docgrid.component.css']
})
export class DocgridComponent implements OnInit {
  bookings!:any[];
lrId:any;
  fromDate: any;
  searchTerm: any;
  toDate: any;
  currentuser: any;
  RoleId: any;
  userId: any;

  constructor(private podService: PODService, private authService: AuthService,) {}

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
  ngOnInit(): void {
     this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;
    this.RoleId = this.currentuser.User_Roleid;
    this.loadBookings();
    
  }
 applyDateFilter() {
    console.log("Applied Date Filter:", this.fromDate, "to", this.toDate);
  }
  
   get filteredData() {
    if (!this.searchTerm && !this.fromDate && !this.toDate) {
      return this.bookings;
    }

    return this.bookings.filter(bird => {
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


loadBookings() {
    this.podService.podgrid(this.userId).subscribe(value => {
      let tables = value;
      this.bookings = tables['data']
      
    });
  }
  
  
  downloadPdf(LR_id:any){
    this.lrId=LR_id;
     this.podService.generate_PDF(LR_id).subscribe(res => {
      console.log(res)
      if (res && res.data[0].pdf) {
     const fileUrl = `${environment.APIEndpoint}LRCopy/${res.data[0].pdf}`;
     window.open(fileUrl, '_blank');
      } 
    });

    
  }
  
}
