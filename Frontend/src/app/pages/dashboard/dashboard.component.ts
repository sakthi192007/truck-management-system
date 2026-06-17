import { Component, OnInit } from '@angular/core';
import { all_api_service } from 'src/app/service/all_api_service';
import { Router } from '@angular/router';
import { InvoiceService } from '../invoicemode/invoice.service';
declare const google: any;
import * as L from 'leaflet';
import 'leaflet-routing-machine';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(private APIServies: all_api_service, private APIServie: InvoiceService, private router: Router) {
    this.aadhar = "../../../assets/images/truck/truck.gif";
  }
  // map: L.Map | undefined;
  mapdata: any;
  mapdetaildata: any;
  map: any;
  maps: any;
  aadhar: any;
  tountydata: any;
  fortydata: any;
  tablegridviews: any;
  tablegrid: any;
  livemapdata: any;
  livemapdetaildata: any;
  Marklinedata: any;
  livedata: any;
  department: any;
  milestonesArray: any
  isLoading = false;
  username: any;
  liveMarker: any;
  userId: any;
  role_id: any;

  trackingInterval: any;
  routeCoordinates: any[] = [];

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('id');
    this.role_id = sessionStorage.getItem('User_Roleid');
    this.totalcontainers();
    this.mapdetails();

  }



  mapdetails() {
    const routeMap = document.getElementById('routemaps');
    if (routeMap) {
      routeMap.style.display = 'none';
    }

    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Map element not found');
      return;
    }

    // Initialize the map with South India center
    this.map = L.map('map').setView([15.9734, 78.6569], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.APIServies.mapdata(this.userId, this.role_id).subscribe(value => {
      this.mapdata = value;
      this.mapdetaildata = this.mapdata['data'];

      const groupedData = new Map<string, any[]>();

      this.mapdetaildata.flat().forEach((entry: any) => {
        const lat = parseFloat(entry.Latitude);
        const lng = parseFloat(entry.Longitude);

        if (isNaN(lat) || isNaN(lng)) return;

        const key = `${lat.toFixed(6)}_${lng.toFixed(6)}`;
        if (!groupedData.has(key)) groupedData.set(key, []);
        groupedData.get(key)?.push(entry);
      });

      const result = Array.from(groupedData.values());
      let zoomedOnce = false; // To ensure we zoom only one time

      result.forEach(group => {
        const firstLocation = group[0];
        const lat = parseFloat(firstLocation.Latitude);
        const lng = parseFloat(firstLocation.Longitude);

        if (isNaN(lat) || isNaN(lng)) {
          console.warn('Invalid lat/lng for marker:', group);
          return;
        }

        // Zoom only on the first location that has more than one entry
        if (this.map && group.length > 1 && !zoomedOnce) {
          this.map.setView([lat, lng], 12);
          zoomedOnce = true;
        }

        const container = firstLocation.containernumber;
        const booking = firstLocation.BookingNumber;
        const vehicle = firstLocation.vehicleno;

        const popupId = `${container}_${booking}`.replace(/\s+/g, '_');

        const popupContent = `
        <table class="table table-bordered w-150 equal-width-table font-size-12 dataTable no-footer">
          <tr>
            <th>Containernumber</th>
            <th>Booking Number</th>
            <th>Vehicle Number</th>
          </tr>
          ${group.map((location: { containernumber: any; BookingNumber: any; vehicleno: any }) => `
            <tr>
              <td>
                <a href="javascript:void(0);" class="container-click"
                   data-container="${location.containernumber}"
                   data-booking="${location.BookingNumber}">
                   ${location.containernumber}
                </a>
              </td>
              <td>
                <a href="javascript:void(0);" class="container-click"
                   data-container="${location.containernumber}"
                   data-booking="${location.BookingNumber}">
                   ${location.BookingNumber}
                </a>
              </td>
              <td>
                <a href="javascript:void(0);" class="container-click"
                   data-container="${location.containernumber}"
                   data-booking="${location.BookingNumber}">
                   ${location.vehicleno}
                </a>
              </td>
            </tr>
          `).join('')}
        </table>
      `;

        const marker = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: 'assets/red-marker.gif',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
          }),
        }).addTo(this.map!);

        marker.bindPopup(popupContent);

        // Optional: Attach behavior when popup opens
        marker.on('popupopen', () => {
          setTimeout(() => {
            const link = document.querySelector('.routelink') as HTMLElement;
          }, 10);
        });
      });

      // Handle clicks on container links
      document.addEventListener('click', (event: any) => {
        const target = event.target;
        if (target.classList.contains('container-click')) {
          const containerNumber = target.getAttribute('data-container');
          const bookingNumber = target.getAttribute('data-booking');
          this.maproutemap(containerNumber, bookingNumber);
        }
      });
    });
  }


  maproutemap(Containernumber: any, BookingNumber: any): void {
    const firstThree = BookingNumber.substring(0, 3);
    let Dep = (firstThree === "EXP") ? "Export" : "Import";
    this.department = Dep;

    const mainMap = document.getElementById('mainmap');
    const routeMap = document.getElementById('routemaps');

    if (mainMap && routeMap) {
      mainMap.style.display = 'none';
      routeMap.style.display = 'block';
    }

    // First API call to setup map
    this.APIServies.livemapdata(Containernumber, Dep).subscribe(value => {
      this.livemapdata = value;
      this.Marklinedata = this.livemapdata['data'];
      this.livemapdetaildata = this.livemapdata['Liveroute'];
      this.livedata = this.livemapdata['Livedata'];

      const live_lat = this.livedata[0].Latitude;
      const live_long = this.livedata[0].Longitude;

      if (firstThree === "EXP") {
        this.Exmilestonedetails(Containernumber);
        const m = this.Marklinedata[0];
        this.Exportmap(
          m.empty_lat, m.empty_long,
          m.Stuffing_lat, m.Stuffing_long,
          m.PointOf_lat, m.PointOf_long,
          m.PortOf_lat, m.PortOf_long,
          live_lat, live_long,
          m.EmptyContainerPickup, m.StuffingLocation,
          m.PointOfClearance, m.PortOfDischarge
        );
      } else {
        this.IMmilestonedetails(Containernumber);
        const m = this.Marklinedata[0];
        this.Importmap(
          m.ContainerPickup_lat, m.ContainerPickup_long,
          m.DE_Stuffing_lat, m.DE_Stuffing_long,
          m.EmptyReturn_lat, m.EmptyReturn_long,
          live_lat, live_long,
          m.ContainerPickupLocation, m.DE_StuffingLocation, m.EmptyReturnAt
        );
      }

      if (this.trackingInterval) clearInterval(this.trackingInterval);

      this.trackingInterval = setInterval(() => {
        this.APIServies.livemapdata(Containernumber, Dep).subscribe(update => {
          const updatedLat = update?.Livedata[0]?.Latitude;
          const updatedLng = update?.Livedata[0]?.Longitude;

          if (updatedLat && updatedLng) {
            this.updateLiveLocation(parseFloat(updatedLat), parseFloat(updatedLng));
          }
        });
      }, 5000);

    }, error => {
      console.error("Error fetching live map data:", error);
    });
  }
  updateLiveLocation(lat: number, lng: number): void {
    const newLatLng = L.latLng(lat, lng);

    if (this.liveMarker) {
      this.liveMarker.setLatLng(newLatLng);
      this.map.panTo(newLatLng);
    }

    if (this.routeCoordinates && this.routeCoordinates.length > 0) {
      this.updateRoutePath(newLatLng); // Export only
    }
  }

  updateRoutePath(currentLive: L.LatLng): void {
    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < this.routeCoordinates.length; i++) {
      const dist = currentLive.distanceTo(this.routeCoordinates[i]);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }
    }

    const greenCoords = this.routeCoordinates.slice(0, closestIndex + 1);
    const grayCoords = this.routeCoordinates.slice(closestIndex);

    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.Polyline && !(layer instanceof L.Marker)) {
        this.map.removeLayer(layer);
      }
    });

    L.polyline(greenCoords, { color: 'green', weight: 5 }).addTo(this.map);
    L.polyline(grayCoords, { color: 'gray', weight: 5, dashArray: '5,10' }).addTo(this.map);
  }




  Exportmap(
    empty_lat: any, empty_long: any,
    Stuffing_lat: any, Stuffing_long: any,
    PointOf_lat: any, PointOf_long: any,
    PortOf_lat: any, PortOf_long: any,
    live_lat: any, live_long: any,
    EmptyContainerPickup: any, StuffingLocation: any,
    PointOfClearance: any, PortOfDischarge: any
  ): void {

    const mapElement = document.getElementById('maps');
    if (!mapElement) return;

    const locationOne = L.latLng(parseFloat(empty_lat), parseFloat(empty_long));
    const locationTwo = L.latLng(parseFloat(Stuffing_lat), parseFloat(Stuffing_long));
    const locationThree = L.latLng(parseFloat(PointOf_lat), parseFloat(PointOf_long));
    const locationFour = L.latLng(parseFloat(PortOf_lat), parseFloat(PortOf_long));
    const live = L.latLng(parseFloat(live_lat), parseFloat(live_long));

    this.map = L.map('maps').setView([20.5937, 78.9629], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    const redIcon = L.icon({
      iconUrl: 'assets/red-marker.gif',
      iconSize: [50, 50],
      iconAnchor: [25, 50],
    });

    this.liveMarker = L.marker(live, { icon: redIcon }).addTo(this.map)
      .bindPopup('<b>Live Location</b>').openPopup();

    const labels = [EmptyContainerPickup, StuffingLocation, PointOfClearance, PortOfDischarge];

    const routingControl = L.Routing.control({
      waypoints: [locationOne, locationTwo, locationThree, locationFour],
      createMarker: (i: number, wp: any) => {
        const customIcon = L.icon({
          iconUrl: 'assets/image.png',
          iconSize: [50, 50],
          iconAnchor: [25, 50],
        });
        return L.marker(wp.latLng, { icon: customIcon }).bindPopup(`<b>📍 ${labels[i]}</b>`);
      },
      routeWhileDragging: false,
      show: false,
      addWaypoints: false
    }).addTo(this.map);

    routingControl.on('routesfound', (e: { routes: any[] }) => {
      this.routeCoordinates = e.routes[0].coordinates;
      this.updateRoutePath(live); // Initial draw
    });
  }



  Importmap(
    locationonelat: any, locationoneLong: any,
    locationtowLat: any, locationtowLong: any,
    locatiothreeLat: any, locationthreeLong: any,
    live_lat: any, live_long: any,
    ContainerPickupLocation: any, DE_StuffingLocation: any, EmptyReturnAt: any
  ): void {

    const mapElement = document.getElementById('maps');
    if (!mapElement) return;

    const locationOne = L.latLng(parseFloat(locationonelat), parseFloat(locationoneLong));
    const locationTwo = L.latLng(parseFloat(locationtowLat), parseFloat(locationtowLong));
    const locationThree = L.latLng(parseFloat(locatiothreeLat), parseFloat(locationthreeLong));
    const live = L.latLng(parseFloat(live_lat), parseFloat(live_long));

    this.map = L.map('maps').setView([20.5937, 78.9629], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    const redIcon = L.icon({
      iconUrl: 'assets/red-marker.gif',
      iconSize: [50, 50],
      iconAnchor: [25, 50],
    });

    L.marker(live, { icon: redIcon }).addTo(this.map)
      .bindPopup('<b>Live Location</b>');

    const labels = [ContainerPickupLocation, DE_StuffingLocation, EmptyReturnAt];

    const routingControl = L.Routing.control({
      waypoints: [locationOne, locationTwo, locationThree],
      createMarker: (i: number, wp: { latLng: L.LatLngExpression; }) => {
        const customIcon = L.icon({
          iconUrl: 'assets/image.png',
          iconSize: [50, 50],
          iconAnchor: [25, 50],
        });
        return L.marker(wp.latLng, { icon: customIcon }).bindPopup(`<b>📍 ${labels[i as number]}</b>`);
      },
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
    }).addTo(this.map);

    routingControl.on('routesfound', (e: any) => {
      const route = e.routes[0];
      const coordinates = route.coordinates;

      let closestIndex = 0;
      let minDistance = Infinity;

      coordinates.forEach((coord: L.LatLng, index: number) => {
        const distance = live.distanceTo(coord);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      const greenSegment = coordinates.slice(0, closestIndex + 1);
      const graySegment = coordinates.slice(closestIndex);

      this.map!.eachLayer((layer: any) => {
        if (layer instanceof L.Polyline && !(layer instanceof L.Marker)) {
          this.map!.removeLayer(layer);
        }
      });

      L.polyline(greenSegment, { color: 'green', weight: 5 }).addTo(this.map!);

      L.polyline(graySegment, { color: 'gray', weight: 5, dashArray: '5, 10' }).addTo(this.map!);
    });
  }


  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toISOString().slice(0, 16);  // YYYY-MM-DDTHH:mm
  }
  Exmilestonedetails(Containernumber: any) {

    this.APIServies.EXmilestonedetails(Containernumber).subscribe(value => {
      const miledetaildata = value;
      const completedmile = miledetaildata['data'];
      const locationmilestone = miledetaildata['Milstones'];
      this.milestonesArray = completedmile.map((item: { ADT: string; milestones: any; status: any }, index: number) => {
        const dateFormatted = this.formatDateTime(item.ADT).replace("T", " ");
        const milestoneTitle = index === 0 ? locationmilestone[0].emptyPickup :
          index === 1 ? locationmilestone[0].emptyPickup :
            index === 2 ? locationmilestone[0].factory :
              index === 3 ? locationmilestone[0].factory :
                index === 4 ? locationmilestone[0].PointOfClearance :
                  index === 5 ? locationmilestone[0].PointOfClearance :
                    index === 6 ? locationmilestone[0].PortName :
                      locationmilestone[0].emptyPickup;

        const icons = [
          'assets/images/truck/emptys.gif',
          'assets/images/truck/completed.gif',
          'assets/images/truck/gateIn.gif',
          'assets/images/truck/gateOut.gif',
          'assets/images/truck/pick.gif',
          'assets/images/truck/truck_moving.gif',
          'assets/images/truck/port.gif'
        ];

        return {
          title: milestoneTitle,
          location: item.milestones,
          date: dateFormatted,
          icon: icons[index],
          status: item.status == 1 ? 'completed' : 'active'
        };
      });

    })
  }
  IMmilestonedetails(Containernumber: any) {

    this.APIServies.IMmilestonedetails(Containernumber).subscribe(value => {
      const miledetaildata = value;
      const completedmile = miledetaildata['data'];
      const locationmilestone = miledetaildata['Milstones'];

      this.milestonesArray = completedmile.map((item: { DateTime: string; milestones: any; status: any }, index: number) => {
        const dateFormatted = this.formatDateTime(item.DateTime).replace("T", " ");
        const milestoneTitle = index === 0 ? locationmilestone[0].ContainerPickupLocation :
          index === 1 ? locationmilestone[0].StuffingLocation :
            index === 2 ? locationmilestone[0].StuffingLocation :
              index === 3 ? locationmilestone[0].EmptyReturnAt :
                locationmilestone[0].DEStuffingLocation;

        const icons = [
          'assets/images/truck/pick.gif',
          'assets/images/truck/gateIn.gif',
          'assets/images/truck/gateOut.gif',
          'assets/images/truck/Empty.gif'
        ];

        return {
          title: milestoneTitle,
          location: item.milestones,
          date: dateFormatted,
          icon: icons[index],
          status: item.status == 1 ? 'completed' : 'active'
        };
      });

    })
  }

  
  totalcontainers() {
    this.APIServies.bookingtow(this.userId, this.role_id).subscribe(value => {
      this.tablegridviews = value;
      this.tountydata = this.tablegridviews['data']
      //this.tountydata = tydata[0]


    });
    this.APIServies.bookingfor(this.userId, this.role_id).subscribe(value => {
      this.tablegrid = value;
      this.fortydata = this.tablegrid['data']
      //this.fortydata = tydata[0]

    });
  }
  Export() {
    this.router.navigate(['/CreateBooking'], {
      state: {
        exportimport: 0,
      }
    })


  }
  Import() {
    this.router.navigate(['/ImportBookingDetails'], {
      state: {
        exportimport: 1,
      }
    })
  }


  goBackToDashboard(): void {
    this.isLoading = true;
    // Use Angular’s location reload workaround:
    window.location.reload(); // or use router if needed
  }
}
