import { Component, OnInit } from '@angular/core';
import { TokensService } from '../tokens.service';
import { TokenComponent } from '../token/token.component'
import { StarComponent } from '../star/star.component';
import { TokenData } from '../TokenData';

@Component({
  selector: 'tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.css']
})
export class TokensComponent implements OnInit {
  tokens: TokenData[];
  constructor(tokensService: TokensService) {
    this.tokens  = tokensService.getAllTokens();
  }

  ngOnInit(): void {
  }

}
