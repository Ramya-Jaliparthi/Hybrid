export interface LeafLetResponseModelInterface {
    query: any[];
    features: LeafLetFeaturesModelInterface[];
    type: string;
    attribution: string;
}

export interface LeafLetFeaturesModelInterface {
    address: string;
    context: FeaturesContextModelInterface[];
    geometry: any[];
    id: string;
    place_name: string;
    place_type: any[];
    properties: FeaturesPropertiesModelInterface;
    relevance: number;
    text: string;
    type: string;
}

export interface FeaturesContextModelInterface {
    id: string;
    short_code: string;
    text: string;
    wikidata: string;
}

export interface FeaturesPropertiesModelInterface {
    short_code: string;
    wikidata: string;
}