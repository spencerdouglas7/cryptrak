import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLogin: boolean = true;

  constructor(usersService: UsersService) { }

  ngOnInit(): void {
  }
  handleAuthViewChange(event: any) {
    this.isLogin = (event == 'login');
  }

}
