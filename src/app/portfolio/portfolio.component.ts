import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  @Output() didSwitchView: EventEmitter<any> = new EventEmitter();
  switchView() {
      this.didSwitchView.emit('register');
  }
  isSale: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
