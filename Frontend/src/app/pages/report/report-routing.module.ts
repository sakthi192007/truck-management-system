import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from 'src/app/core/guards/authguard.guard'; 
import { ServicePerformanceExportComponent } from './service-performance-export/service-performance-export.component';
import { ServiceperformanceimportComponent } from './serviceperformanceimport/serviceperformanceimport.component';
import { ServiceperformanceMonthlyReportComponent } from './serviceperformance-monthly-report/serviceperformance-monthly-report.component';
import { ServiceperformanceinvoiceComponent } from './serviceperformanceinvoice/serviceperformanceinvoice.component';
import { VendorperformancereportComponent } from './vendorperformancereport/vendorperformancereport.component';
import { ServiceperformancemonthlyimportComponent } from './serviceperformancemonthlyimport/serviceperformancemonthlyimport.component';
import { ServiceperformanceinvoiceimportComponent } from './serviceperformanceinvoiceimport/serviceperformanceinvoiceimport.component';
import { ImportvendorperformancereportComponent } from './importvendorperformancereport/importvendorperformancereport.component';
import { GSTinvoicereportComponent } from './gstinvoicereport/gstinvoicereport.component';
import { TdsinvoicereportComponent } from './tdsinvoicereport/tdsinvoicereport.component';
const routes: Routes = [
    {
        path: 'ExportReport',
        component: ServicePerformanceExportComponent,
        canActivate: [AuthguardGuard] 
      },
      {
        path: 'ImportReport',
        component: ServiceperformanceimportComponent,
        canActivate: [AuthguardGuard] 
      },
      {
        path: 'ImportMonthlyReport',
        component: ServiceperformancemonthlyimportComponent,
        canActivate: [AuthguardGuard] 
      },
      {
        path: 'MonthlyReport',
        component: ServiceperformanceMonthlyReportComponent,
        canActivate: [AuthguardGuard] 
      },
      {
        path: 'InvoiceReport',
        component: ServiceperformanceinvoiceComponent,
        canActivate: [AuthguardGuard] 
      },
      {
        path: 'InvoiceReportImport',
        component: ServiceperformanceinvoiceimportComponent,
        canActivate: [AuthguardGuard] 
      },
      {
        path: 'VendorReport',
        component: VendorperformancereportComponent,
        canActivate: [AuthguardGuard] 
      },
      {
        path: 'VendorimportReport',
        component: ImportvendorperformancereportComponent,
        canActivate: [AuthguardGuard] 
      },
      {
        path: 'GSTinvoicereport',
        component: GSTinvoicereportComponent,
        canActivate: [AuthguardGuard] 
      },
       {
        path: 'TDSinvoicereport',
        component: TdsinvoicereportComponent,
        canActivate: [AuthguardGuard] 
      },
      
]

@NgModule({
    imports: [RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
  })
  export class ReportsRoutingModule { }