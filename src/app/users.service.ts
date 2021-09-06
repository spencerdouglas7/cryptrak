import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

    constructor() { }

    registerUser(email: string, password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let data = {
                email: email,
                password: password
            }
        
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://127.0.0.1:5000/register");
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("Content-Type", "application/json");
                let response: any;
                xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    response = xhr.responseText;
                    resolve(response);
                }};
        
                xhr.send(JSON.stringify(data));
        })
        
        //TODO: Maybe come back to work with fetch. Fetch is more modern, but seems to be primarily intended to be JS-JS
        //end to end; the body is sent as a ReadableStream which doesn't yet seem to work well with python

        // const url='http://127.0.0.1:5000/register';
        // fetch(url, {
        //   method: 'POST', // *GET, POST, PUT, DELETE, etc.
        // mode: 'cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        // headers: {
        //   'Content-Type': 'application/json'
        //   // 'Content-Type': 'application/x-www-form-urlencoded',
        // },
        // redirect: 'follow', // manual, *follow, error
        // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body: JSON.stringify(data) // body data type must match "Content-Type" header
        // })
        // .then(async function(response) {
        //     console.log(response)
        // })
        // .catch(error => {
        //     //TODO: handle the error
        //     console.log(error)
        // });
    }

}
