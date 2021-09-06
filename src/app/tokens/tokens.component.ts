import { Component, OnInit, Pipe } from '@angular/core';
import { TokensService } from '../tokens.service';
import { TokenComponent } from '../token/token.component'
import { StarComponent } from '../star/star.component';
import { TokenData } from '../TokenData';
import { WatchedService } from '../watched.service';
import { CookieService } from 'ngx-cookie-service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';





let userWatchlist: any;

@Pipe({
    name: "ranking",
    pure: false
})
export class RankTokens {
    transform(tokens: TokenData[]) {
        tokens.sort((a, b) => {
            if (userWatchlist[a.symbol] && userWatchlist[b.symbol]) {
                return (a.rank - b.rank);
            }
            if (userWatchlist[a.symbol]) {
                return -1;
            }
            if (userWatchlist[b.symbol]) {
                return 1
            }
            return (a.rank - b.rank);
        });
        return tokens;
    }
}


@Component({
    selector: 'tokens',
    templateUrl: './tokens.component.html',
    styleUrls: ['./tokens.component.css']
})
export class TokensComponent implements OnInit {
    tokens: TokenData[] = [];
    constructor(tokensService: TokensService, watchedService: WatchedService, cookieService: CookieService) {
        this.tokens = tokensService.getAllTokens();
        userWatchlist = {};
        let userId = cookieService.get('userId');
        let loginToken = cookieService.get('loginToken');

        watchedService.getWatchlistForCurrentUser(userId, loginToken).then((result) => {
            //Parsing the python list plaintext here into something usable... unbelievably messy;
            // a more elegant solution would be preferable for readability #IFIHAVETIME
            let rawEntries : string[] = (<string> result).split('\n');
            rawEntries.shift();
            rawEntries.shift();
            for (let i = 0; i< rawEntries.length; i += 3) {
                let tokenSymbol = rawEntries[i].split('\"')[1];
                if (tokenSymbol)
                userWatchlist[tokenSymbol] = "watched";
            }

        });
    }


    isWatched(tokenSymbol: string) {
        return userWatchlist[tokenSymbol] != undefined;
    }


    ngOnInit(): void {

    }

}
