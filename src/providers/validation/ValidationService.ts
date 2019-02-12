import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { ConfigProvider } from '../../providers/config/config';

@Injectable()
export class ValidationProvider {

    config: object;
    emailRegex: RegExp;
    mobileRegex: RegExp;
    amountRegex: RegExp;
    specialCharactersRegex: RegExp;
    static validEmailDomainExt: Array<any>;
    static dobMask = [/[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
    static mobileMask = [/[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
    static amountRegex = /^\d{1,4}(\.\d{1,2})?$/;
    static alphaStringRegex = /^[a-zA-Z]*$/;

    public static AUTH_INVALID_IDENTIFITERS = {
        'dateOfBirth': 'MEM_DOB',
        'firstName': 'MEM_FNAME',
        'lastName': 'MEM_LNAME',
        'memberId': 'MEM_NUM'
    };

    constructor(public configProvider: ConfigProvider) {
        this.config = {
            'required': '*Required Field',
            'requiredUsernameForLoginScreen': 'You must enter a valid username.',
            'requiredUsername': 'Please enter a valid username.',
            'requiredPasswordForLoginScreen': 'You must enter a valid password.',
            'requiredPassword': 'Password is required',
            'invalidPassword': "Your password doesn't meet the minimum criteria listed below. Please try again.",
            'invalidPasswordForRegistration': "Your password does not meet the minimum requirement. Please try again.",
            'minlength': "Minimum length is requiredLength characters",
            'maxlength': "Maximum length is requiredLength characters",
            'invalidEmail': "Please enter a valid email.",
            'invalidEmailRegistration': "You must enter a valid email address.",
            'invalidEmailRegistrationForPersonalInfo': 'Invalid email address. Please try again.',
            'requiredEmail': "Email address is required.",
            'invalidMobile': " Please enter a valid phone number.",
            'invalidMobileForPersonalInfo': "Invalid mobile number. Please try again.",
            'requiredMobileRegistration': "You must enter a valid mobile number.",
            'requiredMobile': "Mobile Number is required",
            'invalidMobileRegistration': "You must enter a valid phone number.",
            'invalidDate': "Invalid Date",
            'invalidFN': 'Invalid FirstName',
            'invalidLN': 'Invalid LastName',
            'invalidDateOfBirth': 'Please enter a valid date of birth.',
            'invalidDateOfBirthForPersonalInfo': 'You must be 18 to continue.',
            'requiredDOB': 'Please enter a valid date of birth.',
            'requiredDOBForPersonalInfo': 'You must enter your date of birth.',
            'invalidAlphaString': "It should contain only strings",
            'termsAndCondition': 'Please read and accept the Terms and Conditions.',
            'invalidFormat': 'Invalid format',
            'invalidFirstName': 'Invalid first name, please try again.',
            'requiredFirstName': 'You must enter your first name.',
            'invalidLastName': "Invalid last name, please try again.",
            'invalidMemberId': "Invalid Member ID. Please try again.",
            'incorrectMemberId': "Member ID is incorrect",
            'requiredLastName': "You must enter your last name.",
            'requiredMemberId': "You must enter a valid Member ID.",
            'invalidMemberSuffix': "Invalid Suffix",
            'requiredMemberSuffix': "Please enter a suffix.",
            'invalidUsername': "Invalid username, please try again.",
            'invalidSsn': "Invalid SSN. Please try again",
            'requiredSsn': "You must enter your Social Security number.",
            'invalidStudentId': "Invalid Student Id",
            'requiredStudentId': "You must enter a valid student ID.",
            'invalidHintAnswer': 'Invalid hint answer.Please try again',
            'invalidHintAnswerForUserMigration': "Incorrect answer. Please try again. Remember that your answer can't contain any spaces or special characters.",
            'requiredHintAnswer': 'You must answer the hint question.',
            'requiredHintQuestion': 'Hint Question is required',
            'requiredZipcode': 'Zip code is required',
            'requiredCity': 'City is required',
            'requiredMailingAddress': 'Address is required',
            'invalidCity': 'Invalid city, please try again.',
            'invalidZipCode': 'Invalid zip code, please try again.',
            'invalidMailingAddress': 'Invalid address, please try again.',
            'samePassword': 'Your new password cannot be the same as your old password.',
            'serviceTypeMessages': 'Please make a selection',
            'requiredMemberMessage': 'Please select a member',
            'invalidEmailForUserMigration': "You must enter a valid email.",
            'invalidAmount': 'You must enter a valid amount',
            'invalidDateFormat': 'Please enter date in the format of MM/DD/YYYY.',
            'invalidEndDate': 'End Date may not be before the Start Date.',
            'invalidCharacters': 'You must not enter any special characters',
            'requiredproviderName': 'Provider name is required',
            'alphaStringValidator': 'You must enter a valid provider name',
            'requiredProviderAddress': 'You must enter a valid mailing address.',
            'requiredProviderAddressMaxLength': 'Mailing address must contain at max 30 letters.',
            'alphaStringCityValidator': 'You must enter a valid city name',
            'requiredProviderState': 'State is required',
            'zipCodeMinlength': 'Please enter 5 digit zip code.',
            'zipCodeMaxlength': 'You must enter a valid zip code.',
            'phNbrMaxlength': 'Please enter 10 digit phone number.',
            'mobileNumberValidatorForProfile': 'You must enter a valid phone number.',
            'samerenterPassword': 'Password does not match.'
        };

        this.emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.mobileRegex = /^[0-9]{12}$-/;
        this.specialCharactersRegex = /[^a-z0-9\s\.\-\/\*&;:,'"#]+/i;
        this.amountRegex = /^\d{1,4}(\.\d{1,2})?$/;
        ValidationProvider.validEmailDomainExt = this.configProvider.getProperty("validEmailDomainExt");
    }
    getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let error = this.config[validatorName];
        if (validatorName === 'minlength' || validatorName === 'maxlength') {
            error = error.replace('requiredLength', validatorValue.requiredLength);
        }
        return error;
    }
    static usernameValidator(control) {
        if (!control.dirty)
            return null;

        if (control.value && control.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            // removed validation as per Bob -Mobile App User Registration - Invalid Email error
            return null;
        } else if (control.value && control.value.match(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/)) {

        } else {
            return { 'invalidUsername': true };
        }

    }
    static emailValidator(control) {
        // RFC 2822 compliant regex

        if (control.value === "") {
            return null;
        }
        if (!control.dirty)
            return null;
        if (control.value && control.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            // removed validation as per Bob -Mobile App User Registration - Invalid Email error
            return null;
        } else {
            return { 'invalidEmail': true };
        }
    }

    static emailValidatorForProfile(control) {
        // RFC 2822 compliant regex

        if (control.value === "") {
            return null;
        }
        if (!control.dirty)
            return null;
        if (control.value && control.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            // removed validation as per Bob -Mobile App User Registration - Invalid Email error
            return null;
        } else {
            return { 'invalidEmailRegistration': true };
        }
    }

    static emailRequiredValidator(control) {
        // RFC 2822 compliant regex

        if (control.value === "") {
            return { 'requiredEmail': true };
        }
        if (!control.dirty)
            return null;
        if (control.value && control.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            // removed validation as per Bob -Mobile App User Registration - Invalid Email error
            return null;
        } else {
            return { 'invalidEmailRegistration': true };
        }
    }

    static emailRequiredValidatorForPersonalInfo(control) {
        // RFC 2822 compliant regex

        if (control.value === "") {
            return { 'invalidEmailRegistration': true };
        }
        if (!control.dirty)
            return null;
        if (control.value && control.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            // removed validation as per Bob -Mobile App User Registration - Invalid Email error
            return null;
        } else {
            return { 'invalidEmailRegistrationForPersonalInfo': true };
        }
    }

    static emailRequiredValidatorForUserMigration(control) {
        // RFC 2822 compliant regex

        if (control.value === "") {
            return { 'invalidEmailRegistration': true };
        }
        if (!control.dirty)
            return null;
        if (control.value && control.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            // removed validation as per Bob -Mobile App User Registration - Invalid Email error
            return null;
        } else {
            return { 'invalidEmailForUserMigration': true };
        }
    }

    static emailRequiredRegistrationValidator(control) {
        // RFC 2822 compliant regex

        if (control.value === "") {
            // return { 'requiredEmail': true };
            return { 'invalidEmailRegistration': true };
        }
        if (!control.dirty)
            return null;
        if (control.value && control.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            // removed validation as per Bob -Mobile App User Registration - Invalid Email error
            return null;
        } else {
            return { 'invalidEmailRegistration': true };
        }
    }

    static mobileNumberValidator(control) {
        if (control.value === "") {
            return null;
        }
        if (control.value && control.value.match(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/)) {

            if (control.value != null && (control.value.startsWith('000') || control.value.startsWith('555') || control.value.startsWith('999') || control.value.startsWith('1'))) {
                return { 'invalidMobile': true };
            }
            return null;
        } else {
            return { 'invalidMobile': true };
        }
    }
    static mobileNumberValidatorForPersonalInfo(control) {
        if (control.value === "") {
            return null;
        }
        if (control.value && control.value.match(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/)) {

            if (control.value != null && (control.value.startsWith('000') || control.value.startsWith('555') || control.value.startsWith('999') || control.value.startsWith('1'))) {
                return { 'invalidMobileForPersonalInfo': true };
            }
            return null;
        } else {
            return { 'invalidMobileForPersonalInfo': true };
        }
    }
    static mobileNumberValidatorForProfile(control) {

        if (control.value === "" || !control.value) {
            return null;
        }
        let _mobile = control.value.toString();
        if (_mobile && _mobile.match(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/)) {

            if (_mobile != null && (_mobile.startsWith('000') || _mobile.startsWith('555') || _mobile.startsWith('999') || _mobile.startsWith('1'))) {
                return { 'invalidMobileRegistration': true };
            }
            return null;
        } else {
            return { 'invalidMobileRegistration': true };
        }
    }
    static mobileNumberValidatorRegistration(control) {
        if (control.value === "" || !control.value) {
            // return null;
            return { 'invalidMobileRegistration': true };
        }
        if (control.value && control.value.match(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/)) {

            if (control.value != null && (control.value.startsWith('000') || control.value.startsWith('555') || control.value.startsWith('999') || control.value.startsWith('1'))) {
                return { 'invalidMobileRegistration': true };
            }
            return null;
        } else {
            return { 'invalidMobileRegistration': true };
        }
    }
    static requiredMobileNumberValidator(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'invalidMobileRegistration': true };
        }
    }
    static requiredMobileNumberValidatorRegistration(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredMobileRegistration': true };
        }
    }
    static requiredPhoneNumberValidator(control) {
        if (control.value != null && control.value != "") {
            return null;
        } else {
            return { 'requiredMobile': true };
        }
    }

    static passwordValidator(control) {
        const value = control.value;
        let hasError = false;
        const hasNumberRegEx = /\d/g;
        const hasCapitalLetterRegEx = /[A-Z]/g;
        const hasSpecialCharRegEx = /[@!#\$\^%&*()+=_\-\[\]\\\';,\.\/\{\}\|\":<>\?]/g;
        const hasSpaceRegEx = /[ ]/g;

        // Has atlest one number
        if (!hasNumberRegEx.test(value)) {
            hasError = true;
        }
        if (!hasError && !hasCapitalLetterRegEx.test(value)) {
            hasError = true;
        }
        // Has atleast one special Character
        if (!hasError && !hasSpecialCharRegEx.test(value)) {
            hasError = true;
        }

        //Has no space
        if (!hasError && hasSpaceRegEx.test(value)) {
            hasError = true;
        }

        //Has length > 7
        if (!hasError && (value.length < 8 || value.length > 16)) {
            hasError = true;
        }
        return hasError ? { invalidPassword: { value: true } } : null;
    }

    static termsAndConditionCheck(control) {
        if (control.value == "false" || !control.value) {
            return { "termsAndCondition": false };
        }
    }
    static dateValidator(control) {
        const value = control.value;
        const dateValue = moment(value, 'MM/DD/YYYY', true);
        if (!dateValue.isValid()) {
            return { 'invalidDateOfBirth': true };
        } else {
            return null;
        }
    }

    static startDateValidator(control) {
        const value = control.value;
        const dateValue = moment(value, 'MM/DD/YYYY', true);
        if (!dateValue.isValid()) {
            return { 'invalidDateFormat': true };
        } else {
            // check min. 18 yrs and greater than or equal to Jan 1, 1900
            let now = moment();
            let usrdt = moment(value, 'MM/DD/YYYY');
            if (usrdt.isAfter('1899-12-31'))
                return null;
            else
                return { 'invalidDate': true };
        }
    }

    static endDateValidator(control) {
        const value = control.value;
        const dateValue = moment(value, 'MM/DD/YYYY', true);
        if (!dateValue.isValid()) {
            return { 'invalidDateFormat': true };
        } else {
            // check min. 18 yrs and greater than or equal to Jan 1, 1900
            let now = moment();
            let usrdt = moment(value, 'MM/DD/YYYY');
            if (usrdt.isAfter('1899-12-31'))
                return null;
            else
                return { 'invalidDate': true };
        }
    }

    static dobValidator(control) {
        const value = control.value;
        const dateValue = moment(value, 'MM/DD/YYYY', true);
        if (!dateValue.isValid()) {
            return { 'invalidDateOfBirth': true };
        } else {
            // check min. 18 yrs and greater than or equal to Jan 1, 1900
            let now = moment();
            let usrdt = moment(value, 'MM/DD/YYYY');
            if (usrdt.isAfter('1899-12-31') && now.diff(usrdt, 'years') >= 18)
                return null;
            else
                return { 'invalidDateOfBirthForPersonalInfo': true };
        }
    }

    static dobValidatorForPersonalInfo(control) {
        const value = control.value;
        const dateValue = moment(value, 'MM/DD/YYYY', true);
        if (!dateValue.isValid()) {
            return { 'invalidDateOfBirth': true };
        } else {
            // check min. 18 yrs and greater than or equal to Jan 1, 1900
            let now = moment();
            let usrdt = moment(value, 'MM/DD/YYYY');
            if (usrdt.isAfter('1899-12-31') && now.diff(usrdt, 'years') >= 18)
                return null;
            else
                return { 'invalidDateOfBirthForPersonalInfo': true };

        }

    }
    static requiredDOB(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredDOB': true };
        }
    }
    static requiredDOBForPersonalInfo(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredDOBForPersonalInfo': true };
        }
    }
    static memberIdValidator(control) {
        if (control.value && control.value.match(/^[a-zA-Z]{3}[0-9]{9}$/)) {
            return null;
        } else {
            return { 'invalidMemberId': true };
        }
    }
    static incorrectMemberId() {
        return { 'incorrectMemberId': true };
    }
    static invalidDate() {
        return { 'invalidDate': true };
    }
    static invalidFN() {
        return { 'invalidFN': true };
    }
    static invalidLN() {
        return { 'invalidFN': true };
    }
    static requiredmemberIdValidator(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredMemberId': true };
        }
    }
    static memberSuffixValidator(control) {
        if (control.value && control.value.match(/^[Z0-9]{2}$/)) {
            return null;
        } else {
            return { 'invalidMemberSuffix': true };
        }
    }
    static requiredmemberSuffixValidator(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredMemberSuffix': true };
        }
    }

    static firstnameValidator(control) {
        //let isOnlyAlphabets = /^[a-zA-Z\u2018\u2019 '-.]*$/;
        let isOnlyAlphabets = /^[ \.\'a-zA-Z-]*$/;
        if (control.value && isOnlyAlphabets.test(control.value) && control.value.trim() != "") {
            return null;
        } else {
            return { 'invalidFirstName': true };
        }
    }
    static requiredfirstname(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredFirstName': true };
        }
    }
    static lastnameValidator(control) {
        //let isOnlyAlphabets = /^[a-zA-Z\u2018\u2019 '-]*$/;
        let isOnlyAlphabets = /^[ \.\'a-zA-Z-]*$/;
        if (control.value && isOnlyAlphabets.test(control.value) && control.value.trim() != "") {
            return null;
        } else {
            return { 'invalidLastName': true };
        }

    }

    static requiredlastname(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredLastName': true };
        }
    }

    static ssnValidator(control) {
        if (control.value && control.value.match(/^[0-9]{4}$/)) {
            return null;
        } else {
            return { 'invalidSsn': true };
        }
    }
    static requiredssnValidator(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredSsn': true };
        }
    }

    static studentIdValidator(control) {
        if (control.value && control.value.match(/[a-zA-Z0-9]$/)) {
            return null;
        }
        else {
            return { 'invalidStudentId': true }
        }
    }
    static requiredstudentIdValidator(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        }
        else {
            return { 'requiredStudentId': true }
        }
    }
    static hintAnswerValidator(control) {

        //let isOnlyAlphaNumeric = /^(\d|\w)+$/; // check only aplhanumeric , not speical char allowed
        if (control.value.trim() == "") {
            return { 'requiredHintAnswer': true };
            //} else if (control.value && isOnlyAlphaNumeric.test(control.value) && control.value.trim() != "") {
        } else if (control.value) {

            if ((control.value.length < 3)) {
                return { 'invalidHintAnswer': true };
            } else {
                return null;
            }
        }
    }

    static hintAnswerValidatorForProfile(control) {

        //let isOnlyAlphaNumeric = /^(\d|\w)+$/; // check only aplhanumeric , not speical char allowed
        if (control.value.trim() == "") {
            return { 'requiredHintAnswer': true };
            //} else if (control.value && isOnlyAlphaNumeric.test(control.value) && control.value.trim() != "") {
        } else if (control.value) {
            if ((control.value.length < 3)) {
                return { 'invalidHintAnswerForUserMigration': true };
            } else {
                return null;
            }
            //} else {
            // return { 'invalidHintAnswerForUserMigration': true };
        }

    }


    static hintAnswerValidatorUserMigration(control) {

        //let isOnlyAlphaNumeric = /^(\d|\w)+$/; // check only aplhanumeric , not speical char allowed
        if (control.value.trim() == "") {
            return { 'requiredHintAnswer': true };
            //} else if (control.value && isOnlyAlphaNumeric.test(control.value) && control.value.trim() != "") {
        } else if (control.value) {
            if ((control.value.length < 3)) {
                return { 'invalidHintAnswerForUserMigration': true };
            } else {
                return null;
            }
            //} else {
            // return { 'invalidHintAnswerForUserMigration': true };
        }

    }

    static requiredHintAnswer(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredHintAnswer': true };
        }
    }

    static requiredHintQuestion(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredHintQuestion': true };
        }
    }

    requiredMemberMessage(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredMemberMessage': true };
        }
    }

    requiredServiceMessage(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'serviceTypeMessages': true };
        }
    }


    static requiredZipcode(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredZipcode': true };
        }
    }
    static requiredCity(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {

            return { 'requiredCity': true };
        }
    }
    static requiredMailingAddress(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredMailingAddress': true };
        }
    }
    static requiredUsernameForLoginScreen(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredUsernameForLoginScreen': true };
        }
    }
    static requiredUsername(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredUsername': true };
        }
    }
    static requiredPasswordForLoginScreen(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredPasswordForLoginScreen': true };
        }
    }
    static requiredPassword(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredPassword': true };
        }
    }
    static requiredPasswordRegistration(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredPasswordForLoginScreen': true };
        }
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
        if (value && value.length >= 8) {
            hasMinLength = true;
        }

        if (hasSymbolRegEx.test(value)) {
            hasSymbol = true;
        }
        let splCharString = "";
        if (value) {
            splCharString = value.replace(hasSymbolRegEx, '').replace(hasNumberRegEx, '')
                .replace(hasCapitalLetterRegEx, '').replace(hasSmallLetterRegEx, '');
        }
        if (splCharString !== '' && !hasSymbolRegEx.test(splCharString)) {
            hasSymbol = false;
        }

        return { 'hasNumber': hasNumber, 'hasCapital': hasCapital, 'hasSmall': hasSmall, 'hasMinLength': hasMinLength, 'hasSymbol': hasSymbol };
    }
    static cityValidator(control) {
        if (control.value && control.value.match(/^[a-zA-Z]*$/)) {
            return null;
        } else {
            return { 'invalidCity': true };
        }
    }
    static zipcodeValidator(control) {
        const hasNumberRegEx = /[0-9]/g;
        if (control.value && hasNumberRegEx.test(control.value) && control.value.trim() != "") {
            return null;
        } else {
            return { 'invalidZipcode': true };
        }
    }
    static mailingAddressValidator(control) {
        if (control.value && control.value.match(/^[a-zA-Z0-9 , &*-:/;'.]*$/)) {
            return null;
        } else {
            return { 'invalidMailingAddress': true };
        }
    }

    samePasswordValidator(compareControl: AbstractControl) {
        return (control: AbstractControl) => {
            const val = control.value;
            if (val === compareControl.value) { return { 'samePassword': true }; }
            return null;
        };
    }
    samePasswordcheckValidator(compareControl: AbstractControl) {
        return (control: AbstractControl) => {
            const val = control.value;
            if (val != compareControl.value) { return { 'samerenterPassword': true }; }
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
        // Has atlest one number
        if (!hasNumberRegEx.test(value)) {
            hasError = true;
        }
        // Has atleast one Capital Letter
        if (!hasError && !hasCapitalLetterRegEx.test(value)) {
            hasError = true;
        }
        // Has atleast one special Character
        if (!hasSymbolRegEx.test(value)) {
            hasError = true;
        }
        if (value) {
            const splCharString = value.replace(hasSymbolRegEx, '').replace(hasNumberRegEx, '').replace(hasCapitalLetterRegEx, '').replace(hasSmallLetterRegEx, '');
            if (splCharString !== '' && !hasSymbolRegEx.test(splCharString)) {
                hasError = true;
            }
        }

        return hasError ? { invalidPassword: { value: true } } : false;
    }

    invalidPasswordValidatorRegistration(control: AbstractControl) {
        const value = control.value;
        let hasError = false;

        const hasNumberRegEx = /\d/g;
        const hasSmallLetterRegEx = /[a-z]/g;
        const hasCapitalLetterRegEx = /[A-Z]/g;
        const hasSymbolRegEx = /[!@#${^}%&*)([\-\]~+/.,*$]/g;
        // Has atlest one number
        if (!hasNumberRegEx.test(value)) {
            hasError = true;
        }
        // Has atleast one Capital Letter
        if (!hasError && !hasCapitalLetterRegEx.test(value)) {
            hasError = true;
        }
        // Has atleast one special Character
        if (!hasSymbolRegEx.test(value)) {
            hasError = true;
        }
        if (value) {
            const splCharString = value.replace(hasSymbolRegEx, '').replace(hasNumberRegEx, '').replace(hasCapitalLetterRegEx, '').replace(hasSmallLetterRegEx, '');
            if (splCharString !== '' && !hasSymbolRegEx.test(splCharString)) {
                hasError = true;
            }
        }

        return hasError ? { invalidPasswordForRegistration: { value: true } } : false;
    }



    isUsedIdValidEmailOrPhoneNumber(userid) {
        const emailRegex = new RegExp(this.emailRegex);
        return emailRegex.test(userid) || this.mobileRegex.test(userid) ? true : false;
    }

    static paymentAmountValidator(control) {

        const value = control.value;
        let hasError = false;
        const amountRegex = new RegExp(/^\d{1,9}(\.\d{1,2})?$/);
        if (!value || !amountRegex.test(value)) {
            hasError = true;
        } else {
            const numberValue = +value;
            if (!numberValue) {
                hasError = true;
            }
        }
        return hasError ? { invalidAmount: { value: true } } : null;
    }

    // alphaStringValidator() {
    //     return (control: AbstractControl): { [key: string]: any } => {
    //         const value = control.value;
    //         return !this.alphaStringRegex.test(value) ? { invalidAlphaString: { value: true } } : null;
    //     };
    // }

    specialCharactersValidator() {
        return (control: AbstractControl): { [key: string]: any } => {
            const value = control.value;
            return !this.specialCharactersRegex.test(value) ? { invalidCharacters: { value: true } } : null;
        };
    }

    // Add a provider page validations

    static requiredproviderName(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredproviderName': true };
        }
    }

    static requiredProviderAddress(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredProviderAddress': true };
        }
    }

    static requiredProviderState(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else {
            return { 'requiredProviderState': true };
        }
    }

    static requiredProviderAddressMaxLength(control) {
        if (control.value != null && control.value != "" && control.value.trim() != "") {
            return null;
        } else if (control.value != null && control.value && control.value.length > 30) {
            return { 'requiredProviderAddressMaxLength': true };
        }
    }

    static alphaStringValidator(control) {
        return !ValidationProvider.alphaStringRegex.test(control.value) ?
            { alphaStringValidator: true } : null;
    }

    static alphaStringCityValidator(control) {
        return !ValidationProvider.alphaStringRegex.test(control.value) ?
            { alphaStringCityValidator: true } : null;
    }

    static zipCodeMinlength(control) {
        return (control.value && control.value.length < 5) ? { zipCodeMinlength: true } : null;
    }

    static zipCodeMaxlength(control) {
        return (control.value && control.value.length > 5) ? { zipCodeMaxlength: true } : null;
    }

    static phNbrMaxlength(control) {
        return (control.value && control.value.length > 10) ? { phNbrMaxlength: true } : null;
    }


}
