import { Injectable } from '@angular/core';
import { FadMedicalIndexRequestModal } from '../modals/fad-medical-index.modal';
import { FadVitalsSpecialitiesSearchResponseModelInterface } from '../modals/interfaces/fad-vitals-collection.interface';
import { FadMedicalIndexRequestModalInterface } from '../modals/interfaces/fad-medical-index.interface';
import { Observable } from 'rxjs/Observable';
import { FadConstants } from '../constants/fad.constants';
import { FadMedicalIndexParamType, FadResourceTypeCode } from '../modals/types/fad.types';
import { AuthenticationService } from './../../../providers/login/authentication.service';

@Injectable()
export class FadMedicalIndexService {

    constructor(private authService: AuthenticationService) { }

    public fetchMedicalIndex(): Observable<FadVitalsSpecialitiesSearchResponseModelInterface> {

        // if (request.type === FadMedicalIndexParamType.procedures) {
        // } else if (request.type === FadMedicalIndexParamType.specialities) {
        // }
        // const url = (FadConstants.api.switchToApiUrlFromJsonFile) ? FadConstants.api.fadUrl + FadConstants.urls.fadVitalsSpecialitiesUrl : FadConstants.jsonurls.fadVitalsSpecialitiesUrl;
        const url = this.authService.configProvider.getProperty('loginUrl') + this.authService.configProvider.getProperty('searchbyspeciality');
        let mask = this.authService.showLoadingMask('Accessing Specilaities information...');
        const isKey2Req = false;
        const fadMedicalIndexRequest: FadMedicalIndexRequestModalInterface =
            (new FadMedicalIndexRequestModal()).setUserId(this.authService.useridin).setNetworkId(FadConstants.defaultNetwork);
            return this.authService.makeHTTPRequest('post', url, mask, JSON.stringify(this.authService.encryptPayload(fadMedicalIndexRequest, isKey2Req)), this.authService.getHttpOptions(), 'Accessing Specilaities information...')
            .map(response => {
                if (typeof response.result !== 'undefined') {
                    if (response.result === '0' || response.result === 0) {
                        const decrypted = this.authService.handleDecryptedResponse(response);
                        console.log('decrypted', decrypted);
                        //decrypted.searchSpecialties = this.filterSpecialties(decrypted.searchSpecialties);
                        return decrypted;
                    } else {
                        this.authService.showAlert('', response.displaymessage || response.errormessage);
                    }
                } else {
                    if (response.searchSpecialties) {
                        //response.searchSpecialties = this.filterSpecialties(response.searchSpecialties);
                    }
                }
                return response;
            });
    }

    filterSpecialties(data) {
        return data.filter((item) => {
            return item.resourceTypeCode === FadResourceTypeCode.professional;
        })
    }

}
