export type FadLandingPageComponentMode = 'Normal' | 'Abstract';
export type FadProfileCardComponentMode = 'ListItem' | 'MapItem';

export enum FadMedicalIndexParamType {
    specialities = 'specialities',
    procedures = 'procedures'
}

export enum FadMedicalIndexPageTitle {
    allSpecialities = 'All Specialities',
    allProcedures = 'All Procedures'
}

export enum FadLandingPageFocusTracker {
    searchText = 'searchText',
    zipCode = 'zipCode',
    plan = 'plan',
    dependant = 'dependant'
}

export enum FadSearchType {
    search = 'search',
    zip = 'zip',
    plan = 'plan',
    member = 'member'
}

export enum AuthRequestType {
    login = 'login',
    register = 'register',
    authenticate = 'authenticate'
}

export enum FadSearchCategories {
    professional = 'professional',
    facility = 'facility',
    speciality = 'speciality',
    procedure = 'procedure',
    allProfessional = 'allprofessional',
    allFacility = 'allfacility',
}

export enum FadResourceTypeCode {
    professional = 'P',
    facility = 'F'
}

