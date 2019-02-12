// import { Injectable, NgModule} from '@angular/core';
// import { Observable } from 'rxjs/Observable';
// import {Http} from '@angular/http';
// import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
// import { Inject } from '@angular/core';
// import { InjectionToken } from '@angular/core';

// const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');
// const defaultTimeout = 10000;

// @Injectable()
// export class TimeoutInterceptor implements HttpInterceptor {
//   constructor(@Inject(DEFAULT_TIMEOUT) protected defaultTimeout) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const timeout = Number(req.headers.get('timeout')) || this.defaultTimeout;
//     return next.handle(req).timeout(timeout);
//   }
// }