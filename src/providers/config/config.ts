import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { RemoteConfigModel } from '../../models/RemoteConfig-model';

declare var appConfig: any;
@Injectable()
export class ConfigProvider {

  private config: any;
  public assets_url: string;
  public remoteConfigData: Array<RemoteConfigModel> = new Array();
  public remoteConfigMap: Map<string, RemoteConfigModel> = new Map();
  constructor(public http: HttpClient) {

  }

  load() {
    this.config = appConfig;
    this.assets_url = appConfig.assets_url;
    if (appConfig.remoteConfigURL) {
      this.http.get(appConfig.remoteConfigURL)
        .subscribe(remoteConfigData => {
          if (remoteConfigData) {
            this.setRemoteMap(this.remoteConfigData);
            console.log("Remote config object", this.remoteConfigMap);
          }
        },
          (error) => {
            console.log("Error getting remote Config Data", error);
          });
    } else {
    }
  }

  setRemoteMap(remoteConfigData) {
    for (let i = 0; i < remoteConfigData.length; i++) {
      this.remoteConfigMap.set(remoteConfigData[i].id, remoteConfigData[i]);
    }
  }

  showFeature(id): Boolean {
    if (this.remoteConfigMap.has(id) && this.remoteConfigMap.get(id).action == "hide") {
      return false;
    }
    return true;
  }

  assetsUrl() {
    return this.getProperty("assets_url");
  }

  getProperty(property: string): any {
    return this.config[property];
  }

}
