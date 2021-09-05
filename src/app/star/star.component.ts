import { Component, OnInit, Input } from '@angular/core';
import { WatchedService } from '../watched.service';
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
    constructor(private watchedService: WatchedService) {}
    didClickStar() {

        if (this.filled) {
            this.filled = false;
            
            this.imgSrc = unfilledSrc;
            console.log(this.imgSrc);
            //this.saveTokenToWatchlist(this.tokenSymbol);
        }
        else {
            console.log()
            this.filled = true;
            this.imgSrc = filledSrc;
            console.log(this.imgSrc);
            //this.unsaveTokenFromWatchlist(this.tokenSymbol);
        }
    }

    saveTokenToWatchlist(tokenSymbol: string) {
        this.watchedService.saveTokenToWatchlist(tokenSymbol);
    }
    unsaveTokenFromWatchlist(tokenSymbol: string) {
        this.watchedService.unsaveTokenFromWatchlist(tokenSymbol);
    }

    ngOnInit(): void { }


}
