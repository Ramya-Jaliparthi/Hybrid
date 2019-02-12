import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FadPage } from '../fad-landing/fad';
import { FadMedicalIndexPageTitle, FadMedicalIndexParamType, FadSearchCategories } from '../modals/types/fad.types';
import { FadMedicalIndexRequestModalInterface } from '../modals/interfaces/fad-medical-index.interface';
import { FadMedicalIndexService } from './fad-medical-index.service';
import { FadService } from '../fad-landing/fad.service';
import { AuthenticationService } from './../../../providers/login/authentication.service';
import { FadMedicalIndexRequestModal } from '../modals/fad-medical-index.modal';
import { FadConstants } from '../constants/fad.constants';
import { HashMap } from './../modals/hash-map.model';
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
/**
 * Generated class for the FadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-fad-medical-index',
    templateUrl: 'fad-medical-index.html',
})
export class FadMedicalIndexPage {
    searchType: string;
    pageTitle: string;
    isProcedureList: boolean = false;
    indexMap: HashMap<string[]> = new HashMap<string[]>();
    constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthenticationService, private fadMedicalService: FadMedicalIndexService, private fadService: FadService) {
        this.searchType = this.navParams.get('searchType');
        switch (this.searchType) {
            case FadMedicalIndexParamType.specialities:
                this.pageTitle = FadMedicalIndexPageTitle.allSpecialities;
                break;
            case FadMedicalIndexParamType.procedures:
                this.pageTitle = FadMedicalIndexPageTitle.allProcedures;
                this.isProcedureList = true;
                break;
        }
    }

    ionViewDidLoad() {
        this.getIndexData().subscribe((data) => {
            if (data && data.searchSpecialties) {
                data.searchSpecialties.map((specialityItem) => {
                    const key: string = specialityItem.name.charAt(0);
                    let specialityItemArray = [];
                    if (this.indexMap.contains(key)) {
                        specialityItemArray = this.indexMap.get(key);
                    } else {
                        specialityItemArray = [];
                    }

                    specialityItemArray.push({
                        name: specialityItem.name,
                        id: specialityItem.id,
                        resourceTypeCode: specialityItem.resourceTypeCode
                    }
                    );
                    specialityItemArray.sort((a, b) => a.name.localeCompare(b.name));
                    this.indexMap.put(key, specialityItemArray);
                });
            } else {
                throw new Error(FadConstants.errorMessages.invalidServiceResponseData);
            }
        },
        error => {
          this.authService.showAlert('', error.displaymessage || error.errormessage);
        })
    }

    getIndexData() {
        return this.fadMedicalService.fetchMedicalIndex();
    }

    onListItemClicked(specialty) {
        const specialtyData: FadAutoCompleteComplexOption = new FadAutoCompleteComplexOption();
        specialtyData.setSimpleText(specialty.name).setProfileId(specialty.id).setProfileType(FadSearchCategories.speciality).setResourceTypeCode(specialty.resourceTypeCode);
        this.fadService.search = specialtyData;
        this.navCtrl.remove(this.navCtrl.length() - 2, 1, {
            animate: true,
            direction: 'back'
        }).then(() => {
            this.navCtrl.pop();
        });
    }

}
