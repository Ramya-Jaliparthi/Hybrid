import { GeneralErrorInterface } from "../../../interfaces/generic-app-models.interface";

export interface GetSearchBySpecialityRequestModelInterface {
    userId: string;
    networkId: string;

    getUserId(): string;
    setUserId(userId: string): GetSearchBySpecialityRequestModelInterface;

    getNetworkId(): string;
    setNetworkId(networkId: string): GetSearchBySpecialityRequestModelInterface;

}

export interface GetSearchBySpecialityResponseModelInterface extends GeneralErrorInterface {
    searchSpecialties: GetSearchBySpecialityResponseSearchSpecialtiesInfoInterface[];
}

export interface GetSearchBySpecialityResponseSearchSpecialtiesInfoInterface {
    id: number; // This is the id
    name: string; // This is the name of the Specialty
    resourceTypeCode: string; // This is the resourceTypeCode
}
