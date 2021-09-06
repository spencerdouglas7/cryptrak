import { Component, OnInit, Input } from '@angular/core';
import { WatchedService } from '../watched.service';
import { CookieService } from 'ngx-cookie-service';
let unfilledSrc: string = "../../assets/unfilledstar.png";
let filledSrc: string = "../../assets/filledstar.png";
@Component({
    selector: 'star',
    templateUrl: './star.component.html',
    styleUrls: ['./star.component.css']
})

export class StarComponent implements OnInit {
    @Input() tokenSymbol: string = "";
    @Input() filled: boolean = false;
    imgSrc: string = unfilledSrc;
    constructor(private watchedService: WatchedService, private cookieService: CookieService) {}
    didClickStar() {
        let userId = this.cookieService.get('userId');
        let loginToken = this.cookieService.get('loginToken');
        if (this.filled) {
            this.filled = false;
            this.imgSrc = unfilledSrc;
            this.unsaveTokenFromWatchlist(this.tokenSymbol, userId, loginToken);
        }
        else {
            this.filled = true;
            this.imgSrc = filledSrc;
            this.saveTokenToWatchlist(this.tokenSymbol, userId, loginToken);
        }
    }

    saveTokenToWatchlist(tokenSymbol: string, userId: string, loginToken: string) {

        this.watchedService.saveTokenToWatchlist(tokenSymbol, userId, loginToken);
    }
    unsaveTokenFromWatchlist(tokenSymbol: string, userId: string, loginToken: string) {
        this.watchedService.unsaveTokenFromWatchlist(tokenSymbol, userId, loginToken);
    }

    ngOnInit(): void { 

    }


}
