import { ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { NONAME } from 'dns';

export class CustomValidators {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }
  static emailOrPhoneValidator(error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const regex1 = RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
      const regex2 = RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      const valid1 = regex1.test(control.value);
      const valid2 = regex2.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      if (valid1 || valid2) {
        return true ? null: error;
      }
        else {
          return false ? null : error;
        }
      
    };
  }

  static phoneValidator(error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const regex1 = RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
      const valid1 = regex1.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      if (valid1) {
        return true ? null: error;
      }
        else {
          return false ? null : error;
        }
      
    };
  }

  static emailValidator(error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const regex2 = RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      const valid2 = regex2.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      if (valid2) {
        return true ? null: error;
      }
        else {
          return false ? null : error;
        }
      
    };
  }


  /*
  static passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('pwd').value; // get password from our password form control
    const confirmPassword: string = control.get('pwdConfirm').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('pwdConfirm').setErrors({ NoPassswordMatch: true });
    }
  }
  
  static pwdMatchValidator(control1: AbstractControl, control2: AbstractControl, error: ValidationErrors): ValidatorFn {
    return (control1: AbstractControl): { [key: string]: any } => {
      if (!control1.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const password: string = control1.get('pwd').value; // get password from our password form control
      const confirmPassword: string = control2.get('pwdConfirm').value; // get password from our confirmPassword form control
      // compare is the password math
      if (password !== confirmPassword) {
        // if they don't match, set an error in our confirmPassword form control
        control1.get('pwdConfirm').setErrors({ NoPassswordMatch: true });
      }
      // if true, return no error (no error), else return error passed in the second parameter
      return control1 ? null : error;
    };
  }
  */
  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl.errors && !checkControl.errors.matching) {
        return null;
      }

      if (control.value !== checkControl.value) {
        controls.get(checkControlName).setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }

  static mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
      return null;
    };
  }


  static stringValidateEmail(email: string) {
    const regex = RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const valid = regex.test(email);
    return valid;

  }
}
  
