import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from 'src/app/core/guards/authguard.guard'; 
import { InvoiceGridComponent } from './invoice-grid/invoice-grid.component'; 
import { InvoiceComponent } from './invoice/invoice.component'; 
import { InvoicesTDSComponent} from './invoices-tds/invoices-tds.component';
import {InvoicestdsgridComponent} from './invoicestdsgrid/invoicestdsgrid.component';
const routes: Routes = [
    {
        path: 'InvoiceDetails',
        component: InvoiceGridComponent,
        canActivate: [AuthguardGuard] 
      },
      {
        path: 'InvoiceCreation',
        component: InvoiceComponent,
        canActivate: [AuthguardGuard] 
      },
      {
        path: 'Invoicetds',
        component: InvoicesTDSComponent,
        canActivate: [AuthguardGuard] 
      },
      {
        path: 'Paymententry',
        component: InvoicestdsgridComponent,
        canActivate: [AuthguardGuard] 
      }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
  })
  export class InvoiceRoutingModule { }