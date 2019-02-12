import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../../../providers/login/authentication.service';
import {
    FadVitalsAutoCompleteSearchRequestModelInterface,
    FadVitalsAutoCompleteSearchResponseModelInterface,
    FadZipCodeSearchResponseModelInterface,
    FadPlanSearchResponseModelInterface,
    FadVitalsSearchHistoryResponseModelInterface,
    FadVitalsZipCodeSearchRequestModelInterface,
    DoctorProfileSearchRequestModelInterface,
    FadVitalsProfessionalsSearchResponseModelInterface,
    FacilityProfileSearchRequestModelInterface,
    FadVitalsFacilitiesSearchResponseModelInterface,
    FADPlanSearchRequestModelInterface
} from '../modals/interfaces/fad-vitals-collection.interface';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import {
    FadLandingPageSearchControlsModelInterface,
    FadLandingPageSearchControlValuesInterface,
    FadAutoCompleteOptionForSearchTextInterface,
    LandingPageResponseCacheModelInterface
} from '../modals/interfaces/fad-landing-page.interface';
import {
    FadLandingPageSearchControlsModel, FadLandingPageSearchControlValues,
    FadAutoCompleteOptionForSearchText
} from '../modals/fad-landing-page.modal';
import { FadConstants } from '../constants/fad.constants';

@Injectable()
export class FadHomeSearchService {
    constructor(private authService: AuthenticationService) { }
    isKey2Req = false;

    getVitalsSearchResponse(request: FadVitalsAutoCompleteSearchRequestModelInterface): Observable<FadVitalsAutoCompleteSearchResponseModelInterface> {
        let params = new HttpParams();
        for (let key in request) {
            params = params.append(key.toString(), request[key]);
        }
        let mask = '';
        // const url = (FadConstants.api.switchToApiUrlFromJsonFile) ? FadConstants.api.fadUrl + FadConstants.urls.fadLandingPageSearchAutocompleteListUrl : FadConstants.jsonurls.fadLandingPageSearchAutocompleteListUrl;
        const url = this.authService.configProvider.getProperty('loginUrl') + this.authService.configProvider.getProperty('autocomplete');
        return this.authService.makeHTTPRequest('post', url, mask, JSON.stringify(this.authService.encryptPayload(request, this.isKey2Req)), this.authService.getHttpOptions(), '').map(response => {
            if (response.result === "0" || response.result === 0) {
                return this.authService.handleDecryptedResponse(response);
            } else {
                this.authService.showAlert('', response.displaymessage || response.errormessage);
                return null;
            }
        });;
    }

    getVitalsPlanInfo(request: FADPlanSearchRequestModelInterface): Observable<FadPlanSearchResponseModelInterface> {
        let params = new HttpParams();
        for (let key in request) {
            params = params.append(key.toString(), request[key]);
        }
        let mask = '';
        const url = (FadConstants.api.switchToApiUrlFromJsonFile) ? FadConstants.api.fadUrl + FadConstants.urls.fadLandingPagePlansAutocompleteListUrl : FadConstants.jsonurls.fadLandingPagePlansAutocompleteListUrl;
        return this.authService.makeHTTPRequest('get', url, mask, JSON.stringify(this.authService.encryptPayload(request, this.isKey2Req)), this.authService.getHttpOptions(), '').map(response => {
            if (response.result === "0") {
                return this.authService.handleDecryptedResponse(response);
            } else {
                return response;
            }
        });;
    }

    getVitalsZipCodeInfo(request: FadVitalsZipCodeSearchRequestModelInterface): Observable<FadZipCodeSearchResponseModelInterface> {
        let params = new HttpParams();
        for (let key in request) {
            params = params.append(key.toString(), request[key]);
        }
        //const headers = new HttpHeaders().set('Content-Type', 'text/html');
        let mask = '';
        const url = this.authService.configProvider.getProperty("loginUrl") + this.authService.configProvider.getProperty('searchByLocation');

        return this.authService.makeHTTPRequest('get', url, mask, '',{ params: params }, '').map(response => {
            return response;
        });
    }
}
