import { GetSearchByProfessionalRequestModelInterface, GetSearchByProfessionalResponseModelInterface } from './../modals/interfaces/getSearchByProfessional-models.interface';
import { FadVitalsProfessionalsSearchResponseModelInterface, FadVitalsFacilitiesSearchResponseModelInterface } from './../modals/interfaces/fad-vitals-collection.interface';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FadLandingPageSearchControlValuesInterface } from '../modals/interfaces/fad-landing-page.interface';
import { AuthenticationService } from './../../../providers/login/authentication.service';
import { FadConstants } from './../constants/fad.constants';
import { GetSearchByFacilityRequestModelInterface, GetSearchByFacilityResponseModelInterface } from './../modals/interfaces/getSearchByFacility-models.interface';

@Injectable()
export class FadSearchResultsService {

    public searchCriteria: FadLandingPageSearchControlValuesInterface;
    public searchResultCache: FadVitalsProfessionalsSearchResponseModelInterface = null;

    constructor(private authService: AuthenticationService) { }

    public getFadProfileSearchResults(searchReqObj: GetSearchByProfessionalRequestModelInterface, hideMask?: boolean): Observable<FadVitalsProfessionalsSearchResponseModelInterface> {

        // const url = (FadConstants.api.switchToApiUrlFromJsonFile) ? FadConstants.api.fadUrl+FadConstants.urls.fadLandingPageProfessionalsSearchListUrl : FadConstants.jsonurls.fadLandingPageProfessionalsSearchListUrl;    
        const url = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty('searchbyprofessional');
        let mask = '';
        if (!hideMask) {
            mask = this.authService.showLoadingMask('Accessing fad search results ...');
        }
        console.log("Request Obj", searchReqObj);

        const isKey2req = false;
        return this.authService.makeHTTPRequest("post", url, mask, JSON.stringify(this.authService.encryptPayload(searchReqObj, isKey2req)), this.authService.getHttpOptions(), 'Accessing Fad List...')
            .map(res1 => {
                if (res1.result === '0' || res1.result === 0) {
                    return this.authService.handleDecryptedResponse(res1);
                } else {
                    this.authService.showAlert('', res1.displaymessage || res1.errormessage);
                }
            });
    }

    public getFadFacilitySearchResults(searchReqObj: GetSearchByFacilityRequestModelInterface, hideMask?: boolean): Observable<FadVitalsFacilitiesSearchResponseModelInterface> {

        // const url = (FadConstants.api.switchToApiUrlFromJsonFile) ? FadConstants.api.fadUrl+FadConstants.urls.fadLandingPageProfessionalsSearchListUrl : FadConstants.jsonurls.fadLandingPageProfessionalsSearchListUrl;
        const url = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty('searchbyfacilities');
        let mask = '';
        if (!hideMask) {
            mask = this.authService.showLoadingMask('Accessing fad search results ...');
        }
        console.log("Request Obj", searchReqObj);

        const isKey2req = false;
        return this.authService.makeHTTPRequest("post", url, mask, JSON.stringify(this.authService.encryptPayload(searchReqObj, isKey2req)), this.authService.getHttpOptions(), 'Accessing Fad List...')
            .map(res1 => {
                if (res1.result === '0' || res1.result === 0) {
                    return this.authService.handleDecryptedResponse(res1);
                } else {
                    this.authService.showAlert('', res1.displaymessage || res1.errormessage);
                }
            });

    }
}
