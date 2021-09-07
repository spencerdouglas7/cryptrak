import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { UsersService } from '../users.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() didSwitchView: EventEmitter<any> = new EventEmitter();
  
  switchView() {
      this.didSwitchView.emit('login');
  }
  username: string = "";
  password: string = "";
  errors: string = "";
  constructor(private usersService: UsersService, private cookieService: CookieService) { 
    
  }

  async register(email: string, password: string) {
    this.errors = "";
    if (!email.length) {
      this.errors += "Your username is invalid.\n"
    }
    if (password.length < 8) {
      this.errors += "Your password must be at least 8 characters.\n"
    }
    if (this.errors.length) {
      console.log(this.errors);
      return;
    }
    let result : any = await this.usersService.registerUser(email, password);
    let json = JSON.parse(result); 
    let id = json.id;
    let loginToken = json.login_token;
    if (id && loginToken) {
      this.cookieService.set('userId', id);
      this.cookieService.set('loginToken', loginToken);
      this.usersService.userDidAuthenticate();
    }
  }

  ngOnInit(): void {
    console.log(this.cookieService.get('userId'),
    this.cookieService.get('loginToken'));
  }

}
