import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WatchedService {

saveTokenToWatchlist(tokenSymbol: string, userId: string, loginToken: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let data = {
            id: userId,
            symbol: tokenSymbol,
            token: loginToken
        }
    
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://127.0.0.1:5000/watchtoken");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            let response: any;
            xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                response = xhr.responseText;
                resolve(response);
            }};
    
            xhr.send(JSON.stringify(data));
    });
}
unsaveTokenFromWatchlist(tokenSymbol: string, userId: string, loginToken: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let data = {
            id: userId,
            symbol: tokenSymbol,
            token: loginToken
        }
    
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://127.0.0.1:5000/unwatchtoken");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            let response: any;
            xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                response = xhr.responseText;
                resolve(response);
            }};
    
            xhr.send(JSON.stringify(data));
    });
}


  constructor() { }
}
