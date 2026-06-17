import { Component, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexGrid,
  ApexLegend,
  ApexFill,
  ChartComponent
} from "ng-apexcharts";
import { AdminDashboardServices } from '../admindashboard.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/service/notification.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  colors: string[];
  fill: ApexFill;
};
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: ChartOptions;
  role_id: any;
  userId: any;
  TotalClients: any;
  ActiveClients: any;
  InactiveClients: any;

  constructor(private APIServices: AdminDashboardServices, private router: Router, private notifyService: NotificationService) {
    this.chartOptions = {
      series: [ ],
      chart: {
        type: "bar",
        height: 250,
        toolbar: {
          show: true,
          export: {
            csv: {
              filename: "Client_Report",   
            },
            svg: {
              filename: "Client_Report",  
            },
            png: {
              filename: "Client_Report"   
            }
          }
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: "15%",
          distributed: true
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#fff"]
        }
      },
      colors: [
        "#007bff"
      ],
      xaxis: {
        categories: [
        ],
        
        labels: {
          style: {
            fontSize: "13px",
            fontWeight: 500
          }
        }
      },
      yaxis: {
        title: {
          text: "No of Clients"
        }
      },
      legend: {
        show: false
      },
      grid: {
        borderColor: "#f1f1f1"
      },
      fill: {
        opacity: 0.9
      }
    };
  }
  ngOnInit(): void {
    this.userId = sessionStorage.getItem('id');
    this.role_id = sessionStorage.getItem('User_Roleid');
    this.getdate();

  }
getdate() {
  this.APIServices.getClientmonthwise().subscribe({
    next: (res) => {
      const data = res.data;

      this.chartOptions = {
        ...this.chartOptions,
        series: [
          {
            name: 'No of Clients',
            data: data.map((item: any) => item.ClientCount)
          }
        ],
        xaxis: {
          categories: data.map((item: any) => item.MonthYear), 
          labels: {
            style: {
              fontSize: "13px",
              fontWeight: 500
            }
          }
        }
      };
    },
    error: (err) => console.error(err)
  });

  this.APIServices.getClientsCount().subscribe((res: any) => {
  if (res && res.data && res.data.length > 0) {
    this.TotalClients = res.data[0].TotalClients;
  }
});

this.APIServices.getActiveclients().subscribe((res: any) => {
    if (res && res.data) {
      this.ActiveClients = res.data.ActiveClients;
      this.InactiveClients = res.data.InactiveClients;
    }
  });

}




}




