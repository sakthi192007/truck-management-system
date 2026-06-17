import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { LocationService } from '../Location.Service';
import { environment } from 'src/environments/environment';
declare const google: any;
@Component({
  selector: 'app-locationroutemap',
  templateUrl: './locationroutemap.component.html',
  styleUrl: './locationroutemap.component.css'
})
export class LocationroutemapComponent {
  locationroutemap!: FormGroup;
  buttontext: string = 'Submit';
  submitted = false;
  autocomplete: any;
  address: string = '';
  geocoder: any;
  locationdata: any;
  views: any;
  Ml_key: any;


  placeName: string = '';
  suggestions: any[] = [];
  showSuggestions: boolean = false;
  searchTimeout: any;
  map: any;
  marker: any;
locationType:any[]=[];
  currentuser: any;
  userId: any;
  RoleId: any;
  zoom: number = 10;
  locationselect: any;
  getlocationdata: any;
  latitudes: string = '';
  longitudes: string = '';
  selectedLocationType: any;

      locationdropdownConfig = {
    displayKey: "LocationName",    
    search: true,                
    height: '250px',
    placeholder: "--Select--",
    limitTo: this.locationType?.length,
    noResultsFound: "No results found!",
    searchPlaceholder: "Search...",
    clearOnSelection: false
  };

  constructor(

    private formBuilder: FormBuilder,
    private router: Router,
    private APIServies: LocationService,
    private authService: AuthService,
    private notifyService: NotificationService
  ) {

    this.locationdata = history.state.locationdata;
    this.views = history.state.views;

    this.locationroutemap = this.formBuilder.group({
      PlaceName: this.formBuilder.control(''),
      Location_Type: this.formBuilder.control(''),
      Location_Name: this.formBuilder.control(''),
      latitude: this.formBuilder.control(''),
      longitude: this.formBuilder.control(''),
      Address: this.formBuilder.control(''),
      city: this.formBuilder.control(''),
      State: this.formBuilder.control(''),
      Country: this.formBuilder.control(''),
      
     Latitudes: this.formBuilder.control(''),
      Longitudes: this.formBuilder.control(''),
    })

    if (this.locationdata && this.locationdata.length > 0) {
      this.buttontext = 'Update';

      let latitude = this.locationdata[0].Ml_Latitude;
      let longitude = this.locationdata[0].Ml_Longitude;

      let formvalues = {
        Location_Type: this.locationdata[0].Ml_LocationType,
        Location_Name: this.locationdata[0].Ml_LocationName,
        latitude: latitude,
        longitude: longitude,
        Latitudes: latitude,
        Longitudes: longitude,
        Address: this.locationdata[0].Ml_Address,
        city: this.locationdata[0].Ml_City,
        State: this.locationdata[0].Ml_State,
        Country: this.locationdata[0].Ml_Country
      };


      this.Ml_key = this.locationdata[0].Ml_key;
      this.locationroutemap.patchValue(formvalues);



    }
  }


 ngOnInit(): void {
  this.currentuser = this.authService.getCurrentuser();
  this.userId = this.currentuser.id;
  this.RoleId = this.currentuser.User_Roleid;
this.locationvalue();
  this.loadGoogleMapsScript().then(() => {
    this.initMap();
    this.initAutocomplete();
  });

  this.selectedLocationType = this.locationdata[0].Ml_LocationType;
}
locationvalue(){
   this.APIServies.dropdownget().subscribe((value) => {
      const selectvalue = value;
      this.locationType = selectvalue['data'];
    });

}
  

  initAutocomplete() {
    const input = document.getElementById('autocomplete') as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        this.placeName = place.formatted_address;
        this.locationroutemap.controls['PlaceName'].setValue(this.placeName);
        this.findLocation();
      }
    });
  }
  loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
    
      if ((window as any).google && (window as any).google.maps) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = environment.GoogleMapsURL; 
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = (error) => {
          console.error('Error loading Google Maps script:', error);
          reject(error);
        };
        document.head.appendChild(script);
      }
    });
  }

  initMap(): void {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      throw new Error('Map element with ID "map" not found.');
    }

    let latitude = this.locationroutemap.value.Latitudes || 20.5937;
    let longitude = this.locationroutemap.value.Longitudes || 78.9629;

    this.map = new google.maps.Map(mapElement, {
      center: { lat: latitude, lng: longitude },
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    this.map.setOptions({ minZoom: 5, maxZoom: 18 });

    this.marker = null;
    this.geocoder = new google.maps.Geocoder();

    if (this.locationdata && this.locationdata.length > 0) {
      this.addMarker({ lat: latitude, lng: longitude }, this.locationroutemap.value.PlaceName || "Selected Location");
    }

    this.map.addListener('click', (event: any) => {
      if (event.latLng) {
        const latitude = event.latLng.lat();
        const longitude = event.latLng.lng();
        this.getLocationName(latitude, longitude).then((placeName) => {
          this.locationroutemap.patchValue({
            latitude: latitude,
            longitude: longitude,
            Latitudes: latitude,
            Longitudes: longitude,
            PlaceName: placeName
          });
          this.addMarker({ lat: latitude, lng: longitude }, placeName);
        });
      }
    });
  }
  getLocationName(lat: number, lng: number): Promise<string> {
    return new Promise((resolve) => {
      this.geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          console.error('Geocoder failed:', status);
          resolve('Unknown Location');
        }
      });
    });
  }

  addMarker(location: { lat: number; lng: number }, placeName: string) {
    if (this.marker) {
      this.marker.setPosition(location);
      this.marker.setTitle(placeName);
    } else {
      this.marker = new google.maps.Marker({
        map: this.map,
        position: location,
        title: placeName
      });
    }
  }

  findLocation(): void {
    let registerdata = this.locationroutemap.value;
    this.placeName = registerdata.PlaceName;  

    if (this.placeName) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': this.placeName }, (results: { geometry: { location: any; }; }[], status: string) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const location = results[0].geometry.location;
          this.latitudes = location.lat().toString();
          this.longitudes = location.lng().toString();

          this.locationroutemap.patchValue({
            latitude: this.latitudes,
            longitude: this.longitudes,
            Latitudes: this.latitudes,
            Longitudes: this.longitudes
          });

          this.map.setCenter(location);
          if (this.marker) this.marker.setMap(null);
          this.marker = new google.maps.Marker({
            map: this.map,
            position: location,
            title: this.placeName
          });
        } else {
          this.notifyService.showSuccess(
            "Address was not successful for the following reason: " + status,
            "Master Location"
          );
        }
      });
    } else {
      this.notifyService.showSuccess("Please enter a place name.", "Master Location");
    }
  }




  get f() {
    return this.locationroutemap.controls;
  }

  submit() {
    this.submitted = true;

     this.userId = this.currentuser.id;
     this.RoleId = this.currentuser.User_Roleid;
       
     
    if (this.locationroutemap.invalid) return;

    const registerdata = this.locationroutemap.value;

       let Booking = this.locationroutemap.value.Location_Type.LocationName; 
  if(Booking){
Booking = registerdata.Location_Type.LocationName;
  }else{
 Booking = registerdata.Location_Type;
  }
    
    if (this.buttontext == 'Submit') {
      const formvalues = {
        Location_Type: Booking,
        Location_Name: registerdata.Location_Name,
        latitude: registerdata.latitude,
        longitude: registerdata.longitude,
        Address: registerdata.Address,
        city: registerdata.city,
        State: registerdata.State,
        Country: registerdata.Country,
        CreatedBy: this.userId
      }

      this.APIServies.insertdata(formvalues).subscribe(() => {
        this.notifyService.showSuccess("MasterLocation Create Successfully.", "Master Location");
        this.router.navigate(['/LocationGrid'])

      })
    } else {

       const formvalues = {
        Location_Type: Booking,
        Location_Name: registerdata.Location_Name,
        latitude: registerdata.latitude,
        longitude: registerdata.longitude,
        Address: registerdata.Address,
        city: registerdata.city,
        State: registerdata.State,
        Country: registerdata.Country,
         Ml_Modifiedby: this.userId
      }
      

      this.APIServies.Updatedata(formvalues, this.Ml_key).subscribe(() => {
        this.notifyService.showSuccess("MasterLocation Updated Successfully.", "Master Location");
        this.router.navigate(['/LocationGrid'])

      })
    }
  }

}
