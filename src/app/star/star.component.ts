import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.css']
})
export class StarComponent implements OnInit {
  @Input() filled: boolean = false;
  ngOnInit(): void {}


}
