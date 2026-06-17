import { Component, OnInit,AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/service/notification.service';
import {CampaignmasterService } from '../campaignmaster.service';

declare var bootstrap: any;
@Component({
  selector: 'app-whatsapp',
 
  templateUrl: './whatsapp.component.html',
  styleUrl: './whatsapp.component.css'
})
export class WhatsappComponent {

  tablegridview!: any[];
  tablegridviews: any;
  tablegridview1!: any[];
  currentuser: any;
  userId: any;
  RoleId: any;
  values:any;
  selectedCampaign: any;
  BR_keys: any;
  headerTitle: any;
  vendordata:any;
  lineitems:any;
  fromDate: any;
  toDate: any;
  searchTerm: any;
   constructor(private formBuilder: FormBuilder, private APIServices:CampaignmasterService , private router: Router, private authService: AuthService, private notifyService: NotificationService){

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
      const Createdon = new Date(bird.CM_Createdon);
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
    this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;
    this.RoleId = this.currentuser.User_Roleid;
    this.getallgrid();

  }
  getallgrid() {
    this.APIServices.campaigngrid().subscribe(value => {
      this.tablegridviews = value;
      this.tablegridview = this.tablegridviews['data']

    });
    
    
  }
  Publish(CM_key: any){
    this.APIServices.PushtheWhatsapp(CM_key).subscribe(value => {
      this.notifyService.showSuccess("Message Send Successfully", "Whats App");
     
    });
  }
  onCellClick(CM_key: any,value:any) {
    this.BR_keys = CM_key;
    this.values=value;
    var modalElement = document.getElementById('campaignModal');
    var modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
    setTimeout(() => {
      (window as any).initSubDataTable();
    }, 1000);
    this.getvalues();
    if (value === 0) {
      this.headerTitle = "Created On";
  } else {
      this.headerTitle = "Responsed On";
  }

  }

  getvalues(){
    this.APIServices.vendorcampaigngrid(this.BR_keys,this.values).subscribe(value => {
      this.tablegridviews = value;
      this.tablegridview1 = this.tablegridviews['data']
     
    });
  }

  remove(){

    setTimeout(() => {
      (window as any).initSubDataTableromove();
    }, 1000);

   
  }

  views(Ml_key: any){
    this.APIServices.getvendor(Ml_key).subscribe((value) => {
      this.vendordata = value['data'];
      this.lineitems = value['lineitems'];
      this.router.navigate(['/Campaign'], {
        state: {
          vendordata:  this.vendordata,
          lineitems:  this.lineitems,
          views: '0',
        },
      });
    });
  }
  Assignvalue(Ml_key: any){

    this.APIServices.getvendor(Ml_key).subscribe((value) => {
      this.vendordata = value['data'];
      this.lineitems = value['lineitems'];
      this.router.navigate(['/Campaign'], {
        state: {
          vendordata:  this.vendordata,
          lineitems:  this.lineitems,
          views: '1',
        },
      });
    });
  }
}
