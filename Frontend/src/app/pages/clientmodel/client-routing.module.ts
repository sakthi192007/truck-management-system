import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from 'src/app/core/guards/authguard.guard'; 
import { CreateclientComponent } from './createclient/createclient.component'; 
import { ClientGridComponent } from './client-grid/client-grid.component'; 
import { ClientpricedetailsComponent } from './clientpricedetails/clientpricedetails.component';

const routes: Routes = [
    {
        path: 'CreateClient',
        component: CreateclientComponent,
        canActivate: [AuthguardGuard] 
      },
      {
        path: 'ClientpriceDetails',
        component: ClientpricedetailsComponent,
        canActivate: [AuthguardGuard] 
      },
      {
        path: 'ClientDetails',
        component: ClientGridComponent,
        canActivate: [AuthguardGuard] 
      },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes),
    ],
    exports: []
  })
  export class ClientRoutingModule { }