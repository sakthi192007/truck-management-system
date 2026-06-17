import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Vehicleinform } from '../../../service/Vehicleinform'; 
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { PODService } from '../../documentation/documentation.service';

@Component({
  selector: 'app-vehicleinformation',
  templateUrl: './vehicleinformation.component.html',
  styleUrls: ['./vehicleinformation.component.css']
})
export class VehicleinformationComponent implements OnInit {

  income: number = 0;
  balance: number = 0;

  bookingNumber = '';
  TruckNumber = '';
  driverName = '';
  driverMobile = '';

  startKms = '';
  endKms = '';

  dieselAllowed = 0;
  dieselActual = 0;
  dieselCost = 0;

  driverBattaActual = 0;
  driverBattaPaid = 0;
  driverSalaryActual = 0;
  driverSalaryPaid = 0;

  buttontext = 'Submit';
  userId: any;
  vehicleIDs: any;
  submitted = false;

  bookings: any[] = [];

  expenses = {
    spares: 0,
    maintenance: 0,
    insurance: 0,
    TollExpenses: 0,
    tyrePurchase: 0,
    retread: 0,
    tyreSales: 0,
    OtherExpenses: 0,
    oil: 0
  };

  constructor(
    private vehicleService: Vehicleinform,
    private route: ActivatedRoute,
    private router: Router,
    private PODService: PODService,
    private NotificationService: NotificationService
  ) {  
    this.vehicleIDs = history.state.roledata;

    if (this.vehicleIDs != null && this.vehicleIDs != undefined && this.vehicleIDs != '') {
      this.buttontext = 'Update';
      this.loadVehicleDetails(this.vehicleIDs);
    }
  }

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('id');
    this.loadBookings();
  }

  loadBookings(): void {
    this.PODService.getbooking(this.userId).subscribe(res => {
      this.bookings = res?.data || [];
    });
  }

  calculateBalance() {
    const totalExpenses = Object.values(this.expenses).reduce((s, v) => s + (Number(v) || 0), 0);
    this.balance = Number(this.income || 0) - totalExpenses;
  }

  onSubmit(form: NgForm) {
    this.submitted = true;

    if (form.invalid) {
      Object.keys(form.controls).forEach(key => form.controls[key].markAsTouched());
      return;
    }

    const formData = {
      BookingNumber: this.bookingNumber,
      TruckNumber: this.TruckNumber,
      DriverName: this.driverName,
      DriverMobile: this.driverMobile,

      StartKms: this.startKms,
      EndKms: this.endKms,

      DieselAllowed: this.dieselAllowed,
      DieselActual: this.dieselActual,
      DieselCost: this.dieselCost,

      DriverBattaActual: this.driverBattaActual,
      DriverBattaPaid: this.driverBattaPaid,
      DriverSalaryActual: this.driverSalaryActual,
      DriverSalaryPaid: this.driverSalaryPaid,

      Income: this.income,
      Balance: this.balance,

      // Expenses
      Spares: this.expenses.spares,
      Maintenance: this.expenses.maintenance,
      Insurance: this.expenses.insurance,
      TollExpenses: this.expenses.TollExpenses,
      TyrePurchase: this.expenses.tyrePurchase,
      Retread: this.expenses.retread,
      TyreSales: this.expenses.tyreSales,
      OtherExpenses: this.expenses.OtherExpenses,
      Oil: this.expenses.oil,

      CreatedBy: this.userId,
      ModifiedBy: this.userId
    };

    if (this.buttontext === 'Submit') {
      this.vehicleService.insertVehicleInformation(formData).subscribe({
        next: () => {
          this.NotificationService.showSuccess('Vehicle created successfully', 'VehicleDetails');
          form.resetForm();
          this.router.navigate(['/vehicleinformationgrid']);
        },
        error: () => {
          this.NotificationService.showError('Error creating vehicle', 'VehicleDetails');
        }
      });
    } else {
      this.vehicleService.updateVehicle(this.vehicleIDs, formData).subscribe({
        next: () => {
          this.NotificationService.showSuccess('Vehicle updated successfully', 'VehicleDetails');
          this.router.navigate(['/vehicleinformationgrid']);
        },
        error: () => {
          this.NotificationService.showError('Error updating vehicle', 'VehicleDetails');
        }
      });
    }
  }

  loadVehicleDetails(id: number) {
    this.vehicleService.getVehicleById(id).subscribe({
      next: (res: any) => {
        const v = res?.data;
        if (!v) return;

        // Load all values into fields
        this.bookingNumber = v.BookingNumber;
        this.TruckNumber = v.TruckNumber;
        this.driverName = v.DriverName;
        this.driverMobile = v.DriverMobile;

        this.startKms = v.StartKms;
        this.endKms = v.EndKms;

        this.dieselAllowed = Number(v.DieselAllowed);
        this.dieselActual = Number(v.DieselActual);
        this.dieselCost = Number(v.DieselCost);

        this.driverBattaActual = Number(v.DriverBattaActual);
        this.driverBattaPaid = Number(v.DriverBattaPaid);
        this.driverSalaryActual = Number(v.DriverSalaryActual);
        this.driverSalaryPaid = Number(v.DriverSalaryPaid);

        this.income = Number(v.Income);
        this.balance = Number(v.Balance);

        this.expenses = {
          spares: Number(v.Spares) || 0,
          maintenance: Number(v.Maintenance) || 0,
          insurance: Number(v.Insurance) || 0,
          TollExpenses: Number(v.TollExpenses) || 0,
          tyrePurchase: Number(v.TyrePurchase) || 0,
          retread: Number(v.Retread) || 0,
          tyreSales: Number(v.TyreSales) || 0,
          OtherExpenses: Number(v.OtherExpenses) || 0,
          oil: Number(v.Oil) || 0
        };
      },
      error: () => {
        this.NotificationService.showError('Error loading vehicle details', 'VehicleDetails');
      }
    });
  }
}
