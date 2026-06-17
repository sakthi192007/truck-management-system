import { Component, OnInit } from '@angular/core';
import { Vehicleinform, VehicleInfo } from '../../../../service/Vehicleinform';
import { Router } from '@angular/router';
import { SettingService } from '../../setting.service';

@Component({
  selector: 'app-vehiclegrid',
  templateUrl: './vehiclegrid.component.html',
  styleUrls: ['./vehiclegrid.component.css']
})
export class VehiclegridComponent implements OnInit {

  vehicles: VehicleInfo[] = [];
  statusdatas:any;
  createstatus:any;
  viewstatus:any;
  statusupdate:any;
  statusdelete:any;
  statusapporval:any;
  userId:any;
  role_id:any;
  constructor(
    private vehicleService: Vehicleinform,
    private router: Router,private StatusAPI:SettingService
  ) {}

  ngOnInit(): void {
     this.userId = sessionStorage.getItem('id');
    this.role_id = sessionStorage.getItem('User_Roleid');
this.accessstatus();
    this.loadVehicles();
  }
  accessstatus(){
const name='vehicleinformationgrid';
    this.StatusAPI.accessstatus(this.role_id,name).subscribe(value => {
      const statusvalues = value;
      this.statusdatas = statusvalues['data']
      this.createstatus=this.statusdatas[0].CanCreate;
      this.viewstatus=this.statusdatas[0].CanView;
      this.statusupdate=this.statusdatas[0].CanEdit;
      this.statusdelete=this.statusdatas[0].CanDelete;
      this.statusapporval=this.statusdatas[0].CanReport;
    })						
}

ngAfterViewInit(): void {
  setTimeout(() => {
    (window as any).initDataTable();

    const btns = document.querySelector('.dt-buttons');
    const btnTarget = document.getElementById('datatable-buttons');
    if (btns && btnTarget) {
      btnTarget.appendChild(btns);
    }

    const search = document.querySelector('.dataTables_filter');
    const leftBox = document.querySelector('.left-search');
    if (search && leftBox) {
      leftBox.appendChild(search);

      const searchLabel = search.querySelector('label');
      if (searchLabel) {
        const input = searchLabel.querySelector('input');
        if (input) {
          search.appendChild(input);
          searchLabel.remove();
        }
      }

      const searchInput = search.querySelector('input') as HTMLInputElement;
      if (searchInput) {
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = '200px';

        searchInput.classList.add('form-control', 'form-control-sm');
        searchInput.style.paddingLeft = '30px';
        searchInput.style.width = '100%';
        searchInput.placeholder = 'Search...';
        searchInput.style.border = '1px solid #007bff';

        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-search');
        icon.style.position = 'absolute';
        icon.style.left = '8px';
        icon.style.top = '50%';
        icon.style.transform = 'translateY(-50%)';
        icon.style.color = '#007bff';
        icon.style.pointerEvents = 'none';

        searchInput.parentNode?.insertBefore(wrapper, searchInput);
        wrapper.appendChild(searchInput);
        wrapper.appendChild(icon);
      }

      (search as HTMLElement).style.marginTop = '0';
    }
  }, 1000);
}
  // Load all vehicle records

  loadVehicles() {


this.vehicleService.getVehicles(this.userId).subscribe(
  (res: any) => {
    this.vehicles = res.data;

    this.vehicles.forEach(vehicle => {
     if (vehicle.status === 0 || vehicle.status === '0') {
          vehicle['spancolur1'] = 'badge badge-success';
          vehicle['statusname1'] = 'Active';
        } else if (vehicle.status === 1 || vehicle.status === '1') {
          vehicle['spancolur1'] = 'badge badge-danger';
          vehicle['statusname1'] = 'Inactive';
        }
    });
  },
  (err: any) => console.error('Error fetching truck data', err)
);


  }

  // Navigate to update page
  assignValue(id:any) {

    this.router.navigate(['/vehicleinformation'], {
      state: {
        roledata: id
       
      },
    });

    
  }
confirmDelete(id: number) {
  if (confirm('Are you sure you want to delete this vehicle?')) {
    console.log('Deleting vehicle ID:', id); 
    this.vehicleService.deleteVehicle(id).subscribe(
      (res:any) => {
        console.log('Delete API Response:', res);
        alert('Vehicle deleted successfully!');
        this.loadVehicles();
      },
      (error:any) => {
        console.error('Error deleting vehicle:', error);
        alert('Delete failed — check console.');
      }
    );
  }
}

}
