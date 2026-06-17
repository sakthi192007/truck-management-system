import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from 'src/app/core/guards/authguard.guard'; 
import { VendorCreationGridComponent } from './vendor-creation-grid/vendor-creation-grid.component'; 
import { VendorCreationComponent } from './vendor-creation/vendor-creation.component';
import { VendorpricedetailsComponent } from './vendorpricedetails/vendorpricedetails.component';



const routes: Routes = [
{
    path: 'VendorCreation',
    component: VendorCreationComponent,
    canActivate: [AuthguardGuard] 
  },
  {
    path: 'VendorDetails',
    component: VendorCreationGridComponent,
    canActivate: [AuthguardGuard] 
  },
  {
    path: 'VendorPriceDetails',
    component: VendorpricedetailsComponent,
    canActivate: [AuthguardGuard] 
  }
]
@NgModule({
    imports: [RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
  })
  export class VendorsRoutingModule { }