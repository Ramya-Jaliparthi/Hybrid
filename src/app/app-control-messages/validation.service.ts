import { Injectable } from '@angular/core';
import { AbstractControl, Form, FormGroup } from '@angular/forms';
import * as moment from 'moment';
//import { DateRange } from '';
declare let $: any;

@Injectable()
export class ValidationService {
  config: object;
  emailRegex: RegExp;
  hintAnswerRegex: RegExp;
  mobileRegex: RegExp;
  mobileRegexRegister: RegExp;
  ssnRegex: RegExp;
  numberRegex: RegExp;
  alphaStringRegex: RegExp;
  studentIdRegex: RegExp;
  alphaNumericRegex: RegExp;
  specialCharactersRegex: RegExp;
  amountRegex: RegExp;

  dobMask = [/[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
  phoneMask = [/[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
  phoneMaskRegister = ['(', /[0-9]/, /[0-9]/, /[0-9]/, ')', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
  ssnMask = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
  memIdMask = [/[a-zA-Z0-9]/, /[a-zA-Z0-9]/, /[a-zA-Z0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,
    /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
  suffixMask = [/[0-9]/, /[0-9]/];
  accesscodeMask = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
  studentIdMask = [/[a-zA-Z0-9]/, /[a-zA-Z0-9]/, /[a-zA-Z0-9]/, /[a-zA-Z0-9]/, /[a-zA-Z0-9]/, /[a-zA-Z0-9]/, /[a-zA-Z0-9]/,
    /[a-zA-Z0-9]/, /[a-zA-Z0-9]/, /[a-zA-Z0-9]/, /[a-zA-Z0-9]/, /[a-zA-Z0-9]/, /[a-zA-Z0-9]/];
  zipMask = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
  numericMask = [/[0-9]/];
  alphaNumericMask = [/[0-9a-zA-Z]/];
  numeric5Mask = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
  numeric10Mask = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];

  API_INVALID_IDENTIFITERS = {
    'dateOfBirth': 'MEM_DOB',
    'firstName': 'MEM_FNAME',
    'lastName': 'MEM_LNAME',
    'memberId': 'MEM_NUM'
  };

  constructor() {
    this.config = {
      // 'required': 'Required',
      // 'invalidPassword': 'Invalid password. Password must contain a uppercase letter ,and a number and a special character.',
      'minlength': `Minimum length is requiredLength characters`
      // 'invalidAccessCode': 'Invalid access code',
      // 'invalidEmail': `Email Id is not in valid format`,
      // 'invalidSSN': `SSN is not in valid format`,
      // 'invalidDate': `Date of Birth is invalid`,
      // 'invalidEffectiveDate': `Effective Date is invalid`,
      // 'invalidDob': `Date of Birth is invalid`,
      // 'incorrectDob': `Date of Birth is incorrect`,
      // 'invalidNumber': `Mobile is not valid, It can't contain 000, 555, 999 and start with 1.`,
      // 'invalidMobile': `Mobile Number is Invalid`,
      // 'invalidAlphaString': `Invalid format`,
      // 'invalidAlphaNumericString': 'Invalid format. Only Alphabets and Numbers are allowed',
      // 'ninetyDays': `Date must be within 90 days from current date`,
      // 'incorrectMemberId': 'member Id is incorrect'
    };

    // tslint:disable-next-line:max-line-length
    this.emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.hintAnswerRegex = /[^a-zA-Z0-9]/;
    this.mobileRegex = /^[\-0-9]{12}$/;
    this.mobileRegexRegister = /^[\-0-9()]{13}$/;
    this.ssnRegex = /\d{4}/;
    this.alphaStringRegex = new RegExp('^[ \'a-zA-Z-]*$');
    this.numberRegex = /^[0-9]{1,10}$/;
    this.studentIdRegex = /^[a-z0-9]+$/i;
    this.alphaNumericRegex = /^[a-z0-9]+$/i;
    this.specialCharactersRegex = /[^a-z0-9\s\.\-\/\*&;:,'"#]+/i;
    this.amountRegex = /^\d{1,4}(\.\d{1,2})?$/;
  }


  getValidatorErrorMessage(validatorName: string, validatorValue?: any, customMessages?: any) {
    let error = this.config[validatorName];
    if (customMessages && customMessages[validatorName]) {
      error = customMessages[validatorName];
    }

    if (validatorName === 'minlength') {
      error = error.replace('requiredLength', validatorValue.requiredLength);
    }

    return error;
  }

  samePasswordValidator(compareControl: AbstractControl) {
    return (control: AbstractControl) => {
      const val = control.value;
      if (val === compareControl.value) { return { 'samePassword': true }; }
      return null;
    };
  }

  invalidPasswordValidatorWrapper() {
    return (control: AbstractControl) => {
      const hasError = this.invalidPasswordValidator(control);
      if (hasError) {
        return hasError;
      } else {
        return null;
      }
    };
  }
  invalidPasswordValidator(control: AbstractControl) {
    const value = control.value;
    let hasError = false;

    const hasNumberRegEx = /\d/g;
    const hasSmallLetterRegEx = /[a-z]/g;
    const hasCapitalLetterRegEx = /[A-Z]/g;
    const hasSymbolRegEx = /[!@#${^}%&*)([\-\]~+/.,*$]/g;

    // Has atleast one number
    if (!hasNumberRegEx.test(value)) {
      hasError = true;
    }
    // Has atleast one Small Letter
    // if (!hasError && !hasSmallLetterRegEx.test(value)) {
    //   hasError = true;
    // }
    // Has atleast one Capital Letter
    if (!hasError && !hasCapitalLetterRegEx.test(value)) {
      hasError = true;
    }
    // Has atleast one special Character
    if (!hasSymbolRegEx.test(value)) {
      hasError = true;
    }
    const splCharString = value.replace(hasSymbolRegEx, '').replace(hasNumberRegEx, '')
      .replace(hasCapitalLetterRegEx, '').replace(hasSmallLetterRegEx, '');
    if (splCharString !== '' && !hasSymbolRegEx.test(splCharString)) {
      hasError = true;
    }
    return hasError ? { invalidPassword: { value: true } } : false;
  }

  emailDomainValidator(control: AbstractControl) {
    const emailDomains = ['com', 'org', 'net', 'edu'];
    const value = control.value;
    let hasError = true;

    if (value) {
      const valueComponents = value.split('.');

      if (emailDomains.indexOf(valueComponents[valueComponents.length - 1]) > -1) {
        hasError = false;
      }
    }

    return hasError ? { invalidEmail: { value: true } } : false;
  }

  passwordStatus(control: string) {
    const value = control;
    let hasNumber = false;
    let hasCapital = false;
    let hasSmall = false;
    let hasMinLength;
    let hasSymbol = false;

    const hasNumberRegEx = /\d/g;
    const hasSmallLetterRegEx = /[a-z]/g;
    const hasCapitalLetterRegEx = /[A-Z]/g;
    const hasSymbolRegEx = /[!@#${^}%&*)([\-\]~+/.,*$]/g;


    // Has atleast one number
    if (hasNumberRegEx.test(value)) {
      hasNumber = true;
    }
    // Has atleast one small Letter
    if (hasSmallLetterRegEx.test(value)) {
      hasSmall = true;
    }
    // Has atleast one Capital Letter
    if (hasCapitalLetterRegEx.test(value)) {
      hasCapital = true;
    }

    // Has atleast one Small Letter
    if (value.length >= 8) {
      hasMinLength = true;
    }

    if (hasSymbolRegEx.test(value)) {
      hasSymbol = true;
    }
    const splCharString = value.replace(hasSymbolRegEx, '').replace(hasNumberRegEx, '')
      .replace(hasCapitalLetterRegEx, '').replace(hasSmallLetterRegEx, '');
    if (splCharString !== '' && !hasSymbolRegEx.test(splCharString)) {
      hasSymbol = false;
    }

    // Has atleast one special Character
    return { 'hasNumber': hasNumber, 'hasCapital': hasCapital, 'hasSmall': hasSmall, 'hasMinLength': hasMinLength, 'hasSymbol': hasSymbol };
  }

  mobileValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value + '';
      let hasError = false;
      hasError = !this.mobileRegex.test(value);
      return hasError ? { invalidMobile: { value: true } } : null;
    };
  }

  mobileRegisterValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      let hasError = false;

      hasError = !this.mobileRegexRegister.test(value);

      return hasError ? { invalidMobile: { value: true } } : null;
    };
  }

  phoneValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value + '';
      let hasError = false;

      const firstPart = value && value.slice(0, 3);
      // const firstPart = value && value.replace(/-/g, '');
      if (firstPart && (firstPart.startsWith('1') || firstPart.startsWith('0'))) {
        hasError = true;
      } else {
        hasError = ['000', '555', '999'].indexOf(firstPart) !== -1;
      }
      return hasError ? { invalidNumber: { value: true } } : null;
    };
  }

  paymentAmountValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      let hasError = false;
      if (!value || !this.amountRegex.test(value)) {
        hasError = true;
      } else {
        const numberValue = +value;
        if (!numberValue) {
          hasError = true;
        }
      }
      return hasError ? { invalidAmount: { value: true } } : null;
    };
  }


  spaceValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      let hasSpace = false;

      if ((/\s/.test(value))) {
        hasSpace = true;
      }

      return hasSpace ? { invalidNumber: { value: true } } : null;
    };
  }

  noWhitespaceValidator(control: AbstractControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  emailValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      let hasError = false;

      hasError = !this.emailRegex.test(value);
      return hasError ? { invalidEmail: { value: true } } : null;
    };
  }

  specialCharactersValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      let hasError = false;

      hasError = this.specialCharactersRegex.test(value);
      return hasError ? { invalidCharacters: { value: true } } : null;
    };
  }

  hintAnswerValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      let hasError = false;

      hasError = this.hintAnswerRegex.test(value);
      return hasError ? { invalidHintAnswer: { value: true } } : null;
    };
  }

  validateState() {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      let hasError = false;
      hasError = control.value !== 'MA';
      return hasError ? { invalidState: { value: true } } : null;
    };
  }

  alphaNumericValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      let hasError = false;

      hasError = !this.alphaNumericRegex.test(value);
      return hasError ? { invalidAlphaNumericString: { value: true } } : null;
    };
  }

  ssnValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      let hasError = false;

      hasError = !this.ssnRegex.test(value);
      const c = hasError ? { invalidSSN: { value: true } } : null;
      return hasError ? { invalidSSN: { value: true } } : null;
    };
  }


  dobValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      let hasError = false;
      // const age = (control.value).diff(moment(), 'years');
      if (value.length === 10) {
        // const age = (control.value).diff(moment(), 'years');
        const age = this.getAge(control.value);
        // 10/19/1990
        const year = control.value.substring(6, 10) - 0;
        // test year range
        if (year < 1900) {
          hasError = true;
        }
        if (Number.isNaN(age) || age < 18) {
          hasError = true;
        }
      }
      return hasError ? { invalidDob: { value: true } } : null;
    };
  }

  minAgeValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      let hasError = false;
      if (value.length === 10) {
        const age = this.getAge(control.value);
        if (Number.isNaN(age) || age < 18) {
          hasError = true;
        }
      }
      return hasError ? { invalidAge: { value: true } } : null;
    };
  }

  inCorrectDynamicDateValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      return { incorrectDob: { value: true } };
    };
  }

  duplicateProcedureAndDiagnosisCodeValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      return { duplicateCombination: { value: true } };
    };
  }

  inCorrectDynamicFirstNameValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      return { incorrectFirstName: { value: true } };
    };
  }

  inCorrectDynamicLastNameValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      return { incorrectLastName: { value: true } };
    };
  }

  incorrectMemberIdValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      return { incorrectMemberId: { value: true } };
    };
  }

  getAge(date) {
    let dob: any;
    let now: any;
    dob = new Date(date);
    now = new Date();
    let years = (now.getFullYear() - dob.getFullYear());

    if (now.getMonth() < dob.getMonth() ||
      now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate()) {
      years--;
    }

    return Math.floor(years);
  }


  dateValidator(customMessage?: boolean) {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      const dateValue = moment(value, 'MM/DD/YYYY', true);

      if (customMessage) {
        return !dateValue.isValid() ? { invalidEffectiveDate: { value: true } } : null;
      }

      return !dateValue.isValid() ? { invalidDate: { value: true } } : null;
    };
  }

  alphaStringValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;

      return !this.alphaStringRegex.test(value) ? { invalidAlphaString: { value: true } } : null;
    };
  }

  numberValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      let hasError = false;

      hasError = !this.numberRegex.test(value);
      const c = hasError ? { invalidNumber: { value: true } } : null;

      return hasError ? { invalidNumber: { value: true } } : null;
    };

  }

  focusFirstError() {
    setTimeout(() => {
      if ($('input.ng-invalid') && $('input.ng-invalid').length) {
        $('input.ng-invalid')[0].focus();
      }
    }, 10);
  }

  focusFirstFiled() {
    setTimeout(() => {
      if ($('input.ng-valid') && $('input.ng-valid').length) {
        $('input.ng-valid')[0].focus();
      }
    }, 10);
  }

  accessCodeValidator() {
    return (group: FormGroup): { [key: string]: any } => {
      for (const control in group.controls) {
        const field = group.controls[control];
        if (field.value && !this.numberRegex.test(field.value)) {
          // set error for the field
          return { invalidAccessCode: true };
        }
      }

      return null;
    };
  }

  studentIdValidator() {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      let hasError = false;

      hasError = !this.studentIdRegex.test(value);
      const c = hasError ? { invalidStudentId: { value: true } } : null;
      return hasError ? { invalidStudentId: { value: true } } : null;
    };
  }

  ninetyDaysValidator() {

    return (control: AbstractControl) => {

      const value = control.value;
      let maxDays, hasError,  inputDate;
      //let range

      if (value) {

        const currentDate = new Date();

        maxDays = moment(currentDate).add(90, 'days');
        maxDays = new Date(maxDays);

        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
          endDate = new Date(maxDays.getFullYear(), maxDays.getMonth(), maxDays.getDate());

        inputDate = new Date(value);
        inputDate = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());

        //range = new DateRange(startDate, endDate);

       // hasError = !range.contains(inputDate);

        return hasError ? { ninetyDays: { value: true } } : null;
      }

    };
  }


  formatPhone(inputPhoneNumber) {
    let phoneNumber = inputPhoneNumber.toString();
    if (phoneNumber) {
      phoneNumber = phoneNumber.replace(/-/g, '');
      const areaCode = phoneNumber.slice(0, 3);
      const number = phoneNumber.slice(3);
      return areaCode + '-' + number.slice(0, 3) + '-' + number.slice(3);
    }

  }

  clearErrorInControl(control: AbstractControl, errorType: string) {
    if (control.errors && control.errors[errorType]) {
      const errorList = {};
      let hasErrors = false;
      for (const error in control.errors) {
        if (error && error !== errorType) {
          hasErrors = true;
          errorList[error] = control.errors[error];
        }
      }
      control.setErrors(hasErrors ? errorList : null);
    }
  }

  clearApiErrorOnChange(control: AbstractControl, errorType: string, validators) { // Name Can be changed later
    control.markAsTouched();
    control.valueChanges.subscribe((e) => {
      control.clearValidators();
      control.setValidators(validators);
      this.clearErrorInControl(control, errorType);
    });
  }
}
