import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserContextProvider } from '../../../providers/user-context/user-context';
import { AuthenticationService } from '../../../providers/login/authentication.service';
import { ConfigProvider } from '../../../providers/config/config';

declare var scxmlHandler: any;

@Injectable()
export class UserDevicesMappingProvider {
    mappingUrl = this.config.getProperty("deviceMappingURL");
    constructor(private http: HttpClient, private userContext: UserContextProvider, private config: ConfigProvider, private authService: AuthenticationService) {
        console.log("User devices mapping provider");
    }

    registerUser() {
        if (this.mappingUrl) {
            let requestUrl = this.mappingUrl;
            let data = {
                cmd: "UPDATE_USER_MAPPING",
                loginId: this.userContext.getLoginId(),
                dmId: scxmlHandler.getDMId(),
                deviceType: this.userContext.getDeviceType(),
                deviceIdentifier: scxmlHandler.getDeviceIdentifier()
            };
            console.log("device mapping url : ", requestUrl);
            this.http.post(requestUrl, "data=" + encodeURI(JSON.stringify(data)), this.authService.getHttpOptionsWithoutBearerToken()).subscribe((response) => {
                console.log("Device mapping register response : ", response);
                this.getRegisterdUserId();
            },
                (err) => {
                    console.log("Device mapping error respone", err);
                });
        }
    }

    getRegisterdUserId() {
        if (this.mappingUrl) {
            let requestUrl = this.mappingUrl;
            let data = {
                cmd: "GET_USER_MAPPINGS_FOR_DEVICEID",
                dmId: scxmlHandler.getDMId(),
                deviceType: this.userContext.getDeviceType(),
                deviceIdentifier: scxmlHandler.getDeviceIdentifier()
            };
            console.log("device mapping url : ", requestUrl);
            this.http.post(requestUrl, "data=" + encodeURI(JSON.stringify(data)), this.authService.getHttpOptionsWithoutBearerToken()).subscribe((response) => {
                console.log("get user mappings register response : ", response);
            });
        }
    }

}