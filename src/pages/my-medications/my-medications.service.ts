import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';

@Injectable()
export class MyMedicationsService {

  constructor(private authService: AuthenticationService) { }

  myMedicationsRequest(myMedicationsUrl: string, mask: any, request: any, options: any, myMedicationsText: string) {
    const isKey2Req = false;

    return this.authService.makeHTTPRequest("post", myMedicationsUrl, mask, JSON.stringify(this.authService.encryptPayload(request, isKey2Req)), this.authService.getHttpOptions(), myMedicationsText)
      .map((res) => {
        let resobj = res;
        if (resobj.result === "0") {
          return this.authService.handleDecryptedResponse(resobj);
        } else {
          console.log('getRecentRx :: error =' + resobj.errormessage);
          this.authService.handleAPIResponseError(resobj, resobj.displaymessage);
          return resobj;
        }
      });
  }

}