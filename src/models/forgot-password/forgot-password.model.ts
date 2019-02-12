import { GenericResponseModel } from "../generic-response-model/generic-response.model";

export class ForgotPasswordResponseModel extends GenericResponseModel {
    commType: string;
    commValue: string;
    hintQuestion: string;
    webNonMigratedUser: string;
    isAuthenticated: string;
}