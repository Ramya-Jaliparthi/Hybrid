//import { FVSSRSpecialityEntity } from './fad-vitals-specilities-search-response.model';
import { GetSearchBySpecialityResponseSearchSpecialtiesInfo } from './getSearchBySpeciality.model';
import { FadVitalsAutoCompleteSearchResponseModelInterface } from './interfaces/fad-vitals-collection.interface';

export class FadVitalsAutoCompleteSearchResponseModel implements FadVitalsAutoCompleteSearchResponseModelInterface {
    public searchParameter: string;
    public professionalsCount: number;
    public facilitiesCount: number;
    public searchSpecialtyCount: number;
    public professionals: FVACSRSearchResultEntity[];
    public facilities: FVACSRSearchResultEntity[];
    public searchSpecialties: GetSearchBySpecialityResponseSearchSpecialtiesInfo[];
    public procedures: FVACSRProcedureEntity[];
}

export class FVACSRMeta {
    public counts: FVACSRCounts;
    public pages: FVACSRPages;
}

class FVACSRCounts {
    public total: FVACSRTotal;
}
class FVACSRTotal {
    public professionals: number;
    public facilities: number;
    public search_specialties: number;
    public procedures: number;
}
export class FVACSRPages {
    public total: number;
    public current: number;
    public next: number;
    public previous: number;
}

export class FVACSRSearchResultEntity {
    public id: number;
    public name: string;
    public specialty: string;
}

class FVACSRLocationEntity {
    public id: number;
    public city: string;
    public state: string;
    public contract_id: number;
}

export class FVACSRProcedureEntity {
    public id: number;
    public name: string;
    public resourceTypeCode: number;
}


