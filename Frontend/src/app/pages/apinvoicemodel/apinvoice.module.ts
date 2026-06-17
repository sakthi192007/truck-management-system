import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { ErrorInterceptor } from 'src/app/core/interceptors/error.interceptor'; 
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { LoaderService } from 'src/app/service/loader.service'; 
import { MyInterceptor } from 'src/app/core/interceptors/loader-interceptor.service'; 
import { ManageHttpInterceptor } from 'src/app/core/interceptors/managehttp.interceptor'; 
import { APIInterceptor } from 'src/app/core/interceptors/api.interceptor';
import { HttpCancelService } from 'src/app/core/interceptors/httpcancel.service'; 
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { CommonModule } from '@angular/common';
import { APinvoiceComponent } from './apinvoice/apinvoice.component';
import { APinvoiceGridComponent } from './apinvoice-grid/apinvoice-grid.component';
import {APInvoicestdsgridComponent} from './apinvoicestdsgrid/apinvoicestdsgrid.component';
import { APInvoicesTDSComponent} from './apinvoices-tds/apinvoices-tds.component';

@NgModule({
  declarations: [
    APinvoiceGridComponent,
    APinvoiceComponent,
    APInvoicestdsgridComponent,
    APInvoicesTDSComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    NgSelectModule,
    SelectDropDownModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      progressBar: true,
      positionClass: 'toast-bottom-right',
      closeButton: true,
      newestOnTop: true,
      preventDuplicates: false,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: APIInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ManageHttpInterceptor, multi: true },
    LoaderService,
    HttpCancelService
  ],
})
export class APinvoiceModule {}