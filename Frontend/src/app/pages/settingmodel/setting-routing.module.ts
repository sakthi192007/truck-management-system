import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from 'src/app/core/guards/authguard.guard'; 
//component
import { ProfileComponent } from './profile/profile.component';
import { UsercreationComponent } from './usercreation/usercreation.component';
import {SubmenuComponent} from './submenu/submenu.component';
import {ParentmenuComponent} from './parentmenu/parentmenu.component';
import {IconComponent} from './icon/icon.component';
import {GroupmasterComponent} from './groupmaster/groupmaster.component';
import { ChildmenuComponent } from './childmenu/childmenu.component';
import { RoleManagementComponent } from './role-management/role-management.component';

const routes: Routes = [
    {
      path: 'User',
      component: UsercreationComponent,
      canActivate: [AuthguardGuard] 
    },
    
    {
      path: 'Profile',
      component: ProfileComponent,
      canActivate: [AuthguardGuard] 
    },
    
    {
      path: 'Submenu',
      component: SubmenuComponent,
      canActivate: [AuthguardGuard] 
    }
    ,
    
    {
      path: 'Parentmenu',
      component: ParentmenuComponent,
      canActivate: [AuthguardGuard] 
    }
    ,
    
    {
      path: 'Icon',
      component: IconComponent
    },  {
      path: 'Groupmaster',
      component: GroupmasterComponent,
      canActivate: [AuthguardGuard] 
    },
      {
      path: 'Childmenu',
      component: ChildmenuComponent,
      canActivate: [AuthguardGuard]
    },
      {
      path: 'GroupmasterCreate',
      component: RoleManagementComponent,
      canActivate: [AuthguardGuard]
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
  })
  export class SettingRoutingModule { }