import { Injectable } from '@angular/core';
import { RegisterRequest } from '../../models/login/registerRequest.model';
import { AuthenticationService } from '../../providers/login/authentication.service';


@Injectable()
export class RegistrationComponentService {

  constructor(private authService: AuthenticationService) { }

  registerRequest(registerRequest: RegisterRequest, registerUrl: string) {
    let mask = this.authService.showLoadingMask();
    const isKey2Req = false;
    return this.authService.makeHTTPRequest("post", registerUrl, mask, JSON.stringify(this.authService.encryptPayload(registerRequest, isKey2Req)), this.authService.getHttpOptionsWithoutBearerToken(), 'Registering')
      .map((res) => {
        let resobj = res;//.json();
        return resobj;
      });
  }


}
