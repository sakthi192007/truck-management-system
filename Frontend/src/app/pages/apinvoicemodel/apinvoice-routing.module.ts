import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from 'src/app/core/guards/authguard.guard'; 
import { APinvoiceGridComponent } from './apinvoice-grid/apinvoice-grid.component';
import { APinvoiceComponent } from './apinvoice/apinvoice.component';
import {APInvoicestdsgridComponent} from './apinvoicestdsgrid/apinvoicestdsgrid.component';
import { APInvoicesTDSComponent} from './apinvoices-tds/apinvoices-tds.component';
const routes: Routes = [
    {
        path: 'APInvoices',
        component: APinvoiceGridComponent,
        canActivate: [AuthguardGuard] 
      },
      {
        path: 'APInvoiceCreation',
        component: APinvoiceComponent,
        canActivate: [AuthguardGuard] 
      }
      ,
      {
        path: 'APPaymentgrid',
        component: APInvoicestdsgridComponent,
        canActivate: [AuthguardGuard] 
      },
      {
        path: 'APPayment',
        component: APInvoicesTDSComponent,
        canActivate: [AuthguardGuard] 
      }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
  })
  export class APinvoiceRoutingModules { }