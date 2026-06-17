import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from 'src/app/core/guards/authguard.guard'; 
//import { CampaignmasterComponent } from './campaignmaster.component';
import{CampaignmasterComponent } from './Campaigncreate/campaignmaster.component';
import{WhatsappComponent} from './CampaignGrid/whatsapp.component';
const routes: Routes =[
    {
          path: 'Campaign',
          component: CampaignmasterComponent,
          canActivate: [AuthguardGuard] 
        },
        {
          path: 'Campaignmaster',
          component: WhatsappComponent,
          canActivate: [AuthguardGuard] 
        }
];
 
  @NgModule({
    imports: [RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
  })
  export class CampaignmasterRoutingModule { }