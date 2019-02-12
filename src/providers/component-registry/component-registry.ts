import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ComponentRegistryProvider {

  private registry = new Map<string, any>();
  constructor(public http: HttpClient) {
  }

  register(name: string, component: any) {
    this.registry.set(name, component);
  }

  getComponent(name: string) {
    return this.registry.get(name);
  }

}
