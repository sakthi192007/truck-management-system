import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map, catchError, of } from 'rxjs';
import { ClientService } from '../pages/clientmodel/client.service';
import { MasterdataService } from '../pages/MasterData/MasterData.service';
import { VendorService } from '../pages/vendormodel/vendor.service';
import { SettingService } from '../pages/settingmodel/setting.service';

export function emailExistsValidator(clientService: ClientService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) {
      return of(null);
    }
    return clientService.checkEmailExists(control.value).pipe(
      map(response => (response.exists ? { emailExists: true } : null)), // ✅ key must match template
      catchError(() => of(null)) // if API fails, treat as valid
    );
  };
}


export function emailExistsValidatormaster(masterDataService: MasterdataService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) return of(null);
    return masterDataService.checkEmailExists(control.value).pipe(
      map(response => (response.exists ? { emailExists: true } : null)),
      catchError(() => of(null))
    );
  };
}

export function emailExistsValidatorvendor(VendorService: VendorService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) return of(null);
    return VendorService.checkEmailExists(control.value).pipe(
      map(response => (response.exists ? { emailExists: true } : null)),
      catchError(() => of(null))
    );
  };
}
export function emailExistsValidatoruser(SettingService: SettingService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) return of(null);
    return SettingService.checkEmailExists(control.value).pipe(
      map(response => (response.exists ? { emailExists: true } : null)),
      catchError(() => of(null))
    );
  };
}
