import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AuthenticationStateProvider {

    private subject = new Subject<any>();
    constructor() {
    }

    sendMessage(message: string, data: any) {
        console.log("sending message : " + message);
        this.subject.next({ event: message, data: data });
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

}
