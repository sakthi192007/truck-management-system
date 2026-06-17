import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from 'src/app/core/guards/authguard.guard'; 
import { BookingallocationComponent } from './bookingallocation/bookingallocation.component';
import { BookingallocationgridComponent } from './bookingallocationgrid/bookingallocationgrid.component';
const routes: Routes = [
 {
      path: 'Bookingallocation',
      component: BookingallocationComponent,
      canActivate: [AuthguardGuard] 
    },
     {
      path: 'Allocationgrid',
      component: BookingallocationgridComponent,
      canActivate: [AuthguardGuard] 
    },
];
 @NgModule({
    imports: [RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
  })
  export class BookingallocationRoutingModule { }