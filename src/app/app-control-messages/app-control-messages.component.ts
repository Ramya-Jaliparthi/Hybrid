import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ValidationService} from './validation.service';
import {ErrorMessage} from './error-messages';

@Component({
  selector: 'app-control-messages',
  templateUrl: './app-control-messages.html'
})
export class ControlMessagesComponent {
  @Input() control: FormControl;
  @Input() customMessages: any;
  @Input() valdiateOnFormSubmit: boolean = false;
  @Input() isFormSubmitted: boolean = false;
  @Input() controlName: string = '';

  constructor(private validation: ValidationService) {
  }

  get errorMessage() {
    this.populateErrorMessages();
    for (const propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.valdiateOnFormSubmit === true && this.isFormSubmitted === true) {
        return this.validation.getValidatorErrorMessage(propertyName, this.control.errors[propertyName], this.customMessages);
      } else if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched && this.valdiateOnFormSubmit === false) {
        return this.validation.getValidatorErrorMessage(propertyName, this.control.errors[propertyName], this.customMessages);
      }
    }
    return null;
  }

  populateErrorMessages(): void {
    if (this.controlName && !this.customMessages) {
      const messages = ErrorMessage.getMessages(this.controlName);
      this.customMessages = messages ? messages : {};
    }
  }

}
