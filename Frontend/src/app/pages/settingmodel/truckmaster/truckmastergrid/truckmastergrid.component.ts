import { Component } from '@angular/core';
import { Truckmasterinform, Truckmasterinfo } from '../../../../service/truckmaster';
import { Router } from '@angular/router';
import { SettingService } from '../../setting.service';

@Component({
  selector: 'app-truckmastergrid',
  templateUrl: './truckmastergrid.component.html',
  styleUrl: './truckmastergrid.component.css'
})
export class TruckmastergridComponent {
 trucks: Truckmasterinfo[] = [];

  statusdatas:any;
  createstatus:any;
  viewstatus:any;
  statusupdate:any;
  statusdelete:any;
  statusapporval:any;
  userId:any;
  role_id:any;

  constructor(
    private TruckmasterService: Truckmasterinform ,
    private router: Router,private StatusAPI:SettingService
  ) {}

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('id');
    this.role_id = sessionStorage.getItem('User_Roleid');
this.accessstatus();
    this.loadTruckmaster();   
  }
accessstatus(){
const name='truckmastergrid';
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


  // loadTruckmaster() {
  //   this.TruckmasterService.getTruckmaster().subscribe(
  //     (res: any) => {
  //       this.trucks = res.data; 
  //     },
  //     (err: any) => console.error('Error fetching vehicle data', err)
  //   );
  // }
loadTruckmaster() {
  this.TruckmasterService.getTruckmaster(this.userId).subscribe(
    (res: any) => {
      this.trucks = res.data;

      this.trucks.forEach(truck => {
        if (truck.status === 0 || truck.status === '0') {
          truck['spancolur1'] = 'badge badge-success';
          truck['statusname1'] = 'Active';
        } else if (truck.status === 1 || truck.status === '1') {
          truck['spancolur1'] = 'badge badge-danger';
          truck['statusname1'] = 'Inactive';
        }
      });
    },
    (err: any) => console.error('Error fetching truck data', err)
  );
}

  //Navigate to update page
  assignValue(id:any) {

     this.router.navigate(['/createtruckmaster'], {
      state: {
        roledata: id
       
      },
      });
  
  }

confirmDelete(id: number) {
  if (confirm('Are you sure you want to delete this vehicle?')) {
    console.log('Deleting Truck ID:', id); 
    this.TruckmasterService.deleteTruckmaster(id).subscribe(     
      (res: any) => {
        console.log('Delete API Response:', res);
        alert('Truck deleted successfully!');
        this.loadTruckmaster();
      },
      (error: any) => {
        console.error('Error deleting Truck:', error);
        alert('Delete failed — check console.');
      }
    );
  }
}
}
