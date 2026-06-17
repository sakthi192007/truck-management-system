import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SettingService } from '../setting.service';

type PermissionAction = 'Menu' |'View' | 'Create' | 'Edit' | 'Delete' | 'Approval';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent implements OnInit {
  GroupMasterform!: FormGroup;
  actions: PermissionAction[] = ['Menu','Create', 'Edit', 'View', 'Delete', 'Approval'];

  searchTerm: string = '';
  notificationMessage: string = '';
  filteredPermissions: any;
  roles: any;
  User_ID: any;
  role_id: any;
  submitted = false;
  currentRole: any = { name: '', group: '', description: '', permissions: [] };
  menunameoption: any[] = [];
  menuPermissions: any;
  isLoading = true;
  checkboxError: boolean = false;
  buttontext = 'Submit';
  id: any;
  getassignvalue: any;
  menus: any;
  isUpdate: any;
  

  Namelist:any

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private notifyService: NotificationService,
    private APIServies: SettingService
  ) {
  }
 ngOnInit(): void {
  this.User_ID = sessionStorage.getItem('id');
  this.role_id = sessionStorage.getItem('User_Roleid');
this.GroupMasterform = this.formBuilder.group({
  GM_PK: [0], // <-- default 0, will be overwritten when editing
  GM_Role: ['', Validators.required],
  GM_GroupName: [''],
  GM_Description: [''],
  GM_Accessstatus1: [false],
  GM_Accessstatus2: [false],
  GM_Accessstatus3: [false],
  GM_Accessstatus4: [false],
  GM_Accessstatus5: [false],
  permissionsArray: this.formBuilder.array([]) // each menu row
});


  this.getrole();
  const state = history.state;
  if (state.id && state.mode === 'update') {
    this.isUpdate = true;
    this.id = state.id;
    this.buttontext = 'Update';
  } else {
    this.isUpdate = false;
    this.buttontext = 'Submit';
  }
  this.getloadmenuname();
}


loadGroupMaster(id: any): void {
  this.APIServies.getbyidgroupmaster(id).subscribe({
    next: (res: any) => {
      if (!res?.GroupMaster) return;

      const groupMaster = res.GroupMaster;
      const permissions = res.Permissions || [];

       this.APIServies.GetRoleupdate(groupMaster.GM_Role).subscribe(value => {
      let rolevalue = value;
      this.roles = rolevalue['data'];
       setTimeout(() => {
    this.GroupMasterform.patchValue({
      GM_Role: groupMaster.GM_Role?.toString()
    });
  });
  
    })
      // Patch form values including GM_PK
this.GroupMasterform.patchValue({
  GM_PK: groupMaster.GM_PK, // <-- important!
  GM_GroupName: groupMaster.GM_GroupName,
  GM_Description: groupMaster.GM_Description,
  GM_Accessstatus1: !!groupMaster.GM_Accessstatus1,
  GM_Accessstatus2: !!groupMaster.GM_Accessstatus2,
  GM_Accessstatus3: !!groupMaster.GM_Accessstatus3,
  GM_Accessstatus4: !!groupMaster.GM_Accessstatus4
});


  interface MenuPermission {
  Menukey: number;
  module: string;
  CanMenu?: boolean;
  CanCreate?: boolean;
  CanEdit?: boolean;
  CanView?: boolean;
  CanDelete?: boolean;
  CanReport?: boolean;
}

const updatedMenus = this.menuPermissions.map((menu: MenuPermission) => {
  const match = permissions.find((p: any) => +p.Menukey === +menu.Menukey);
  return {
    Menukey: menu.Menukey,
    module: menu.module,
    CanMenu: match ? !!+match.CanMenu : false,
    CanCreate: match ? !!+match.CanCreate : false,
    CanEdit: match ? !!+match.CanEdit : false,
    CanView: match ? !!+match.CanView : false,
    CanDelete: match ? !!+match.CanDelete : false,
    CanReport: match ? !!+match.CanReport : false
  };
});

      this.loadPermissionControls(updatedMenus);
    },
    error: err => console.error('Error loading group master', err)
  });
}

  getFormControl(index: number): FormControl {
    return (this.GroupMasterform.get('checkboxes') as FormArray).controls[index] as FormControl;
  }
  checkboxArray(array: any[], size: number): any[][] {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }
  get f() {
    return this.GroupMasterform.controls;
  }
  onRoleChange(event: any) {
     const selectedRoleCode = event.target.value;
     this.APIServies.Getnamelist(selectedRoleCode, this.User_ID).subscribe(value => {
      let rolevalue = value;
      this.Namelist = rolevalue['data'];
    })
  }
  getrole() {
    this.APIServies.GetRoles(this.role_id).subscribe(value => {
      let rolevalue = value;
      this.roles = rolevalue['data'];
    })
  }
submit() {
  this.submitted = true;
  if (this.GroupMasterform.invalid) {
    this.notifyService.showError("Please fill all required fields.", "Validation Error");
    return;
  }

  const permissions = this.permissionsArray.value.map((p: any) => ({
    Menukey: p.Menukey,
    CanMenu: p.CanMenu ? 1 : 0,
    CanCreate: p.CanCreate ? 1 : 0,
    CanEdit: p.CanEdit ? 1 : 0,
    CanView: p.CanView ? 1 : 0,
    CanDelete: p.CanDelete ? 1 : 0,
    CanReport: p.CanReport ? 1 : 0
  }));

  const payload = {
    GM_GroupName: this.GroupMasterform.value.GM_GroupName,
    GM_Role: this.GroupMasterform.value.GM_Role,
    GM_Description: this.GroupMasterform.value.GM_Description,
    Permissions: permissions
  };

// in submit()
const gmPk = this.GroupMasterform.value.GM_PK;
console.log('Updating GM_PK:', gmPk); // Add this to debug

  if (gmPk && gmPk > 0) {
    // Update
    this.APIServies.Updategroupmaster(gmPk, payload).subscribe({
      next: () => {
        this.notifyService.showSuccess("Groupmaster updated successfully.", "Groupmaster");
        setTimeout(() => window.location.reload(), 1500);
      },
      error: err => {
        console.error(err);
        this.notifyService.showError("Something went wrong during update.", "Groupmaster");
      }
    });
  } else {
    // Insert
    this.APIServies.insertgroupmaster(payload).subscribe({
      next: () => {
        this.notifyService.showSuccess("Groupmaster created successfully.", "Groupmaster");
        setTimeout(() => window.location.reload(), 1500);
      },
      error: err => {
        console.error(err);
        this.notifyService.showError("Something went wrong during creation.", "Groupmaster");
      }
    });
  }
}



  resetForm() {
    this.GroupMasterform.reset();
    this.loadPermissionControls(this.menuPermissions);
    this.submitted = false;
  }


getloadmenuname(): void {
  this.isLoading = true;
  this.APIServies.Loadmenuname().subscribe({
    next: (res: any) => {
      if (res?.data?.length) {
        this.menuPermissions = res.data.map((menu: any) => ({
          Menukey: menu.Menukey,
          module: menu.Menuname,
          CanMenu:false,
          CanCreate: false,
          CanEdit: false,
          CanView: false,
          CanDelete: false,
          CanReport: false
        }));
        this.filteredPermissions = [...this.menuPermissions];

        if (this.isUpdate && this.id) {
          this.loadGroupMaster(this.id);
        } else {
          this.loadPermissionControls(this.menuPermissions);
        }
      }
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error loading menu names', err);
      this.isLoading = false;
    }
  });
}


loadPermissionControls(menuList: any[]): void {
  const permissionsArray: FormArray<FormGroup> = new FormArray<FormGroup>([]);

  menuList.forEach((menu: any) => {
    const group = this.formBuilder.group({
      Menukey: new FormControl(menu.Menukey),
      module: new FormControl(menu.module),
      CanMenu: new FormControl(!!menu.CanMenu),
      CanCreate: new FormControl(!!menu.CanCreate),
      CanEdit: new FormControl(!!menu.CanEdit),
      CanView: new FormControl(!!menu.CanView),
      CanDelete: new FormControl(!!menu.CanDelete),
      CanReport: new FormControl(!!menu.CanReport)
    });

    permissionsArray.push(group);
  });

  this.GroupMasterform.setControl('permissionsArray', permissionsArray);
}


 get permissionsArray(): FormArray {
    return this.GroupMasterform.get('permissionsArray') as FormArray;
  }
  minSelectedCheckboxes(min = 1) {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      const totalSelected = formArray.controls
        .map(ctrl => ctrl.value)
        .filter(value => value === true).length;

      return totalSelected >= min ? null : { required: true };
    };
  }
  onSearchChange(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    this.filteredPermissions = this.menuPermissions.filter((menu: { module: string; }) =>
      menu.module.toLowerCase().includes(searchValue)
    );
  }
}
