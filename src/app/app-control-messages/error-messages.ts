export class ErrorMessage {

  private static customErrorMessages = {
    required: '{0} is required',
    invalidAlphaString: '{0} is invalid'
  };

  private static errorMessages = {
    firstName: {
      required: 'First Name is required',
      invalidAlphaString: 'Invalid first name, please try again.',
      incorrectFirstName: 'First Name is incorrect'
    },
    lastName: {
      required: 'Last Name is required',
      invalidAlphaString: 'Invalid last name, please try again.',
      incorrectLastName: 'Last Name is incorrect'
    },
    dateOfBirth: {
      required: 'You must enter a valid date of birth.',
      invalidDob: 'Please enter a valid date of birth.',
      incorrectDob: 'Please enter a valid date of birth.',
      invalidDate: 'Please enter a valid date of birth.',
      invalidEffectiveDate: 'Effective Date is invalid',
      invalidAge: 'Invalid date of birth. You must be 18 to continue. Please try again.'
    },
    hintAnswer: {
      required: 'You must enter an answer to the your hint question',
      invalidHintAnswer: 'Your hint answer cannot contain any spaces or special characters.' +
        'Please re-enter the answer to your hint question'
    },
    email: {
      required: 'You must enter a valid email address.',
      invalidEmail: 'Please enter a valid email.'
    },
    phone: {
      required: 'You must enter a valid phone number.',
      invalidNumber: 'Please enter a valid phone number.',
      invalidMobile: 'Please enter a valid phone number.'
    },
    memberId: {
      required: 'Member ID is required',
      minlength: 'Member ID must be at least 12 characters',
      incorrectMemberId: 'Member ID is incorrect'
    },
    ssn: {
      required: 'SSN is required',
      invalidSSN: 'Invalid SSN. Please try again'
    },
    studentid: {
      required: 'Student ID is required'
    },
    regpassword: {
      required: 'You must enter a valid password.',
      minlength: 'Minimum length is requiredLength characters',
      invalidPassword: 'Invalid password. Password must contain a uppercase letter ,and a number and a special character.',
    },
    mobile: {
      required: 'You must enter a valid phone number.',
      invalidNumber: 'Please enter a valid phone number.',
      invalidMobile: 'Please enter a valid phone number.'
    }
  };
  static getMessages(identifier) {
    const messages = this.errorMessages[identifier];
    return messages ? messages : {};
  }

  static replacePlaceHolders(messages) {
    for (const msg in messages) {
      if (this.customErrorMessages[msg]) {
        // TODO: remove replace method and use some method like string.format message
        messages[msg] = this.customErrorMessages[msg].replace('{0}', messages[msg]);
      }
    }
    return messages;
  }
}

