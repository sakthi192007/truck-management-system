import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Routing {
    function control(options: any): any;
  }
   namespace Control {
    function geocoder(options?: any): any;
  }
}

