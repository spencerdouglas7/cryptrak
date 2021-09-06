import { Injectable } from '@angular/core';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { TokenComponent } from './token/token.component';
import { StarComponent } from './star/star.component';
import { TokenData } from './TokenData';
@Injectable({
  providedIn: 'root'
})
export class TokensService {
  constructor() { }

  getAllTokens(): TokenData[] {
    let allTokens: TokenData[] = [];
    const url='http://127.0.0.1:5000/api/v1/tokenprices';
    fetch(url, {mode: 'cors'})
    .then(async function(response) {
        // handle the response
        let allTokensJSON = await response.json();
        let tokens = Object.entries(allTokensJSON);
        console.log(tokens)
        tokens.forEach((tokenJSON: any) => {
          let symbol = tokenJSON[0];
          let data = tokenJSON[1].data
          let name = tokenJSON[1].name;
          let rank = tokenJSON[1].rank;
          let time = tokenJSON[1].time;
          let newTokenData = new TokenData(symbol, name, rank, time, data);
          allTokens.push(newTokenData)
        });
        allTokens = allTokens.sort((a,b) => {
          return a.rank - b.rank;
        });
    })
    .catch(error => {
        //TODO: handle the error
        console.log(error)
    });
  
    return allTokens;

  }
}

