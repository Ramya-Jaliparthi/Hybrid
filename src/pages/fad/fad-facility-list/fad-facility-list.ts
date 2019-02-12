
import { FadConstants } from './../constants/fad.constants';
import { Component, OnInit, Input, Output, SimpleChanges, ElementRef, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { HashMap } from './../modals/hash-map.model';
import { FadMedicalIndexService } from '../fad-medical-index/fad-medical-index.service';
import { FadFacilityListComponentInputModelInterface, SortInterface } from '../modals/interfaces/fad-search-list.interface';
import { FadVitalsFacilitiesSearchResponseModelInterface } from '../modals/interfaces/fad-vitals-collection.interface';
import {
  GetSearchByFacilityResponseModelInterface, Facets,
  AcceptingNewPatientsInterface, TreatedTypeCodeInterface, OverallRatingInterface, FieldSpecialtyIdInterface,
  GrpHospitalAffiliationIdInterface, LocationGeoInterface, ProfessionalGenderInterface, ProfessionalLanguageInterface,
  TechSavvyInterface, InNetworkInterface, BdcTypeCodesInterface, AwardTypeCodesInterface, CqmsInterface, TreatmentMethodsTypeCodeInterface, DisordersTreatedTypeCodeInterface
} from '../modals/interfaces/getSearchByFacility-models.interface';
import { FadFacilityCardComponentInputModel } from '../modals/fad-facility-card.modal';
import {
  GetSearchByFacilityRequestModel, FadFacility,
  AcceptingNewPatients, TechSavvy, InNetwork
} from '../modals/getSearchByFacility.model';

/**
 * Generated class for the FadFacilityList page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-fad-facility-list',
  templateUrl: 'fad-facility-list.html',
})
export class FadFacilityListPage {

  @Input('componentInput') componentInput: FadFacilityListComponentInputModelInterface;
  @Output('infiniteScroll') infiniteScroll = new EventEmitter();
  @Output('applyFilter') applyFilterEmitter = new EventEmitter();
  @Output('clearFilter') clearFilterEmitter = new EventEmitter();

  public isNoSearchResults: boolean = false;
  public form: FormGroup;
  public searchResponse: FadVitalsFacilitiesSearchResponseModelInterface;
  public facilityList: FadFacility[] = null;
  public facets: Facets = null;
  public selectedSort: string;
  public initialFormRaw;
  public sortList: SortInterface[] = [
    {
      value: 'Distance',
      selected: true
    },
    {
      value: 'Best Match',
      selected: false
    },
    {
      value: 'Last Name A-Z',
      selected: false
    },
    {
      value: 'Last Name Z-A',
      selected: false
    },
    {
      value: 'Quality',
      selected: false
    },
    {
      value: 'Rating',
      selected: false
    }
  ];

  public filterDisplayList = [];
  public acceptingNewPatients: AcceptingNewPatientsInterface;
  public techSavvy: TechSavvyInterface;
  public inNetwork: InNetworkInterface;
  public locationGeo: LocationGeoInterface[] = [];
  public professionalGender: ProfessionalGenderInterface[] = [];
  public professionalLanguages: ProfessionalLanguageInterface[] = [];
  public overallRating: OverallRatingInterface[] = [];
  public treatedTypeCodes: TreatedTypeCodeInterface[] = [];
  public fieldSpecialtyIds: FieldSpecialtyIdInterface[] = [];
  public disordersTreatedTypeCodes: DisordersTreatedTypeCodeInterface[] = [];
  public treatmentMethodsTypeCodes: TreatmentMethodsTypeCodeInterface[] = [];
  public grpHospitalAffiliationIds: GrpHospitalAffiliationIdInterface[] = [];
  public bdcTypeCodes: BdcTypeCodesInterface[] = [];
  public awardTypeCodes: BdcTypeCodesInterface[] = [];
  public cqms: CqmsInterface[] = [];

  public indexMap: HashMap<string[]> = new HashMap<string[]>();
  public users: any[] = [];
  public showFilter: boolean = false;
  public expandedHeight: string = '44px';
  public collapsedHeight: string = '44px';
  public expandedSortHeight: string = '59px';
  public collapsedSortHeight: string = '59px';
  public accordionExpanded: boolean;

  constructor(public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private http: Http,
    private fadMedicalIndexService: FadMedicalIndexService,
    private cdRef: ChangeDetectorRef,
    private el: ElementRef) {
    this.selectedSort = FadConstants.defaultSort;
    this.buildForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FadFaciltyListPage');
  }

  ngOnChanges(changes: SimpleChanges) {
    this.componentInput = changes.componentInput.currentValue;
    if (this.componentInput) {
      this.searchResponse = this.componentInput.searchResults;
      if (this.searchResponse) {
        this.facilityList = this.searchResponse.facilities;
        this.facets = this.searchResponse.facets;
        this.isNoSearchResults = false;
      } else {
        this.isNoSearchResults = true;
      }
      this.buildFilter();
      this.cdRef.detectChanges();
    }
  }

  buildFilter() {
    if (this.facets && this.facets.constructor === Object && Object.keys(this.facets).length !== 0) {
      this.fieldSpecialtyIds = this.facets.fieldSpecialtyIds || [];
      this.grpHospitalAffiliationIds = this.facets.grpHospitalAffiliationIds || [];
      this.locationGeo = this.facets.locationGeo || [];
      this.overallRating = this.facets.overallRating || [];
      this.professionalGender = this.facets.professionalGender || [];
      this.professionalLanguages = this.facets.professionalLanguages || [];
      this.treatedTypeCodes = this.facets.treatedTypeCodes || [];
      this.disordersTreatedTypeCodes = this.facets.disordersTreatedTypeCodes || [];
      this.treatmentMethodsTypeCodes = this.facets.treatmentMethodsTypeCodes || [];
      this.bdcTypeCodes = this.facets.bdcTypeCodes|| [];
      this.awardTypeCodes = this.facets.awardTypeCodes || [];
      this.cqms = this.facets.cqms || [];
      if (this.facets.acceptingNewPatients && this.facets.acceptingNewPatients.constructor === Object && Object.keys(this.facets.acceptingNewPatients).length !== 0) {
        this.acceptingNewPatients = new AcceptingNewPatients();
        this.acceptingNewPatients.name = this.facets.acceptingNewPatients.name || FadConstants.acceptingNewPatients;
        this.acceptingNewPatients.selected = this.facets.acceptingNewPatients.selected;
        if (this.acceptingNewPatients.selected === undefined || this.acceptingNewPatients.selected === null) {
          if (this.facets.acceptingNewPatients.value === 'Y' || this.facets.acceptingNewPatients.value === true) {
            this.acceptingNewPatients.selected = true;
          } else {
            this.acceptingNewPatients.selected = false;
          }
        }
        this.acceptingNewPatients.count = this.facets.acceptingNewPatients.count;
      } else {
        this.acceptingNewPatients = this.facets.acceptingNewPatients;
      }
      if (this.facets.techSavvy && this.facets.techSavvy.constructor === Object && Object.keys(this.facets.techSavvy).length !== 0) {
        this.techSavvy = new TechSavvy();
        this.techSavvy.name = this.facets.techSavvy.name || FadConstants.techSavvy;
        this.techSavvy.count = this.facets.techSavvy.count;
        this.techSavvy.selected = this.facets.techSavvy.selected;
      } else {
        this.techSavvy = this.facets.techSavvy;
      }
      if (this.facets.inNetwork && this.facets.inNetwork.constructor === Object && Object.keys(this.facets.inNetwork).length !== 0) {
        this.inNetwork = new InNetwork();
        this.inNetwork.name = this.facets.inNetwork.name || FadConstants.inNetworkOnly;
        this.inNetwork.selected = this.facets.inNetwork.selected;
        if (this.inNetwork.selected === undefined || this.inNetwork.selected === null) {
          if (this.facets.inNetwork.value === 'Y' || this.facets.inNetwork.value === true) {
            this.inNetwork.selected = true;
          } else {
            this.inNetwork.selected = false;
          }
        }
        this.inNetwork.count = this.facets.inNetwork.count;
      } else {
        this.inNetwork = this.facets.inNetwork;
      }
      if ((this.acceptingNewPatients instanceof Array) && this.acceptingNewPatients.length > 0) {
        this.acceptingNewPatients = this.acceptingNewPatients[0];
      }
      if ((this.techSavvy instanceof Array) && this.techSavvy.length > 0) {
        this.techSavvy = this.techSavvy[0];
      }
      if ((this.inNetwork instanceof Array) && this.inNetwork.length > 0) {
        this.inNetwork = this.inNetwork[0];
      }
      this.filterDisplayList = [this.acceptingNewPatients, this.techSavvy, this.inNetwork];
      this.filterDisplayList = this.filterDisplayList.filter((element) => {
        return (element !== undefined && element !== null);
      });
      this.buildForm();
    }
  }

  buildForm() {
    const filterDisplayList = this.filterDisplayList.map(c => new FormControl(c.selected || false));
    const sortSelected = this.sortList.filter(c => {
      return c.selected === true;
    });
    const locationSelected = this.locationGeo.filter(c => {
      return c.selected === true;
    });
    const fieldSpecialtyIdSelected = this.fieldSpecialtyIds.filter(c => {
      return c.selected === true;
    });
    const grpHospitalAffiliationIdSelected = this.grpHospitalAffiliationIds.filter(c => {
      return c.selected === true;
    });
    const overallRatingSelected = this.overallRating.filter(c => {
      return c.selected === true;
    });
    const professionalGenderSelected = this.professionalGender.filter(c => {
      return c.selected === true;
    });
    const professionalLanguageSelected = this.professionalLanguages.filter(c => {
      return c.selected === true;
    });
    const treatedTypeCodeSelected = this.treatedTypeCodes.filter(c => {
      return c.selected === true;
    });
    const disordersTreatedTypeCodeSelected = this.disordersTreatedTypeCodes.filter(c => {
      return c.selected === true;
    });
    const treatmentMethodsTypeCodeSelected = this.treatmentMethodsTypeCodes.filter(c => {
      return c.selected === true;
    });
    const bdcTypeCodeSelected = this.bdcTypeCodes.filter(c => {
      return c.selected === true;
    });
    const awardTypeCodeSelected = this.awardTypeCodes.filter(c => {
      return c.selected === true;
    });
    const cqmsSelected = this.cqms.filter(c => {
      return c.selected === true;
    });
    this.form = this.formBuilder.group({
      sort: new FormControl(sortSelected[0].value),
      fieldSpecialtyId: fieldSpecialtyIdSelected && fieldSpecialtyIdSelected.length > 0 ? new FormControl(fieldSpecialtyIdSelected[0].value) : new FormControl(null),
      grpHospitalAffiliationId: grpHospitalAffiliationIdSelected && grpHospitalAffiliationIdSelected.length > 0 ? new FormControl(grpHospitalAffiliationIdSelected[0].value) : new FormControl(null),
      locationGeo: locationSelected && locationSelected.length > 0 ? new FormControl(locationSelected[0].value) : new FormControl(null),
      overallRating: overallRatingSelected && overallRatingSelected.length > 0 ? new FormControl(overallRatingSelected[0].value) : new FormControl(null),
      professionalGender: professionalGenderSelected && professionalGenderSelected.length > 0 ? new FormControl(professionalGenderSelected[0].value) : new FormControl(null),
      professionalLanguage: professionalLanguageSelected && professionalLanguageSelected.length > 0 ? new FormControl(professionalLanguageSelected[0].value) : new FormControl(null),
      treatedTypeCode: treatedTypeCodeSelected && treatedTypeCodeSelected.length > 0 ? new FormControl(treatedTypeCodeSelected[0].value) : new FormControl(null),
      disordersTreatedTypeCode: disordersTreatedTypeCodeSelected && disordersTreatedTypeCodeSelected.length > 0 ? new FormControl(disordersTreatedTypeCodeSelected[0].value) : new FormControl(null),
      treatmentMethodsTypeCode: treatmentMethodsTypeCodeSelected && treatmentMethodsTypeCodeSelected.length > 0 ? new FormControl(treatmentMethodsTypeCodeSelected[0].value) : new FormControl(null),
      bdcTypeCode: bdcTypeCodeSelected && bdcTypeCodeSelected.length > 0 ? new FormControl(bdcTypeCodeSelected[0].value) : new FormControl(null),
      awardTypeCode: awardTypeCodeSelected && awardTypeCodeSelected.length > 0 ? new FormControl(awardTypeCodeSelected[0].value) : new FormControl(null),
      cqms: cqmsSelected && cqmsSelected.length > 0 ? new FormControl(cqmsSelected[0].value) : new FormControl(null),
      filterDisplayList: new FormArray(filterDisplayList)
    });
    // this.processAllSelection();
    this.initialFormRaw = this.form.getRawValue();
  }

  // FadFacilityCardConsumer consumption requirement
  getFacilityCardInput(facility: FadFacility): FadFacilityCardComponentInputModel {
    return new FadFacilityCardComponentInputModel(facility);
  }

  loadMore(infiniteScroll) {
    this.infiniteScroll.emit({
      infiniteScroll
    });
  }

  sortChange() {
    this.selectedSort = this.form.get('sort').value;
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  // applyFilter() {
  //   this.toggleFilter();
  //   this.collapseAccordion();
  //   this.applyFilterEmitter.emit({
  //     filter: this.getFilterObject()
  //   });
  // }

  clearFilter() {
    this.toggleFilter();
    this.form.patchValue(this.initialFormRaw);
    // this.form.enable();
    // this.processAllSelection();
    setTimeout(() => {
      this.sortChange();
      this.collapseAccordion();
      this.clearFilterEmitter.emit({
        filter: this.getFilterObject()
      });
    }, 100);
  }

  getFilterObject() {
    let raw = this.form.getRawValue();
    raw.filterDisplayList = raw.filterDisplayList.map((c, i) => {
      return {
        value: this.filterDisplayList[i].name,
        selected: c
      }
    });
    return raw;
  }

  collapseAccordion() {
    this.accordionExpanded = false;
    setTimeout(() => {
      this.accordionExpanded = null;
    }, 200);
  }

  trackByFn(index, item) {
    return index;
  }
}
