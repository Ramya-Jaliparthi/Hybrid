import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'claimsFilter' })
export class ClaimsFilter implements PipeTransform {
  transform(claims: Array<any>, selectedType: string) {

    if (claims != undefined) {
      if (selectedType == "All") {
        return claims;
      } else {
        return claims.filter(claim => claim.svcType == selectedType);
      }
    }
  }
}