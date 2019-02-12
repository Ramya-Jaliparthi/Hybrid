import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoadingMaskProvider {

  private mask;
  constructor(public http: HttpClient, private loadingMask: LoadingController) {
  }

  showLoadingMask(message?: any): any {

    this.mask = this.loadingMask.create({
      content: message ? message : 'Accessing Data...',
      showBackdrop: false,
      enableBackdropDismiss: true,
      dismissOnPageChange: false,
      spinner: 'hide',


    });
    this.mask.present();
    return this.mask;

  }

  hideLoadingMask(loadingMask: any) {
    loadingMask.dismiss();
  }


}
