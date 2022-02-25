import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root',
})

export class SocketService{

    socket: any;
    readonly uri: string = environment.socketUrl;
    hostname = window.location.hostname;

    constructor() {
        this.socket = io(this.uri, {
          path: '/socket.io',
          transports: ['websocket'],
          secure: true,
        });
        console.log('origin => ', this.hostname)
    }

    listen(eventName: string){
        return new Observable((subscriber) => {
            this.socket.on(eventName, (data) => {
                subscriber.next(data);
            })
        });
    }

    emit(eventName: string, data: any){
        let host = (this.hostname == 'localhost') ? 'localhost:4200' :  this.hostname;
        this.socket.emit(eventName, data,host);
    }

    broadcastemit(eventName: string, data: any){
        this.socket.broadcastemit(eventName, data);
    }

}
