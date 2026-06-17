import { Component, OnInit, ViewChild, OnDestroy,AfterViewInit } from '@angular/core';
import { BookingService } from '../booking.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/service/notification.service';
import { AuthService } from 'src/app/service/auth.service';
import { DataTableService } from '../../data-table.service';
import { DataTableDirective } from 'angular-datatables';
import { SettingService } from '../../settingmodel/setting.service';
declare var $: any;


@Component({
  selector: 'app-booking-grid',

  templateUrl: './booking-grid.component.html',
  styleUrl: './booking-grid.component.css'
})
export class BookingGridComponent implements OnInit,AfterViewInit {
  
  deleteform!: FormGroup;
  submitted = false;
  deleteformim!: FormGroup;
  submittedim = false;

  @ViewChild(DataTableDirective, { static: false })
  tabledetail: any;
  dtOptions: any = {};
  // dtOptions: DataTablesOptions = {};
  dtTrigger1: Subject<any> = new Subject<any>();
  dtTrigger: Subject<any> = new Subject<any>();

  reloaded = false;
  Success = 'false';
  error = 'false';
  errortext: string = "";
  successtext: any = '';
  bookingnumber: any;
  bookingname: any;
  bookingdate: any;
  Email: any;
  CustomerAddress: any; 
  PortOfDischarge: any;
  exportCargoWeight: any;
  allvendordetaildata: any;
  buttontext: string = '';
  BR_keys: any
  booked!: any[];
  importLinerBkgno:any;
  tables: any;
  currentuser: any;
  userId: any;
  role_id: any;
  vendorId: any;
  vehiclenum: any;
  vendorselect: any;
  vendordata: any;
  invoiceitems: any;

  //import
  tablegridviewsimport: any;
  importgridview!: any[];
  importBookingArival!: any[];
  tablesimport: any;
  importPortOfDischarge:any;
  importky: any
  importbookingnumber: any;
  importbookingname: any;
  importbookingdate: any
  importEmail: any;
  Bookingdata: any;
  BookingLineitems: any;
  //export
  exportgridview!: any[];
  tablegridviews: any;
  ExBookingLineitems: any;
  importCustomerAddress:any;
  exportLinerBkgno:any;
  exportky: any;
  exportbookingnumber: any;
  exportbookingname: any;
  exportbookingdate: any;
  exportEmail: any;
  exportContainerPlacementDate: any;
  exportCompanyName:any;
  exportCustomerAddress:any;
  exportPortOfDischarge:any;
  expkey: any
  Exky: any
  Exbookingnumber: any
  Exbookingname: any
  Exbookingdate: any
  ExEmail: any
  Exportdataevent: any
  eventlist: any
  exportfiledata: any;
  exportfiledata1: any;
  exportfiledata2: any;
  exportfiledata3: any;
  exportfiledata4: any;
  exportfiledata5: any;
  exportfiledata6: any;
  Imfiledata: any;
  Imfiledata1: any;
  Imfiledata2: any;
  Imfiledata3: any;
  Imfiledata4: any;
  searchTerm: any;
  fromDateCompleted: any;
  toDateCompleted: any;
  fromDatePending: any;
  toDatePending: any;
  fromDateInprogress: any;
  toDateInprogress: any;
  fromDateCancelled: any;
  toDateCancelled: any;


  statusdatas:any;
  createstatus:any;
  viewstatus:any;
  statusupdate:any;
  statusdelete:any;
  statusapporval:any;

  constructor(private formBuilder: FormBuilder,private APIServies: BookingService, private router: Router, private notifyService: NotificationService, private authService: AuthService, private dataTableService: DataTableService,private StatusAPI:SettingService) {
    this.deleteform = this.formBuilder.group({
      deletename: this.formBuilder.control('', [Validators.required])
    })
    this.deleteformim = this.formBuilder.group({
      importdeletename: this.formBuilder.control('', [Validators.required])
    })

  }

 ngAfterViewInit(): void {
  setTimeout(() => {
    (window as any).initDataTable();

    const setupTable = (
      wrapperClass: string,
      btnTargetId: string,
      leftSearchClass: string
    ) => {
      const btns = document.querySelector(`.${wrapperClass} .dt-buttons`);
      const btnTarget = document.getElementById(btnTargetId);
      if (btns && btnTarget) {
        btnTarget.appendChild(btns);
      }

      const search = document.querySelector(`.${wrapperClass} .dataTables_filter`);
      const leftBox = document.querySelector(`.${leftSearchClass}`);
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
    };

    setupTable('pending-wrapper', 'datatable-buttons-pending', 'left-search');
    setupTable('completed-wrapper', 'datatable-buttons-completed', 'left-search-completed');
    setupTable('inprogress-wrapper', 'datatable-buttons-inprogress', 'left-search-inprogress');
    setupTable('cancelled-wrapper', 'datatable-buttons-cancelled', 'left-search-cancelled');

  }, 1000);
}

applyDateFilter()
  {
  }


  setDateRange(range: string) {
    const today = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    switch (range) {
      case 'today':
        start = end = today;
        break;
      case 'yesterday':
        start = end = new Date(today);
        start.setDate(today.getDate() - 1);
        break;
      case 'last7':
        end = new Date();
        start = new Date();
        start.setDate(end.getDate() - 7);
        break;
      case 'last30':
        end = new Date();
        start = new Date();
        start.setDate(end.getDate() - 30);
        break;
      case 'last60':
        end = new Date();
        start = new Date();
        start.setDate(end.getDate() - 60);
        break;
    }

    if (start && end) {
      this.fromDatePending = start.toISOString().split('T')[0];
      this.toDatePending = end.toISOString().split('T')[0];
      this.applyDateFilter();
    }

    if (start && end) {
      this.fromDateCompleted = start.toISOString().split('T')[0];
      this.toDateCompleted = end.toISOString().split('T')[0];
      this.applyDateFilter();
    }

     if (start && end) {
      this.fromDateInprogress = start.toISOString().split('T')[0];
      this.toDateInprogress = end.toISOString().split('T')[0];
      this.applyDateFilter();
    }

    if (start && end) {
      this.fromDateCancelled = start.toISOString().split('T')[0];
      this.toDateCancelled = end.toISOString().split('T')[0];
      this.applyDateFilter();
    }
    
  }

// 

get filteredData() {
  if (!this.searchTerm && !this.fromDatePending && !this.toDatePending) {
    return this.importgridview;
  }
  return this.importgridview.filter(bird => {
    let matchesSearch = true;
    let matchesDateRange = true;

    if (this.searchTerm) {
      matchesSearch = Object.values(bird).some(value =>
        String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    const Bookingdate = new Date(bird.createdon);
    const from = this.fromDatePending ? new Date(this.fromDatePending) : null;
    const to = this.toDatePending ? new Date(this.toDatePending) : null;

    if (from && Bookingdate < from) matchesDateRange = false;
    if (to && Bookingdate > to) matchesDateRange = false;

    return matchesSearch && matchesDateRange;
  });
}

get filteredDataCompleted() {
  if (!this.searchTerm && !this.fromDateCompleted && !this.toDateCompleted) {
    return this.importBookingArival;
  }
  return this.importBookingArival.filter(bird => {
    let matchesSearch = true;
    let matchesDateRange = true;

    if (this.searchTerm) {
      matchesSearch = Object.values(bird).some(value =>
        String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    const Bookingdate = new Date(bird.createdon);
    const from = this.fromDateCompleted ? new Date(this.fromDateCompleted) : null;
    const to = this.toDateCompleted ? new Date(this.toDateCompleted) : null;

    if (from && Bookingdate < from) matchesDateRange = false;
    if (to && Bookingdate > to) matchesDateRange = false;

    return matchesSearch && matchesDateRange;
  });
}
get exportfilteredData() {
  if (!this.searchTerm && !this.fromDateInprogress && !this.toDateInprogress) {
    return this.exportgridview;
  }
  return this.exportgridview.filter(bird => {
    let matchesSearch = true;
    let matchesDateRange = true;

    if (this.searchTerm) {
      matchesSearch = Object.values(bird).some(value =>
        String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    const Bookingdate = new Date(bird.createdon);
    const from = this.fromDateInprogress ? new Date(this.fromDateInprogress) : null;
    const to = this.toDateInprogress ? new Date(this.toDateInprogress) : null;

    if (from && Bookingdate < from) matchesDateRange = false;
    if (to && Bookingdate > to) matchesDateRange = false;

    return matchesSearch && matchesDateRange;
  });
}

get exportfilteredDataCompleted() {
  if (!this.searchTerm && !this.fromDateCancelled && !this.toDateCancelled) {
    return this.booked;
  }
  return this.booked.filter(bird => {
    let matchesSearch = true;
    let matchesDateRange = true;

    if (this.searchTerm) {
      matchesSearch = Object.values(bird).some(value =>
        String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    const Bookingdate = new Date(bird.createdon);
    const from = this.fromDateCancelled ? new Date(this.fromDateCancelled) : null;
    const to = this.toDateCancelled ? new Date(this.toDateCancelled) : null;

    if (from && Bookingdate < from) matchesDateRange = false;
    if (to && Bookingdate > to) matchesDateRange = false;

    return matchesSearch && matchesDateRange;
  });
}
  ngOnInit(): void {

    this.userId = sessionStorage.getItem('id');
    this.role_id = sessionStorage.getItem('User_Roleid');

    this.accessstatus();
    this.getallgrid();
    this.getallgridimport();
  }
accessstatus(){
const name='BookingDetails';
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

  //export
  export() {
    this.router.navigate(['/CreateBooking'], {
      state: {
        exportimport: 0,
        miledat: 0,
      }
    })
  }
  getallgrid() {
    this.APIServies.bookingGrid(this.userId, this.role_id).subscribe(value => {
      this.tablegridviews = value;
      this.exportgridview = this.tablegridviews['data']

      this.exportgridview.forEach(element => {
        if (element.status == 0) {
          element["Exspancolur1"] = "badge badge-warning";
          element["Exstatusname1"] = "Booking Confirmation ";
          

        } 
        else if (element.status == 2) {
          element["Exspancolur1"] = "badge badge-danger";
          element["Exstatusname1"] = "Booking Delete";

        }
      })
      this.dtTrigger1.next(this.exportgridview);

    });

    this.APIServies.bookeddetails(this.userId, this.role_id).subscribe(value => {
      this.tables = value;
      this.booked = this.tables['data']
      this.booked.forEach(element => {
        if (element.status == 1) {
          element["Exspancolur1"] = "badge badge-warning";
          element["Exstatusname1"] = "Booking confirmed ";


        } else if (element.status == 4) {
          element["Exspancolur1"] = "badge badge-danger";
          element["Exstatusname1"] = "Booking Cancellation";

        }
        if (element.EM_id == 7) {
          element["exspancolurevent"] = "badge badge-success";
          element["exstatusnameevent"] = "Port Gate In";
           element["Exspancolur1"] = "badge badge-success";
          element["Exstatusname1"] = "Completed";
        }
        else if (element.EM_id == 6) {
          element["exspancolurevent"] = "badge badge-success";
          element["exstatusnameevent"] = "CFS Gate Out";
        }
        else if (element.EM_id == 5) {
          element["exspancolurevent"] = "badge badge-success";
          element["exstatusnameevent"] = "CFS Gate In";
        }
        else if (element.EM_id == 4) {
          element["exspancolurevent"] = "badge badge-success";
          element["exstatusnameevent"] = "Container Gate Out From Factory";
        } else if (element.EM_id == 3) {
          element["exspancolurevent"] = "badge badge-success";
          element["exstatusnameevent"] = "Container Reported at Factory ";
        }
        else if (element.EM_id == 2) {
          element["exspancolurevent"] = "badge badge-success";
          element["exstatusnameevent"] = "Container Pick Up Completed ";
        }
        else if (element.EM_id == 1) {
          element["exspancolurevent"] = "badge badge-success";
          element["exstatusnameevent"] = "Trailer Reached at Empty Yard ";
        }
      })
      this.dtTrigger1.next(this.booked);
    });
  }
 booking(EB_id: any) {
    this.exportky = EB_id;
  }
  ExportApproval() {
    this.APIServies.Exportemail(this.exportky).subscribe((value) => {
        this.notifyService.showSuccess("Booking successfully.", "Booking Details");
        this.notifyService.showSuccess("Email Sent successfully.", "Email");
        setTimeout(function () {
            window.location.reload();
        }, 2000);
    });
}



  bookingcancellation(EB_id: any) {
    this.Exky = EB_id;
  }
  bookingcancelexport() {
    this.APIServies.ExportBookingcancel(this.Exky).subscribe((value) => {
      this.notifyService.showSuccess("Booking Cancel successfully.", "Booking Details");
      this.notifyService.showSuccess("Email Sent successfully.", "Email");
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    })
  }
  views1(EB_id: any) {
    this.buttontext = 'Update';
    this.BR_keys = EB_id;
    this.APIServies.getbookingall(this.BR_keys).subscribe((value) => {
      this.allvendordetaildata = value['data'];
      this.ExBookingLineitems = value['lineitems'];
    
      this.router.navigate(['/CreateBooking'], {
        state: {
          Exportdata: this.allvendordetaildata,
          Exportlineitems: this.ExBookingLineitems,
          
          exportimport: 0,
          views: '0',
          miledat: 0,
        },
      });
    });
  }
  views1mile(EB_id: any) {
    this.buttontext = 'Update';
    this.BR_keys = EB_id;
    this.APIServies.getbookingall(this.BR_keys).subscribe((value) => {
      this.allvendordetaildata = value['data'];
      this.ExBookingLineitems = value['lineitems'];
      
      this.router.navigate(['/CreateBooking'], {
        state: {
          Exportdata: this.allvendordetaildata,
          Exportlineitems: this.ExBookingLineitems,
         
          exportimport: 0,
          views: '0',
          miledat: 1,
        },
      });
    });
  }
  Assignvaluedata(EB_id: any) {
    this.buttontext = 'Update';
    this.BR_keys = EB_id;
    this.APIServies.getbookingall(this.BR_keys).subscribe((value) => {
      this.allvendordetaildata = value['data'];
      this.ExBookingLineitems = value['lineitems'];
      this.router.navigate(['/CreateBooking'], {
        state: {
          Exportdata: this.allvendordetaildata,
          Exportlineitems: this.ExBookingLineitems,
          
          exportimport: 0,
          views: '1',
          miledat: 1

        },
      });
    });
  }
  Assignvalue(EB_id: any) {
    this.buttontext = 'Update';
    this.BR_keys = EB_id;
    this.APIServies.getbookingall(this.BR_keys).subscribe((value) => {
      this.allvendordetaildata = value['data'];
      this.ExBookingLineitems = value['lineitems'];
   
      this.router.navigate(['/CreateBooking'], {
        state: {
          Exportdata: this.allvendordetaildata,
          Exportlineitems: this.ExBookingLineitems,
          
          exportimport: 0,
          views: '1',
          miledat: 0,
        },
      });
    });

  }
  Deleterole(EB_id: any) {
    this.BR_keys = EB_id;
  }
  get f() {
    return this.deleteform.controls;
  }
  deleteexport() {

    this.submitted = true;
    if (this.deleteform.invalid) {
      return;
    }
    let registerdata = this.deleteform.value;
    let formvalues ={
      description :registerdata.deletename,
    }
    this.APIServies.Deletebooking(this.BR_keys,formvalues).subscribe(value => {
      this.notifyService.showSuccess("Booking details deleted successfully.", "Booking details");
      $("#Deleterop").modal("hide");
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    },
      (error: any) => {
        this.notifyService.showError("Something went to wrong", "Booking details");
      }
    );
  }
  cancel() {
    $("#BookingExconfirm").modal("hide");
  }
  cancelex() {
    $("#Deleterop").modal("hide");
  }
  bookingcancel() {
    $("#cancellationexport").modal("hide");
  }






  //import
  import() {
    this.router.navigate(['/ImportBookingDetails'], {
      state: {
        exportimport: 1,
        miledat: 0,
      }
    })
  }
  getallgridimport() {
    this.APIServies.bookingGridimport(this.userId, this.role_id).subscribe(value => {
      this.tablegridviewsimport = value;
      this.importgridview = this.tablegridviewsimport['data']
      this.importgridview.forEach(element => {
        if (element.status == 0) {
          element["Exspancolur1"] = "badge badge-warning";
          element["Exstatusname1"] = "Booking Confirmation ";
          

        } 
        else if (element.status == 2) {
          element["Exspancolur1"] = "badge badge-danger";
          element["Exstatusname1"] = "Booking Delete";

        }
      })
      this.dtTrigger.next(this.importgridview);

    });
    this.APIServies.bookeddetailsimport(this.userId, this.role_id).subscribe(value => {
      this.tablesimport = value;
      this.importBookingArival = this.tablesimport['data']
      this.importBookingArival.forEach(element => {
        if (element.status == 1) {
          element["imspancolur1"] = "badge badge-warning";
          element["imstatusname1"] = "Booking confirmed ";


        } else if (element.status == 4) {
          element["imspancolur1"] = "badge badge-danger";
          element["imstatusname1"] = "Booking Cancellation";

        }
        if (element.IM_id == 4) {
          element["imspancolurevent"] = "badge badge-success";
          element["imstatusnameevent"] = "Empty Container Return at Yard ";

               element["imspancolur1"] = "badge badge-success";
          element["imstatusname1"] = "Completed";

        } else if (element.IM_id == 3) {
          element["imspancolurevent"] = "badge badge-success";
          element["imstatusnameevent"] = "Container Gate Out From Factory ";
        }
        else if (element.IM_id == 2) {
          element["imspancolurevent"] = "badge badge-success";
          element["imstatusnameevent"] = " Container Reported at Factory ";
        }
        else if (element.IM_id == 1) {
          element["imspancolurevent"] = "badge badge-success";
          element["imstatusnameevent"] = "Full Container Pickup From CFS/ Port ";
        }
      })


      this.dtTrigger.next(this.importBookingArival);

    });

  }
  importbookingcancellation(IB_id: any) {
    this.importky = IB_id;
  }
  bookingcanceldetails() {
    this.APIServies.ImportBookingcancel(this.importky).subscribe((value) => {
      this.notifyService.showSuccess("Booking Cancel successfully.", "Booking Details");
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    })
  }
  ImportApproval() {
    this.APIServies.ImportBookingapproval(this.importky).subscribe((value) => {
      this.notifyService.showSuccess("Booking successfully.", "Booking Details");
      this.notifyService.showSuccess("Email Sent successfully.", "Email");
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    })

  }
  importbooking(IB_id: any) {
    this.importky = IB_id;
    
  }
  importAssignvalue(IB_id: any) {
    this.buttontext = 'Update';
    this.BR_keys = IB_id;
    this.APIServies.getimportbookingall(this.BR_keys).subscribe((value) => {
      this.Bookingdata = value['data'];
      this.BookingLineitems = value['lineitems'];
    this.Imfiledata = value['DOFile'];
       this.Imfiledata1 = value['PODFile'];
       this.Imfiledata2 = value['BillOfEntry'];
       this.Imfiledata3 = value['EmptyReturnCopy'];
       this.Imfiledata4 = value['ContainerCopy'];

      this.router.navigate(['/ImportBookingDetails'], {
        state: {
          importBooking: this.Bookingdata,
          ImportBookingitems: this.BookingLineitems,
           DOFile : this.Imfiledata,
           PODFile : this.Imfiledata1,
           BillOfEntry : this.Imfiledata2,
           EmptyReturnCopy : this.Imfiledata3,
           ContainerCopy : this.Imfiledata4,
          exportimport: 1,
          views: '1',
          miledat: 0
        },
      });
    });
  }
  importAssignvaluemile(IB_id: any) {
    this.buttontext = 'Update';
    this.BR_keys = IB_id;
    this.APIServies.getimportbookingall(this.BR_keys).subscribe((value) => {
      this.Bookingdata = value['data'];
      this.BookingLineitems = value['lineitems'];
      
      this.router.navigate(['/ImportBookingDetails'], {
        state: {
          importBooking: this.Bookingdata,
          ImportBookingitems: this.BookingLineitems,
         
          exportimport: 1,
          views: '1',
          miledat: 1,
        },
      });
    });
  }
  views(IB_id: any) {
    this.buttontext = 'Update';
    this.BR_keys = IB_id;
    this.APIServies.getimportbookingall(this.BR_keys).subscribe((value) => {
      this.Bookingdata = value['data'];
      this.BookingLineitems = value['lineitems'];
     
      this.router.navigate(['/ImportBookingDetails'], {
        state: {
          importBooking: this.Bookingdata,
          ImportBookingitems: this.BookingLineitems,
          
          exportimport: 1,
          views: '0',
          miledat: 0,
        },
      });
    });
  }
  viewsmile(IB_id: any) {
    this.buttontext = 'Update';
    this.BR_keys = IB_id;
    this.APIServies.getimportbookingall(this.BR_keys).subscribe((value) => {
      this.Bookingdata = value['data'];
      this.BookingLineitems = value['lineitems'];
   
      this.router.navigate(['/ImportBookingDetails'], {
        state: {
          importBooking: this.Bookingdata,
          ImportBookingitems: this.BookingLineitems,
       
          exportimport: 1,
          views: '0',
          miledat: 1,
        },
      });
    });
  }
  importDeleterole(BR_key: any) {
    this.BR_keys = BR_key;
  }
  get M() {
    return this.deleteformim.controls;
  }
  deleteimport() {

    this.submittedim = true;
    if (this.deleteformim.invalid) {
      return;
    }
    let registerdata = this.deleteformim.value;
    let formvalues ={
      description :registerdata.importdeletename
    }
    this.APIServies.Deletebookingimport(this.BR_keys,formvalues).subscribe(value => {
      this.notifyService.showSuccess("Booking details deleted successfully.", "Booking details");
      $("#Deleteropimport").modal("hide");
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    },
      (error: any) => {
        this.notifyService.showError("Something went to wrong", "Booking details");
      }
    );

   
  }
  cancelimport() {
    $("#Deleteropimport").modal("hide");
  }
  importbookingcancel() {
    $("#cancellationimport").modal("hide");
  }
  ImportBookingclose() {
    $("#Bookingconfirm").modal("hide");

  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTrigger1.unsubscribe();
  }
}
