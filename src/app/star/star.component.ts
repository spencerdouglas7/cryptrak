import { Component, OnInit, Input } from '@angular/core';
import { WatchedService } from '../watched.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'star',
    templateUrl: './star.component.html',
    styleUrls: ['./star.component.css']
})

export class StarComponent implements OnInit {
    @Input() tokenSymbol: string = "";
    @Input() filled: boolean = false;
    unfilledSrc: string = "../../assets/unfilledstar.png";
    filledSrc: string = "../../assets/filledstar.png";
    constructor(private watchedService: WatchedService, private cookieService: CookieService) {}

    /*
     * Click handler for this star component.
     */
    didClickStar() {
        let userId = this.cookieService.get('userId');
        let loginToken = this.cookieService.get('loginToken');
        if (this.filled) {
            this.filled = false;
            this.unsaveTokenFromWatchlist(this.tokenSymbol, userId, loginToken);
        }
        else {
            this.filled = true;
            this.saveTokenToWatchlist(this.tokenSymbol, userId, loginToken);
        }
    }

    //TODO: IF THERE IS NO CURRENT USER, REQUEST THE USER TO LOG IN

    /*
     * Attempt to save the corresponding token to the user's watchlist.
     */
    saveTokenToWatchlist(tokenSymbol: string, userId: string, loginToken: string) {
        this.watchedService.saveTokenToWatchlist(tokenSymbol, userId, loginToken);
    }

    /*
     * Attempt to remove the corresponding token from the user's watchlist.
     */
    unsaveTokenFromWatchlist(tokenSymbol: string, userId: string, loginToken: string) {
        this.watchedService.unsaveTokenFromWatchlist(tokenSymbol, userId, loginToken);
    }

    ngOnInit(): void { 

    }


}
