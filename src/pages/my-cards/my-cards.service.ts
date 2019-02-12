import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../providers/login/authentication.service';

@Injectable()
export class MyCardsService {

	constructor(private authService: AuthenticationService) { }

	myCardsRequest(myCardsUrl: string, request: any) {
		const isKey2Req = false;
		let mycardsmsg = JSON.stringify(this.authService.encryptPayload(request, isKey2Req));

		return this.authService.makeHTTPRequest("post", myCardsUrl, null, mycardsmsg, this.authService.getHttpOptions(), 'Accessing cards information...')
			.map(res1 => {
				let resobj = res1;
				if (resobj.result === "0") {
					return this.authService.handleDecryptedResponse(resobj);
				}

			});
	}

}