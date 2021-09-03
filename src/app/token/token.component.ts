import { Component, OnInit, Input } from '@angular/core';
import { Token } from '@angular/compiler/src/ml_parser/lexer';

@Component({
  selector: 'token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})

export class TokenComponent implements OnInit {
    @Input() name = '';
    @Input() symbol = '';
    @Input() data: any;
    @Input() rank = 0;

  ngOnInit(): void {
  }


}
