import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Truckmasterinform ,Truckmasterinfo } from '../../../../service/truckmaster'; 
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { PODService } from 'src/app/pages/documentation/documentation.service';
@Component({
  selector: 'app-createtruckmaster',

  templateUrl: './createtruckmaster.component.html',
  styleUrl: './createtruckmaster.component.css'
})
export class CreatetruckmasterComponent {
  bookingNumber = '';
  AssetNumber = '';
  Advance = '';
  Driverbata = '';
  Cleanerbata = '';
  OtherExpenses = '';
  Oil = '';
  Pressure = '';
  Retread = '';
  tyreSales = '';
  Spares = '';
  Maintenance = '';
  Insurance = '';
  Tds = '';
  Shortage = '';
  HP1 = '';
  HP2 = '';
  Hpinetest = '';
  HPInterest2 = '';
  Commission = '';
  Fasttag = '';
  BussinessPromotion = '';
  Mamool = '';
  Labour = '';
  Income = '';
  Diesel = '';
  userId: any;

   Truckmasterinform: FormGroup;
  TruckID:any;
  isEditMode: boolean = false;
  submitted = false;
   buttontext = 'Submit';
bookings:any;
 constructor(
    private TruckMasterServices: Truckmasterinform,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
     private PODService: PODService,
    private NotificationService:NotificationService
  ) 
         { 
           this.TruckID = history.state.roledata;
          
          this.Truckmasterinform = this.fb.group({
             BookingNumber: ['', Validators.required],     
             AssetNumber: [''],     
             Advance: [''],     
             Driverbata: [''],     
             Cleanerbata: [''],     
             OtherExpenses: [''],     
             Oil: [''],     
             Pressure: [''],     
             Retread: [''],     
             tyreSales: [''],     
             Spares: [''],     
             Maintenance: [''],     
             Tds: [''],     
             Shortage: [''],     
             HP1: [''],     
             HP2: [''],     
             Hpinetest: [''],     
             HPInterest2: [''],     
             Commission: [''],     
             Fasttag: [''],     
             BussinessPromotion: [''],     
             Mamool: [''],     
             Labour: [''],     
             Income: [''],     
             Diesel: [''],     
      }); 

       if (this.TruckID == '' || this.TruckID == undefined) {
    } else {
   this.buttontext = 'Update';
 this.loadTruckDetails(this.TruckID);
    }
   }

ngOnInit(): void {
 this.userId = sessionStorage.getItem('id');
    this.loadBookings();
}
loadBookings(): void {
  this.PODService.getbooking(this.userId).subscribe(value => {
      const tablegridviews = value;
      this.bookings = tablegridviews['data'];
    });
}
 get f() {
    return this.Truckmasterinform.controls;
  }
submit() {

  this.submitted = true;

  if (this.Truckmasterinform.invalid) {
        return;
    }
   const formvalues = this.Truckmasterinform.value;


     
const Truckmaster = {

  

  BookingNumber: formvalues.BookingNumber,
  AssetA_C: formvalues.AssetNumber,
  IncomeA_C: formvalues.Income,
  DieselA_C: formvalues.Diesel,
  AdvanceA_C: formvalues.Advance,
  DriverBattaA_C: formvalues.Driverbata,
  CleanerBattaA_C: formvalues.Cleanerbata,
  OtherExpensesA_C: formvalues.OtherExpenses,
  OilA_C: formvalues.Oil,
  NewTyrePurchaseA_C: formvalues.Pressure,
  TyreRetreadA_C: formvalues.Retread,
  TyreSalesA_C: formvalues.tyreSales,
  SparesA_C: formvalues.Spares,
  MaintenanceA_C: formvalues.Maintenance,
  InsuranceTaxA_C: formvalues.Insurance,
  TDSA_C: formvalues.Tds,
  ShortageA_C: formvalues.Shortage,
  HPA_C: formvalues.HP1,
  HPA_C2: formvalues.HP2,
  HPInterestA_C: formvalues.Hpinetest,
  HPInterestA_C2: formvalues.HPInterest2,
  CommissionA_C: formvalues.Commission,
  FastTagA_C: formvalues.Fasttag,
  BusinessPromotionA_C: formvalues.BussinessPromotion,
  MamoolA_C: formvalues.Mamool,
  LabourWelfareA_C: formvalues.Labour,
  CreatedBy: this.userId,
 

};

if (this.buttontext=== 'Submit') {
     this.TruckMasterServices.InsertTruckMasterInformation(Truckmaster).subscribe({
      next: (res:any) => {
        this.NotificationService.showSuccess('Truck Create successfully', 'TruckDetails');
        this.Truckmasterinform.reset();
         this.router.navigate(['/truckmastergrid']);
      },
      error: (err:any) => 
        this.NotificationService.showSuccess('Error updating vehicle', 'TruckDetails')
    });
  }
  else {

     this.TruckMasterServices.updateTruckMaster(this.TruckID, Truckmaster).subscribe({
       next: (res:any) => {
          this.NotificationService.showSuccess('Truck updated successfully', 'TruckDetails');
        this.router.navigate(['/truckmastergrid']);
      },
      error: (err:any) =>
         this.NotificationService.showSuccess('Error updating vehicle', 'TruckDetails')
    });
  
  
  }

 
}
loadTruckDetails(id: number) {
  this.TruckMasterServices.GetTruckMasterById(id).subscribe({
    next: (res: any) => {
      if (res.success && res.data) {
        const Truckmaster = res.data;
        console.log('Fetched Truckmaster details:', Truckmaster);

        let formvalues = {
          BookingNumber: Truckmaster.BookingNumber,
          AssetNumber: Truckmaster.AssetA_C,
          Income: Truckmaster.IncomeA_C,
          Diesel: Truckmaster.DieselA_C,
          Advance: Truckmaster.AdvanceA_C,
          Driverbata: Truckmaster.DriverBattaA_C,
          Cleanerbata: Truckmaster.CleanerBattaA_C,
          OtherExpenses: Truckmaster.OtherExpensesA_C,
          Oil: Truckmaster.OilA_C,
          Pressure: Truckmaster.NewTyrePurchaseA_C,
          Retread: Truckmaster.TyreRetreadA_C,
          tyreSales: Truckmaster.TyreSalesA_C,
          Spares: Truckmaster.SparesA_C,
          Maintenance: Truckmaster.MaintenanceA_C,
          Insurance: Truckmaster.InsuranceTaxA_C,
          Tds: Truckmaster.TDSA_C,
          Shortage: Truckmaster.ShortageA_C,
          HP1: Truckmaster.HPA_C,
          HP2: Truckmaster.HPA_C2,
          Hpinetest: Truckmaster.HPInterestA_C,
          HPInterest2: Truckmaster.HPInterestA_C2,
          Commission: Truckmaster.CommissionA_C,
          Fasttag: Truckmaster.FastTagA_C,
          BussinessPromotion: Truckmaster.BusinessPromotionA_C,
          Mamool: Truckmaster.MamoolA_C,
          Labour: Truckmaster.LabourWelfareA_C
        };

        this.Truckmasterinform.patchValue(formvalues);
      }
    },
    error: (err: any) =>
      this.NotificationService.showSuccess('Error updating vehicle', 'TruckDetails')
  });
}




}
