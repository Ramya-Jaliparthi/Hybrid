import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationProvider } from '../providers/validation/ValidationService'
@Component({
    selector: 'control-messages',
    template: `<div *ngIf="errorMessage !== null"><ion-icon name="ios-alert-outline" class="errorIcon"></ion-icon>{{errorMessage}}</div>`
})
export class ControlMessages {
    @Input() control: FormControl;
    constructor(private validation: ValidationProvider) { }

    get errorMessage() {
        for (let propertyName in this.control.errors) {
            if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
                return this.validation.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
            }
        }
        return null;
    }
}