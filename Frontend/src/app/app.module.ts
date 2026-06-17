import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { CommonModule } from '@angular/common';
import { CampaignChatComponent } from './campaign-chat/campaign-chat.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { Documentationroutingcomponent } from './pages/documentation/documentation-routing.module';


//Routing module
import { RouterModule, Routes } from '@angular/router';
import { BookingRoutingModule } from './pages/bookingmodel/booking-routing.module';
import { ClientRoutingModule } from './pages/clientmodel/client-routing.module';
import { InvoiceRoutingModule } from './pages/invoicemode/invoice-routing.module';
import { SettingRoutingModule } from './pages/settingmodel/setting-routing.module';
import { VendorsRoutingModule } from './pages/vendormodel/vendor-routing.module';
import { ReportsRoutingModule } from './pages/report/report-routing.module';
import { LocationRoutingModule } from './pages/Location/locationroute-routing.module';
import { CampaignmasterRoutingModule } from './pages/campaignmaster/campaignmaster-routing.module';
import { AdminDashboardRoutingModule } from './pages/AdminDashboard/admindashboard-routing.module';

///function
import { UppercaseDirective } from './core/uppercase.directive';
import { NumericOnlyDirective } from './core/Number.directive';
//service
import { LoaderService } from './service/loader.service';
import { MyInterceptor } from './core/interceptors/loader-interceptor.service';
import { ManageHttpInterceptor } from './core/interceptors/managehttp.interceptor';
import { APIInterceptor } from './core/interceptors/api.interceptor';
import { HttpCancelService } from './core/interceptors/httpcancel.service';
//components
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LoginComponent } from './logindetails/login/login.component';
import { ForgotPasswordComponent } from './logindetails/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './logindetails/change-password/change-password.component';
import { ResetPasswordComponent } from './logindetails/reset-password/reset-password.component';
import { LinkExpiredComponent } from './logindetails/link-expired/link-expired.component';
import { LogoutComponent } from './logindetails/logout/logout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { loaderComponent } from './layout/loader/loader.component';
import { CfsaddingComponent } from './pages/cfsadding/cfsadding.component';
import { VerifyotpComponent } from './logindetails/verifyotp/verifyotp.component';
import { APinvoiceRoutingModules } from './pages/apinvoicemodel/apinvoice-routing.module';
import { BookingallocationRoutingModule } from './pages/Bookingallocation/bookingallocation-routing.module';
import { FilterPipe } from './pages/settingmodel/role-management/filter.pipe';
import { MasterRoutingModule } from './pages/MasterData/MasterDate-routing.module';

import { VehicleinformationComponent } from './pages/settingmodel/vehicleinformation/vehicleinformation.component';
import { VehiclegridComponent } from './pages/settingmodel/vehicleinformation/vehiclegrid/vehiclegrid.component';
import { TruckmastergridComponent } from './pages/settingmodel/truckmaster/truckmastergrid/truckmastergrid.component';
import { CreatetruckmasterComponent } from './pages/settingmodel/truckmaster/createtruckmaster/createtruckmaster.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    LinkExpiredComponent,
    LogoutComponent,
    DashboardComponent,
    loaderComponent,
    UppercaseDirective,
    NumericOnlyDirective,
    VerifyotpComponent,
    CfsaddingComponent,
    CampaignChatComponent,FilterPipe,
    VehicleinformationComponent,
    VehiclegridComponent,
    TruckmastergridComponent,
    CreatetruckmasterComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BookingRoutingModule,
    ClientRoutingModule,
    InvoiceRoutingModule,
    SettingRoutingModule,
    VendorsRoutingModule,
    ReportsRoutingModule,
    LocationRoutingModule,
    APinvoiceRoutingModules,
    CampaignmasterRoutingModule,
    MasterRoutingModule,
    NgbModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    NgSelectModule,
    SelectDropDownModule,
    BookingallocationRoutingModule,
    Documentationroutingcomponent,
    AdminDashboardRoutingModule,
    NgApexchartsModule,
    NgMultiSelectDropDownModule,
    ToastrModule.forRoot({
      timeOut: 2500,
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ManageHttpInterceptor,
      multi: true,
    },
    LoaderService,
    HttpCancelService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
