import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationProvider } from '../../providers/validation/ValidationService';
import { ConfigProvider } from '../../providers/config/config';
@Component({
  selector: 'password-validation',
  templateUrl: 'password-validation.html'
  // styleUrls: ['password-control-messages.component.scss']
})
export class PasswordValidation {
  @Input() control: FormControl;
  @Input() password: any;
  @Input() isSubmitted: boolean;
  @Input() isBlurEvent: boolean;
  allowedSpecialCharters = '  @ ! # $ % ^ & * ( ) + ~ . , / [ ] { } - ';
  constructor(private validation: ValidationProvider, public config: ConfigProvider) {
  }

  get errorMessage() {
    return this.validation.passwordStatus(this.password);
  }

}
