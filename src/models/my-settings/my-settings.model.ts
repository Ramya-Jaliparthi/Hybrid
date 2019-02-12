import { GenericResponseModel } from "../generic-response-model/generic-response.model";

export class CommChannelstatusModel extends GenericResponseModel {
    MemEmailAddress: string;
    MemMobileNumber: any;
    IsVerifiedEmail: string;
    IsVerifiedMobile: string;
    RegistrationStatus: string;
    PromoOptinEmail: string;
    PromoOptinText: string;
    MandOptinEmail: string;
    MandOptinText: string;
}