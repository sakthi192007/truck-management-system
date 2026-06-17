// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   APIEndpoint: 'http://localhost:1200/'
// };
export const environment = {
  production: false,
 // APIEndpoint: 'http://localhost:4008/',
  APIEndpoint: 'http://localhost:4060/',
   APIPortEndpoint: 'http://111.118.179.94:4002/',
  // APIPortEndpoint:  'https://mobileapp.skybtrans.com:2000/',
    GoogleMapsURL: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC5xRr-XDA2oFKkCYJ37iSmm-NzBJ-7KQs&libraries=places'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
