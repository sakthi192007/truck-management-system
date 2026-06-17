import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { MasterdataService } from '../MasterData.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-creationgrid',

  templateUrl: './creationgrid.component.html',
  styleUrl: './creationgrid.component.css'
})
export class CreationgridComponent {
  currentuser: any = '';
  userId: any;
  RoleId: any;
  userdatadetails: any;
  userdata!: any[];
  User_ID: any;
  DD_key: any;
  allinvoicedata: any;
  buttontext: string = 'Update';
  Clientdata: any;
  updateuser: any;
  searchTerm: any;
  fromDate: any;
  toDate: any;
  constructor(private formBuilder: FormBuilder, private APIServies: MasterdataService, private router: Router, private authService: AuthService, private http: HttpClient, private notifyService: NotificationService) {

  }
  ngOnInit(): void {
    this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;
    this.RoleId = this.currentuser.User_Roleid;
    this.Usergrid();
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
      return this.userdata;
    }

    return this.userdata.filter(bird => {
      let matchesSearch = true;
      let matchesDateRange = true;

      // Filter by search term
      if (this.searchTerm) {
        matchesSearch = Object.values(bird).some(value =>
          String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      // Convert booking date to Date object
      const createdOn = new Date(bird.createdOn);
      const from = this.fromDate ? new Date(this.fromDate) : null;
      const to = this.toDate ? new Date(this.toDate) : null;

      // Filter by date range
      if (from && createdOn < from) {
        matchesDateRange = false;
      }
      if (to && createdOn > to) {
        matchesDateRange = false;
      }

      return matchesSearch && matchesDateRange;
    });
  }
  Usergrid() {
    this.APIServies.gridgetuser(this.userId, this.RoleId).subscribe(value => {
      this.userdatadetails = value;
      this.userdata = this.userdatadetails['data']

    })
  }
  Assignvalueuser(Client_ID: any) {
    this.buttontext = 'Update';
    this.User_ID = Client_ID
    this.APIServies.getallclientdata(this.User_ID).subscribe((value) => {
      this.Clientdata = value['data'];
      this.router.navigate(['/Creation'], {
        state: {
          roledata: this.Clientdata,
          views: '0',
        },
      });
    });
  }

  canceldriv() {
    $("#Deleterop").modal("hide");
  }
  closedriv() {
    $("#Deleterop").modal("hide");
  }
  Deleteroleuser(Client_ID: any) {
    this.User_ID = Client_ID
  }
  deleteuser() {
    this.APIServies.deleteuser(this.User_ID).subscribe(res => {
      this.notifyService.showSuccess("User details deleted successfully.", "User details");
      $("#Deleterop").modal("hide");
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    },
      (error: any) => {
        this.notifyService.showError("Something went to wrong", "User details");
      })
  }
}
