import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  userKnown: boolean = false;
  userValidated: boolean = false;
  isRegister: boolean = true;

  constructor(private usersService: UsersService, private cookieService: CookieService) { 
    let userId = this.cookieService.get('userId');
    let loginToken = this.cookieService.get('loginToken');
    if (userId.length && loginToken.length) {
      this.userKnown = true; //we have seen the user before, regardless of the result of authentication
      //User has a login token; attempt to validate
      this.usersService.validateToken(userId, loginToken).then (result => {
        let response = JSON.parse(result);
        if (response && response.status == 'validated') {
          this.usersService.userDidAuthenticate();
          this.userValidated = true;
        } else {
          //user provided a token, but it was not valid
          this.userValidated = false;
          this.isRegister = false;
        }
      });
    } else {
      //User is unknown to us; provide means to create an account
      this.userKnown = false;
      this.userValidated = false;
      this.isRegister = true;
    }
  }

  ngOnInit(): void {
    this.usersService.authenticationStatus.subscribe((status) => {
      if (status == 'authenticated') {
        this.userValidated = true;
      }
    })
  }

  handleAuthViewChange(event: any) {
    this.isRegister = (event == 'register');
  }
}
