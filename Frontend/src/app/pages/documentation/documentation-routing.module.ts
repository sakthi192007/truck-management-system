import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from 'src/app/core/guards/authguard.guard';
import { DoccreationComponent } from './doccreation/doccreation.component';
import { DocgridComponent } from './docgrid/docgrid.component';
const routes: Routes = [
   
    {
        path: 'docgrid',
        component: DocgridComponent,
        canActivate: [AuthguardGuard]
    },
    {
        path: 'doccreation',
        component: DoccreationComponent,
        canActivate: [AuthguardGuard]
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class Documentationroutingcomponent { }