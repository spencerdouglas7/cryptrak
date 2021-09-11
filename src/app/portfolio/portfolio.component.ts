import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PortfolioService } from '../portfolio.service';
import { UsersService } from '../users.service';
import { CookieService } from 'ngx-cookie-service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NONE_TYPE } from '@angular/compiler';

@Component({
  selector: 'portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  animations: [
    trigger(
      'inOutAnimation', 
      [
        state('open', style({
          opacity: 1,
          visibility: 'visible'
        })),
        state('closed', style({
          opacity: .25,
          color: 'red',
          visibility: 'hidden'
        })),
        transition('open => closed', [
          animate('.3s 0s ease-out')
        ]),
        transition('closed => open', [
          animate('.3s 0s ease-in')
        ]),
      ]
    )
  ]
})
export class PortfolioComponent implements OnInit {
  @Output() didSwitchView: EventEmitter<any> = new EventEmitter();
  switchView() {
      this.didSwitchView.emit('register');
  }
  isSale: boolean = false;
  showFullHistory: boolean = false;
  transactions: any[] = [];
  portfolio: any[] = [];
  constructor(private portfolioService: PortfolioService, private userService: UsersService, private cookieService: CookieService) { }

  addTransaction(tokenSymbol: string, amount: string, costBasis: string, userId: string, loginToken: string) {
    //TODO: CHECK FOR PROPER FORMATTED INPUT...

    this.portfolioService.saveTransaction(tokenSymbol, amount, costBasis, userId, loginToken);
  }

  ngOnInit(): void {
    this.userService.authenticationStatus.subscribe((state) => {
        if (state == 'authenticated') {
            let userId = this.cookieService.get('userId');
            let loginToken = this.cookieService.get('loginToken');
            this.portfolioService.getTransactionsForCurrentUser(userId, loginToken).then((result) => {
            this.transactions = result;
            let portfolioTotals: any = {};
            this.transactions.forEach((transaction) => {
              //calculate portfolio
              console.log(transaction)
              
              if (!portfolioTotals[transaction.symbol]) {
                portfolioTotals[transaction.symbol] = {symbol: transaction.symbol, amount: 0, cost: 0};
              }
              let tokenMetricTotals = portfolioTotals[transaction.symbol];
              tokenMetricTotals.amount += parseFloat(transaction.amount);
              tokenMetricTotals.cost += parseFloat(transaction.price);
              
            });
            this.portfolio = Object.values(portfolioTotals);
            /*
              Need something like 
              {BTC: {amount: 1, cost: 20000},
               ETH: {amount: 2, cost: 2000}
              }
            */
                //Parsing the python list plaintext here into something usable... unbelievably messy;
                // // a more elegant solution would be preferable for readability #IFIHAVETIME
                // let rawEntries : string[] = (<string> result).split('\n');
                // rawEntries.shift();
                // rawEntries.shift();
                // for (let i = 0; i< rawEntries.length; i += 3) {
                //     let tokenSymbol = rawEntries[i].split('\"')[1];
                //     if (tokenSymbol)
                //     userWatchlist[tokenSymbol] = "watched";
                // }
            });
        }
        
    });
}

}
