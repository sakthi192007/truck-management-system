import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from 'src/app/core/guards/authguard.guard'; 
import { BookingGridComponent } from './booking-grid/booking-grid.component'; 
import { BookingComponent } from './booking/booking.component'; 
import { ImportBookingComponent } from './bookingImport/importBooking.component';

const routes: Routes = [
    {
      path: 'CreateBooking',
      component: BookingComponent,
      canActivate: [AuthguardGuard] 
    },
    
    {
      path: 'BookingDetails',
      component: BookingGridComponent,
      canActivate: [AuthguardGuard] 
    },
    {
      path: 'ImportBookingDetails',
      component: ImportBookingComponent,
      canActivate: [AuthguardGuard] 
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
  })
  export class BookingRoutingModule { }