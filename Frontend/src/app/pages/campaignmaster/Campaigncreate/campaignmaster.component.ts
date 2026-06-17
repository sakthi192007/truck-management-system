import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/service/notification.service';
import {CampaignmasterService } from '../campaignmaster.service';
@Component({ 
  selector: 'app-campaignmaster',
 
  templateUrl: './campaignmaster.component.html',
  styleUrl: './campaignmaster.component.css'
})
export class CampaignmasterComponent {
  campaign!: FormGroup;
  VendorName!: FormGroup;
  currentuser: any;
  userId: any;
  RoleId: any;
  getvendordata: any;
  CM_key: any;
  vendorselect:any;
  selectedVendorName:any;
  vendordata:any;
  lineitems:any;
  views:any;
  selectvalues:any;
  buttontext: string = 'Submit';
    headertext: string ='Create Campaign Details';
  submitted = false;
  allSelected = false;
  constructor(private formBuilder: FormBuilder,private APIServices:CampaignmasterService ,private router: Router, private authService: AuthService, private http: HttpClient, private notifyService: NotificationService){
    
    this.vendordata=history.state.vendordata;
    this.lineitems=history.state.lineitems;
    this.views = history.state.views;

    this.campaign = this.formBuilder.group({
      campaign_name: this.formBuilder.control('', [Validators.required]),
      message: this.formBuilder.control('', [Validators.required]),
    })

    if (this.vendordata && this.vendordata.length > 0) {
      this.buttontext = 'Update';
      this.headertext ='Update Campaign Details';

      const formvalues = {
        campaign_name: this.vendordata[0].CM_CampaignName,
        message: this.vendordata[0].CM_Content,
      }
      this.CM_key = this.vendordata[0].CM_key;
      this.campaign.patchValue(formvalues);
    }
   
    
    
    if (this.lineitems && this.lineitems.length > 0) {
      this.getvendordata = this.lineitems.map((item: { status: string; }) => ({
        ...item,
        selected: item.status === '1'
      }));
     this.getSelectedVendorsupdate();
    }

    
    
    
  }

  getSelectedVendorsupdate() {
    const selectedVendors = this.getvendordata.filter((vendor: any) => vendor.selected === true);
    this.selectvalues = selectedVendors;
    if (selectedVendors.length === 1) {
      this.selectedVendorName = selectedVendors[0].VendorName;
    } else if (selectedVendors.length > 1) {
      this.selectedVendorName = `${selectedVendors.length} Selected Vendors`;
    } else {
      this.selectedVendorName = '';
    }
  }
  
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      (window as any).initDataTable();
    }, 1000);
  }

  onButtonClick() {
    this.allSelected = !this.allSelected;
  
    if (this.lineitems && this.lineitems.length > 0) {
      // Add the 'selected' property based on status
      this.getvendordata = this.lineitems.map((item: any) => ({
        ...item,
        selected: item.status === '1' ? this.allSelected : false
      }));
    
      
    }
  }
  
  
  ngOnInit(): void {
    this.currentuser = this.authService.getCurrentuser();
    this.userId = this.currentuser.id;
    this.RoleId = this.currentuser.User_Roleid;
    this.getAll();
  }

  
  getAll() {
    this.APIServices.dropdowngetvendor().subscribe(value => {
      this.vendorselect = value;
      this.getvendordata = this.vendorselect['data']

    });
  }
  submit(){
    this.submitted = true;
    if (this.campaign.invalid) {
      return;
    }

    let registerdata = this.campaign.value;

    if (this.buttontext == 'Submit') {

      const formvalues = {
        campaign_name: this.campaign.value.campaign_name,
        message: this.campaign.value.message,
      }
        this.APIServices.insertcampaign(formvalues).subscribe(response => {
          this.CM_key = response.data.id;

          var b = this.selectvalues;
          for (var i = 0; i < b.length; i++) {
            let Vendor = b[i].CD_ID; // Corrected: Accessing CD_ID from the object
            b[i].CD_VendorID = Vendor;
            b[i].CD_CampaignID = this.CM_key;
          }
          this.APIServices.insertcampaignitems(this.selectvalues,).subscribe(() => {
            this.notifyService.showSuccess("Campaign Details created successfully.", "Campaign Details");
            this.router.navigate(['/Campaignmaster'])
        })
    })
    } else {
      const formvalues = {
        campaign_name: this.campaign.value.campaign_name,
        message: this.campaign.value.message,
      }
        this.APIServices.updatecampaign(formvalues,this.CM_key).subscribe(response => {
        
          var b = this.selectvalues;
          for (var i = 0; i < b.length; i++) {
            let Vendor = b[i].CD_ID; // Corrected: Accessing CD_ID from the object
            b[i].CD_VendorID = Vendor;
            b[i].CD_CampaignID = this.CM_key;
          }
          this.APIServices.updatecampaignitems(this.selectvalues,this.CM_key).subscribe(() => {
            this.notifyService.showSuccess("Campaign Details created successfully.", "Campaign Details");
            this.router.navigate(['/Campaignmaster'])
        })
    })
    }

  }



  selectAllVendors() {
    this.allSelected = !this.allSelected;
    this.getvendordata.forEach((vendor: any) => {
      vendor.selected = this.allSelected;
    });
  }
  

  // getSelectedVendors() {
  //   const selectedVendors = this.getvendordata.filter((vendor: { selected: any; }) => vendor.selected);
  //   this.selectvalues =selectedVendors;
   
  // }
  clearAllVendors() {
    this.getvendordata.forEach((vendor: any) => {
      vendor.selected = false;
    });
    this.selectedVendorName = '';
    this.selectvalues = [];
  }
  getSelectedVendors() {
    const selectedVendors = this.getvendordata.filter((vendor: any) => vendor.selected);
    this.selectvalues = selectedVendors;
  
    if (selectedVendors.length === 1) {
      this.selectedVendorName = selectedVendors[0].VendorName;
    } else if (selectedVendors.length > 1) {
      this.selectedVendorName = `${selectedVendors.length} Selected Vendors `;
    } else {
      this.selectedVendorName = '';
    }
  }
  vehiclesubmit(){

  }
  close(){
    
  }
  get f() {
    return this.campaign.controls;
  }
}
