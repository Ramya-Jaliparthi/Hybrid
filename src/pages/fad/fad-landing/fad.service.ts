import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../../../providers/login/authentication.service';
import { FadConstants } from '../constants/fad.constants';

import {
    FadLandingPageCompInputInterface,
    FadAutoCompleteOptionForSearchTextInterface,
    FadAutoCompleteComplexOptionInterface,
    FadLinkOptionInterface,
    FadLandingPageSearchControlValuesInterface,
    FadLandingPageCompOutputInterface
} from '../modals/interfaces/fad-landing-page.interface';
import {
    FadAutoCompleteOptionForSearchText,
    FadAutoCompleteComplexOption, FadLandingPageSearchControlsModel,
    FadLandingPageSearchControlValues, FadLandingPageCompOutput, LandingPageResponseCacheModel
} from '../modals/fad-landing-page.modal';
import { AlertController } from 'ionic-angular';
@Injectable()
export class FadService {
    private _member: string;
    private _zip;
    private _search;
    private _plan;
    private _geoLocation;
    private _professional;
    constructor(private authService: AuthenticationService,public alertCtrl: AlertController) {
        this.plan = new FadAutoCompleteComplexOption().setSimpleText('HMO Blue').setProfileId(311005011);
        this.zip = new FadAutoCompleteComplexOption().setContextText(`${FadConstants.defaultZipCode} - ${FadConstants.defaultCity}, ${FadConstants.defaultState}`)
        .setInfoText(`${FadConstants.defaultZipCode} - ${FadConstants.defaultCity}, ${FadConstants.defaultState}`).setProfileId(FadConstants.defaultZipCode)
        .setGeoLocation(`${FadConstants.defaultGeoLocation}`);
        // this._geoLocation = new FadAutoCompleteComplexOption().setGeoLocation(`${FadConstants.defaultGeoLocation}`);
    }

    get member() {
        return this._member;
    }

    set member(member: string) {
        this._member = member;
    }

    get zip() {
        return this._zip;
    }

    set zip(zip) {
        this._zip = zip;
    }

    get plan() {
        return this._plan;
    }

    set plan(plan) {
        this._plan = plan;
    }

    get search() {
        return this._search;
    }

    set search(search) {
        this._search = search;
    }

    get geoLocation() {
        return this._geoLocation;
    }

    set geoLocation(geoLocation) {
        this._geoLocation = geoLocation;
    }

    get professional() {
        return this._professional;
    }

    set professional(professional) {
        this._professional = professional;
    }

    showAlert(ptitle, psubtitle, callBackHandler?, scopeParam?, cssClassName?) {
        let alert = this.alertCtrl.create({
            title: ptitle,
            subTitle: psubtitle,
            cssClass: cssClassName ? cssClassName : "",
            buttons: [{
                text: 'Ok',
                handler: () => {
                    alert.dismiss().then(() => {
                        if (callBackHandler) {
                            window.setTimeout(() => {
                                callBackHandler.call(scopeParam);
                            }, 300);

                        }
                    });
                    return false;
                }
            }]
        });
        alert.present();
        this.authService.setAlert(alert);
    }


}
