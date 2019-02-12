import { FadMedicalIndexRequestModalInterface } from './interfaces/fad-medical-index.interface';

export class FadMedicalIndexRequestModal implements FadMedicalIndexRequestModalInterface {
    public useridin: string;
    public networkId: number;

    public setUserId(useridin: string): FadMedicalIndexRequestModal {
        this.useridin = useridin;
        return this;
    }

    public setNetworkId(networkId: number): FadMedicalIndexRequestModal {
        this.networkId = networkId;
        return this;
    }
}
