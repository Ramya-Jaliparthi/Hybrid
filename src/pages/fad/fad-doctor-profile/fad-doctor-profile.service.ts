import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from './../../../providers/login/authentication.service';
import { FadConstants } from './../constants/fad.constants';
import { FadDoctorProfileRequestModelInterface, FadProfessionalResponseModelInterface } from '../modals/interfaces/fad-doctor-profile-details.interface';

@Injectable()
export class FadDoctorProfileDetailService {

    constructor(private authService: AuthenticationService) { }
    public doctorProfile: any;
    public getFadGetprofessionalprofileDetails(searchReqObj:FadDoctorProfileRequestModelInterface, hideMask?: boolean): Observable<FadProfessionalResponseModelInterface> {
        
        const url = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty('professionalprofile');
        let mask = '';
        if (!hideMask) {
            mask = this.authService.showLoadingMask('Accessing fad profile details...');
        }
        console.log("Request Obj", searchReqObj);

        const isKey2req = false;
        return this.authService.makeHTTPRequest("post", url, mask, JSON.stringify(this.authService.encryptPayload(searchReqObj, isKey2req)), this.authService.getHttpOptions(), 'Accessing Fad List...')
        .map(response => {
            if (response.result === '0' || response.result === 0) {
                return this.authService.handleDecryptedResponse(response);
            } else {
                throw(response);
            }
        });
    }
}
