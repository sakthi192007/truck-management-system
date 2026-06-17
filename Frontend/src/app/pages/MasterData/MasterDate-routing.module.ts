import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from 'src/app/core/guards/authguard.guard'; 
//component
import { CreationDetailsComponent } from './creation-details/creation-details.component';
import { CreationgridComponent } from './creationgrid/creationgrid.component';
import { SubadminComponent } from './subadmin/subadmin.component';
import { BranchComponent } from './branch/branch.component';
const routes: Routes = [
    {
      path: 'Creation',
     component: CreationDetailsComponent,
      canActivate: [AuthguardGuard] 
    },
    {
      path: 'Creationgrid',
     component: CreationgridComponent,
      canActivate: [AuthguardGuard] 
    },
    {
      path: 'Branchgrid',
     component: SubadminComponent,
      canActivate: [AuthguardGuard] 
    },
    {
      path: 'Branch',
     component: BranchComponent,
      canActivate: [AuthguardGuard] 
    },
    
    
    
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
  })
  export class MasterRoutingModule { }