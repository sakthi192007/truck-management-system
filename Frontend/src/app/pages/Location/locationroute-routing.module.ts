import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from 'src/app/core/guards/authguard.guard'; 
import { LocationroutemapComponent } from './locationroutemap/locationroutemap.component';
import { MasterlocationgridComponent } from './masterlocationgrid/masterlocationgrid.component';

const routes: Routes = [
    {
         path: 'LocationCreation',
            component: LocationroutemapComponent,
            canActivate: [AuthguardGuard] 
    },
    {
        path: 'LocationGrid',
           component: MasterlocationgridComponent,
           canActivate: [AuthguardGuard] 
   }
]

@NgModule({
    imports: [RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
  })
  export class LocationRoutingModule { }