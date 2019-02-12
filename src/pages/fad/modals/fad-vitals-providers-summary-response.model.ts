import { FadVitalsProvidersSummaryResponseModelInterface } from './interfaces/fad-vitals-collection.interface';

export class FadVitalsProvidersSummaryResponseModel implements FadVitalsProvidersSummaryResponseModelInterface {
    public _meta: FVPSRMeta;
    public provides: FVPSRProvider[];
}

export class FVPSRMeta {
    public counts: FVPSRCountsMeta;
    public oages: FVPSRPagesMeta;
}

class FVPSRCountsMeta {
    public total: number;
}

class FVPSRPagesMeta {
    public total: number;
    public current: number;
    public next: number;
    public previous: number;
}

export class FVPSRProvider {
    public id: number;
    public cost: any[];
    public provider_id: string;
    public provider_type: string;
    public location_id: number;
    public contract_id: number;
    public name: string;
    public first_name: any;
    public middle_name: any;
    public last_name: any;
    public gender: any;
    public photo: any;
    public location_name: string;
    public addr_line1: string;
    public addr_line2: string;
    public city: string;
    public state: string;
    public postal_code: string;
    public longitude: number;
    public latitude: number;
    public distance: number;
    public phone: string;
    public fax: any;
    public primary_specialty: string;
    public accepting_new_patients: string;
    public average_wait_time: any;
    public bdc_info: any;
    public overall_rating: number;
    public ratings_count: number;
    public percent_recommended: number;
    public completed_education: any;
    public awards_count: number;
    public hospital_group_affiliations_count: number;
    public other_location_count: number;
    public search_disclaimers: any[];
    public amenities_count: number;
    public languages: any[];
    public awards: FVPSRAward[];
    public website: any;
    public email: any;
    public tiers: any[];
    public future_effective_date: any;
    public future_termination_date: any;
}
class FVPSRAward {
    public type_code: string;
    public name: string;
    public value: string;
}
