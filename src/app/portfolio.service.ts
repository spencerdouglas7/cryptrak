import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  getTransactionsForCurrentUser(userId: string, loginToken: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        let data = {
            id: userId,
            token: loginToken
        }
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://127.0.0.1:5000/gettransactions");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            let response: any;
            xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                response = xhr.responseText;
                console.log("transForUser ", response);
                //Holy mother of god this is an embarassment of a solution please come back and refactor this 
                //into a robust solution
                //e.g. roll up queries into JSON objects on SQL side and get responses cleanly as JSON here
                let rawData = response;
                let arr: any[] = rawData.split('\n');
                let resultingData = [];
                arr.shift();
                arr.shift();
                for (var i = 0; i < arr.length - 2; i += 6) {
                    var amount = arr[i].trim().replaceAll(',', '');;
                    var price = arr[i + 1].trim().replaceAll(',', '');;
                    var symbol = arr[i + 2].trim().replaceAll('"', '').replaceAll(',', '');
                    var transactionId = arr[i + 3].trim().replaceAll(',', '');;
                    var newData = {amount: amount, price: price, symbol: symbol, transactionId: transactionId}
                    resultingData.push(newData);
                    console.log(i);
                }
                console.log(resultingData);
                resolve(resultingData);
            }};
            xhr.send(JSON.stringify(data));
    });
    /*
[ unshift
    [ unshift
      11, 
      0.1, 
      null, 
      200.2, 
      "BTC", 
      1
    ], 
    [
      11, 
      0.1, 
      null, 
      200.2, 
      "BTC", 
      2
    ]
  ]
    */
}


  /*
  * Attempts to save the selected token to the current user's watchlist
  */   
  saveTransaction(tokenSymbol: string, amount: string, costBasis: string, userId: string, loginToken: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let data = {
            symbol: tokenSymbol,
            amount: amount,
            price: costBasis,
            user_id: userId,
            login_token: loginToken
        }
        console.log('sent', loginToken)
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://127.0.0.1:5000/addtransaction");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            let response: any;
            xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                response = xhr.responseText;
                console.log(response);
                resolve(response);
            }};
    
            xhr.send(JSON.stringify(data));
    });
  }



/*
* Attempts to save the selected token to the current user's watchlist
*/   
deleteTransaction(transactionId: string, userId: string, loginToken: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let data = {
            transaction_id: transactionId,
            user_id: userId,
            token: loginToken
        }
    
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://127.0.0.1:5000/deletetransaction");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            let response: any;
            xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                response = xhr.responseText;
                console.log(response);
                resolve(response);
            }};
    
            xhr.send(JSON.stringify(data));
    });
}






  constructor() { }
}
