import { Component, OnInit, Pipe, ElementRef } from '@angular/core';
import { TokensService } from '../tokens.service';
import { TokenComponent } from '../token/token.component'
import { StarComponent } from '../star/star.component';
import { TokenData } from '../TokenData';
import { WatchedService } from '../watched.service';
import { CookieService } from 'ngx-cookie-service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { UsersService } from '../users.service';

let userWatchlist: any;

@Component({
    selector: 'tokens',
    templateUrl: './tokens.component.html',
    styleUrls: ['./tokens.component.css']
})
export class TokensComponent implements OnInit {
    tokens: TokenData[] = [];
    refreshCount: number = 0;
    constructor(private tokensService: TokensService, private watchedService: WatchedService, 
                private cookieService: CookieService, private userService: UsersService) {
        tokensService.getAllTokens().then((result) => {
            this.tokens = result as TokenData[];
            // this.updateRankings();
        });

        
    }

    updateRankings(tokenSymbol: string) {
        if (tokenSymbol) {
            if (this.isWatched(tokenSymbol)) {
                delete userWatchlist[tokenSymbol];
            } else {
                userWatchlist[tokenSymbol] = "watched";
            }
        }
        this.refreshCount = ++this.refreshCount;  

    }
    isWatched(tokenSymbol: string) {
        return userWatchlist[tokenSymbol] != undefined;
    }

    ngOnInit(): void {
        userWatchlist = {};
        this.userService.authenticationStatus.subscribe((state) => {
            console.log('state change: ', state)
            if (state == 'authenticated') {
                let userId = this.cookieService.get('userId');
                let loginToken = this.cookieService.get('loginToken');
                
                this.watchedService.getWatchlistForCurrentUser(userId, loginToken).then((result) => {
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
            
        });
    }

} //end of Tokens component


@Pipe({
    name: "ranking",
    pure: false
})
export class RankTokens {
    transform(tokens: TokenData[], refreshCount: number) {
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
