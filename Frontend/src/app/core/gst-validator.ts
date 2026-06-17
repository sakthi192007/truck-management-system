import { AbstractControl, ValidatorFn } from '@angular/forms';


export function gstValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    const valid = gstRegex.test(control.value);
    return valid ? null : { 'invalidGst': { value: control.value } };
  };
}
export function panValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const valid = panPattern.test(control.value);
    return valid ? null : { 'invalidPan': { value: control.value } };
  };
}


export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   // const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,4}$/;
    const valid = emailPattern.test(control.value);
    const maxLength = control.value?.length <= 100;
    
    if (!valid) {
      return { 'invalidEmail': { value: control.value } };
    }

    if (!maxLength) {
      return { 'emailTooLong': { value: control.value } };
    }

    return null;
  };
}
export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    //const phonePattern = /^\+?[1-9]\d{1,14}$/;
    const phonePattern = /^[0-9]{10}$/;
    const valid = phonePattern.test(control.value);
    return valid ? null : { 'invalidPhoneNumber': { value: control.value } };
  };
}

