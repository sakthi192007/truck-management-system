import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
//routes
import { RouterModule, Routes } from '@angular/router';
//service
import { AuthguardGuard } from './core/guards/authguard.guard';
///component
import { LoginComponent } from './logindetails/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LogoutComponent } from './logindetails/logout/logout.component';
import { ChangePasswordComponent } from './logindetails/change-password/change-password.component';
import { ForgotPasswordComponent } from './logindetails/forgot-password/forgot-password.component';
import { LinkExpiredComponent } from './logindetails/link-expired/link-expired.component';
import { ResetPasswordComponent } from './logindetails/reset-password/reset-password.component';
import { VerifyotpComponent } from './logindetails/verifyotp/verifyotp.component';
import { CfsaddingComponent } from './pages/cfsadding/cfsadding.component';
import { CampaignChatComponent } from './campaign-chat/campaign-chat.component';

import { VehicleinformationComponent } from './pages/settingmodel/vehicleinformation/vehicleinformation.component';
import { VehiclegridComponent } from './pages/settingmodel/vehicleinformation/vehiclegrid/vehiclegrid.component';
import { TruckmastergridComponent } from './pages/settingmodel/truckmaster/truckmastergrid/truckmastergrid.component';
import { CreatetruckmasterComponent } from './pages/settingmodel/truckmaster/createtruckmaster/createtruckmaster.component';

const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'Login',
    component: LoginComponent,
  },
  {
    path: 'Logout',
    component: LogoutComponent,
  },
  {
    path: 'ChangePassword',
    component: ChangePasswordComponent,
  },
  {
    path: 'verifyotp',
    component: VerifyotpComponent,
  },
  {
    path: 'ForgotPassword',
    component: ForgotPasswordComponent,
  },
  {
    path: 'LinkExpired',
    component: LinkExpiredComponent,
  },
  {
    path: 'ResetPassword',
    component: ResetPasswordComponent,
  },
  {
    path: 'Cfsadding',
    component: CfsaddingComponent,
    canActivate: [AuthguardGuard],
  },
  {
    path: 'Dashboard',
    component: DashboardComponent,
    canActivate: [AuthguardGuard],

  },
  {
    path: 'CampaignChat',
    component: CampaignChatComponent,
  },
  {
    path: 'vehicleinformation',
    component: VehicleinformationComponent,
  },
{
path:'vehicleinformationgrid',
component:VehiclegridComponent,
},
{
path:'createtruckmaster',
component:CreatetruckmasterComponent,
},
{
path:'truckmastergrid',
component:TruckmastergridComponent,
},
   {
    path: 'ADashboard',
   loadChildren: () =>
      import('./pages/AdminDashboard/admindashboard.module').then(
        (m) => m.AdminDashboardModule
      ),
  },


  {
    path: 'Booking',
    loadChildren: () =>
      import('./pages/bookingmodel/booking.module').then(
        (m) => m.BookingModule
      ),
  },
  {
    path: 'Client',
    loadChildren: () =>
      import('./pages/clientmodel/client.module').then((m) => m.ClientModule),
  },
  {
    path: 'Invoice',
    loadChildren: () =>
      import('./pages/invoicemode/invoice.module').then((m) => m.InvoiceModule),
  },
  {
    path: 'Setting',
    loadChildren: () =>
      import('./pages/settingmodel/setting.module').then(
        (m) => m.SettingModule
      ),
  },
  {
    path: 'vendors',
    loadChildren: () =>
      import('./pages/vendormodel/vendor.module').then((m) => m.VendorsModule),
  },
  {
    path: 'Report',
    loadChildren: () =>
      import('./pages/report/report.module').then((m) => m.ReportModule),
  },
  {
    path: 'APInvoice',
    loadChildren: () =>
      import('./pages/apinvoicemodel/apinvoice.module').then(
        (m) => m.APinvoiceModule
      ),
  },
  {
    path: 'Location',
    loadChildren: () =>
      import('./pages/Location/locationroute.module').then(
        (m) => m.LocationModule
      ),
  },
  {
    path: 'Campaignmasters',
    loadChildren: () =>
      import('./pages/campaignmaster/campaignmaster.module').then(
        (m) => m.campaignmasterModule
      ),
  },
  {
    path: 'Ballocation',
    loadChildren: () =>
      import('./pages/Bookingallocation/bookingallocation.module').then(
        (m) => m.BookingallocationModule
      ),
  },
  {
    path: 'Documentation',
    loadChildren: () =>
      import('./pages/documentation/documentation.module').then(
        (m) => m.DocumentationModule
      ),
  },

  {
   path: 'Mastercreation', 
   loadChildren:() =>
    import('./pages/MasterData/MasterData-module').then((m) =>m.MasterDataModule),
  }

];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
