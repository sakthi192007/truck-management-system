import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from 'src/app/core/guards/authguard.guard'; 
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
const routes: Routes = [
 {
      path: 'AdminDashboard',
      component: AdminDashboardComponent,
      canActivate: [AuthguardGuard] 
    }
];
 @NgModule({
    imports: [RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
  })
  export class AdminDashboardRoutingModule { }