import { CustomizedAddressInfoForDisplayInterface, LinkInterface } from './interfaces/fad-doctor-profile.interface';

export class CustomizedAddressInfoForDisplay implements CustomizedAddressInfoForDisplayInterface {
    address: string;
    primaryPhone: string;
    formatedPrimaryPhoneNumber: string;
}

export class Link implements LinkInterface {
    name: string;
    url: string;
}
